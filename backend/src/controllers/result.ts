import { Response } from 'express';
import mongoose from 'mongoose';
import { Result } from '../models';
import { Student } from '../models';
import { Exam } from '../models';
import { Subject } from '../models';
import { Class } from '../models';
import { Teacher } from '../models';
import { asyncHandler, NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const calculateGrade = (percentage: number): { grade: string; gradePoint: number } => {
  if (percentage >= 90) return { grade: 'A+', gradePoint: 4.0 };
  if (percentage >= 80) return { grade: 'A', gradePoint: 3.6 };
  if (percentage >= 70) return { grade: 'B+', gradePoint: 3.2 };
  if (percentage >= 60) return { grade: 'B', gradePoint: 2.8 };
  if (percentage >= 50) return { grade: 'C+', gradePoint: 2.4 };
  if (percentage >= 40) return { grade: 'C', gradePoint: 2.0 };
  if (percentage >= 35) return { grade: 'D', gradePoint: 1.6 };
  return { grade: 'F', gradePoint: 0 };
};

const getApprovedTeacher = async (req: AuthRequest) => {
  if (req.user?.role !== 'teacher') return null;
  const teacher = await Teacher.findOne({ user: req.userId, isApproved: true, status: 'active' });
  if (!teacher) throw new ForbiddenError('Teacher account is not approved or active');
  return teacher;
};

const ensureTeacherScope = (teacher: any, classId: string, subjectId: string) => {
  const classAllowed = teacher.assignedClasses.some((id: any) => id.toString() === classId);
  const subjectAllowed = teacher.assignedSubjects.some((id: any) => id.toString() === subjectId);
  if (!classAllowed || !subjectAllowed) throw new ForbiddenError('You are not authorized for this class and subject');
};

export const createResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { studentId, examId, subjectId, classId, academicYear, marksObtained, maxMarks, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) throw new NotFoundError('Student not found');

  const exam = await Exam.findById(examId);
  if (!exam) throw new NotFoundError('Exam not found');

  const subject = await Subject.findById(subjectId);
  if (!subject) throw new NotFoundError('Subject not found');

  const classDoc = await Class.findById(classId);
  if (!classDoc) throw new NotFoundError('Class not found');

  const existingResult = await Result.findOne({ student: studentId, exam: examId, subject: subjectId });
  if (existingResult) throw new ConflictError('Result already exists for this student, exam, and subject');

  const teacher = await getApprovedTeacher(req);
  if (teacher) {
    ensureTeacherScope(teacher, classId, subjectId);
    if (student.class.toString() !== classId || exam.class.toString() !== classId || subject.class.toString() !== classId) {
      throw new ForbiddenError('Student, exam, subject and class do not match');
    }
  }

  const percentage = (marksObtained / maxMarks) * 100;
  const { grade, gradePoint } = calculateGrade(percentage);
  const isPass = percentage >= (exam.subjects.find(s => s.subject.toString() === subjectId)?.passMarks || 35);

  const result = await Result.create({
    student: studentId,
    exam: examId,
    subject: subjectId,
    class: classId,
    academicYear,
    marksObtained,
    maxMarks,
    grade,
    gradePoint,
    isPass,
    remarks,
    enteredBy: new mongoose.Types.ObjectId(req.userId),
    enteredAt: new Date(),
    isPublished: false,
  });

  await Result.populate(result, [
    { path: 'student', select: 'admissionNumber rollNumber' },
    { path: 'exam', select: 'name type' },
    { path: 'subject', select: 'name code' },
    { path: 'class', select: 'name code' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Result created successfully',
    data: { result },
  });
});

export const bulkCreateResults = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { examId, subjectId, classId, academicYear, results } = req.body;

  const exam = await Exam.findById(examId);
  if (!exam) throw new NotFoundError('Exam not found');

  const subject = await Subject.findById(subjectId);
  if (!subject) throw new NotFoundError('Subject not found');

  const classDoc = await Class.findById(classId);
  if (!classDoc) throw new NotFoundError('Class not found');

  const teacher = await getApprovedTeacher(req);
  if (teacher) {
    ensureTeacherScope(teacher, classId, subjectId);
    if (exam.class.toString() !== classId || subject.class.toString() !== classId) throw new ForbiddenError('Exam, subject and class do not match');
    const studentIds = results.map((r: any) => r.studentId);
    const students = await Student.find({ _id: { $in: studentIds }, class: classId });
    if (students.length !== studentIds.length) throw new ForbiddenError('One or more students are outside your assigned class');
    const publishedExists = await Result.exists({ student: { $in: studentIds }, exam: examId, subject: subjectId, isPublished: true });
    if (publishedExists) throw new BadRequestError('One or more published results cannot be overwritten by a teacher');
  }

  const subjectExam = exam.subjects.find(s => s.subject.toString() === subjectId);
  const passMarks = subjectExam?.passMarks || 35;

  const bulkOps = results.map((r: any) => {
    const percentage = (r.marksObtained / r.maxMarks) * 100;
    const { grade, gradePoint } = calculateGrade(percentage);
    const isPass = percentage >= passMarks;

    return {
      updateOne: {
        filter: { student: r.studentId, exam: examId, subject: subjectId },
        update: {
          $set: {
            student: r.studentId,
            exam: examId,
            subject: subjectId,
            class: classId,
            academicYear,
            marksObtained: r.marksObtained,
            maxMarks: r.maxMarks,
            grade,
            gradePoint,
            isPass,
            remarks: r.remarks,
            enteredBy: req.userId,
            enteredAt: new Date(),
            isPublished: false,
          },
        },
        upsert: true,
      },
    };
  });

  await Result.bulkWrite(bulkOps);

  res.json({
    success: true,
    message: `${results.length} results created/updated successfully`,
  });
});

export const getResults = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, student, exam, subject, class: classId, academicYear, isPublished } = req.query;
  const query: any = {};

  if (student) query.student = student;
  if (exam) query.exam = exam;
  if (subject) query.subject = subject;
  if (classId) query.class = classId;
  if (academicYear) query.academicYear = academicYear;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const teacher = await getApprovedTeacher(req);
  if (teacher) {
    query.subject = { $in: teacher.assignedSubjects };
    query.class = { $in: teacher.assignedClasses };
  }

  const results = await Result.find(query)
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('exam', 'name type')
    .populate('subject', 'name code')
    .populate('class', 'name code')
    .populate('enteredBy', 'name')
    .populate('verifiedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Result.countDocuments(query);

  res.json({
    success: true,
    data: {
      results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Result.findById(req.params.id)
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name email phone avatar' },
    })
    .populate('exam', 'name type academicYear')
    .populate('subject', 'name code')
    .populate('class', 'name code grade section')
    .populate('enteredBy', 'name')
    .populate('verifiedBy', 'name');

  if (!result) throw new NotFoundError('Result not found');

  const teacher = await getApprovedTeacher(req);
  if (teacher) ensureTeacherScope(teacher, result.class.toString(), result.subject.toString());

  res.json({
    success: true,
    data: { result },
  });
});

export const updateResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { marksObtained, maxMarks, remarks, isPublished } = req.body;

  const result = await Result.findById(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  const teacher = await getApprovedTeacher(req);
  if (teacher) ensureTeacherScope(teacher, result.class.toString(), result.subject.toString());

  if (result.isPublished && req.user?.role !== 'admin') {
    throw new BadRequestError('Cannot modify published result');
  }

  if (marksObtained !== undefined || maxMarks !== undefined) {
    const newMarksObtained = marksObtained ?? result.marksObtained;
    const newMaxMarks = maxMarks ?? result.maxMarks;
    const percentage = (newMarksObtained / newMaxMarks) * 100;
    const { grade, gradePoint } = calculateGrade(percentage);
    
    const exam = await Exam.findById(result.exam);
    const passMarks = exam?.subjects.find(s => s.subject.toString() === result.subject.toString())?.passMarks || 35;
    
    result.marksObtained = newMarksObtained;
    result.maxMarks = newMaxMarks;
    result.grade = grade;
    result.gradePoint = gradePoint;
    result.isPass = percentage >= passMarks;
  }

  if (remarks !== undefined) result.remarks = remarks;
  if (isPublished !== undefined && req.user?.role === 'admin') result.isPublished = isPublished;

  await result.save();

  await Result.populate(result, [
    { path: 'student', select: 'admissionNumber rollNumber' },
    { path: 'exam', select: 'name type' },
    { path: 'subject', select: 'name code' },
    { path: 'class', select: 'name code' },
  ]);

  res.json({
    success: true,
    message: 'Result updated successfully',
    data: { result },
  });
});

export const verifyResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  if (result.verifiedBy) throw new BadRequestError('Result already verified');

  result.verifiedBy = new mongoose.Types.ObjectId(req.userId);
  result.verifiedAt = new Date();
  await result.save();

  res.json({
    success: true,
    message: 'Result verified successfully',
    data: { result },
  });
});

export const publishResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  const teacher = await getApprovedTeacher(req);
  if (req.user?.role !== 'admin' && !teacher) throw new ForbiddenError('Only an approved admin or assigned teacher can publish results');
  if (teacher) ensureTeacherScope(teacher, result.class.toString(), result.subject.toString());

  result.isPublished = true;
  result.publishedAt = new Date();
  await result.save();

  res.json({
    success: true,
    message: 'Result published successfully',
    data: { result },
  });
});

export const getStudentResults = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { examId, academicYear } = req.query;

  const student = await Student.findOne({ user: req.userId });
  if (!student) throw new NotFoundError('Student profile not found');

  const query: any = { student: student._id, isPublished: true };
  if (examId) query.exam = examId;
  if (academicYear) query.academicYear = academicYear;

  const results = await Result.find(query)
    .populate('exam', 'name type')
    .populate('subject', 'name code credits')
    .populate('class', 'name code grade section')
    .sort({ 'exam.startDate': 1 });

  const grouped = results.reduce((acc, result) => {
    const examId = result.exam._id.toString();
    if (!acc[examId]) {
      acc[examId] = {
        exam: result.exam,
        subjects: [],
        totalMarksObtained: 0,
        totalMaxMarks: 0,
      };
    }
    acc[examId].subjects.push({
      subject: result.subject,
      marksObtained: result.marksObtained,
      maxMarks: result.maxMarks,
      grade: result.grade,
      gradePoint: result.gradePoint,
      isPass: result.isPass,
    });
    acc[examId].totalMarksObtained += result.marksObtained;
    acc[examId].totalMaxMarks += result.maxMarks;
    return acc;
  }, {} as any);

  Object.values(grouped).forEach((g: any) => {
    g.percentage = g.totalMaxMarks > 0 ? (g.totalMarksObtained / g.totalMaxMarks) * 100 : 0;
    const { grade, gradePoint } = calculateGrade(g.percentage);
    g.overallGrade = grade;
    g.overallGradePoint = gradePoint;
  });

  res.json({
    success: true,
    data: { results: Object.values(grouped) },
  });
});

export const getResultSheet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { examId, classId, subjectId } = req.query;
  
  if (!examId || !classId) {
    throw new BadRequestError('Exam ID and Class ID are required');
  }

  const query: any = { exam: examId, class: classId, isPublished: true };
  if (subjectId) query.subject = subjectId;

  const results = await Result.find(query)
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('subject', 'name code maxMarks passMarks')
    .sort({ 'student.rollNumber': 1 });

  const students = await Student.find({ class: classId, status: 'active' })
    .populate('user', 'name')
    .sort({ rollNumber: 1 });

  res.json({
    success: true,
    data: { results, students },
  });
});

export const searchResultByRoll = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { rollNumber, examId, academicYear, symbolNumber, classId } = req.query;
  if (!rollNumber && !symbolNumber) throw new BadRequestError('Roll number or symbol number is required');
  const query: any = {};
  if (rollNumber) query.rollNumber = String(rollNumber);
  if (symbolNumber) query.$or = [{ symbolNumber: String(symbolNumber) }, { admissionNumber: String(symbolNumber) }];
  if (academicYear) query.academicYear = String(academicYear);
  if (classId) query.class = String(classId);
  const student = await Student.findOne(query);
  if (!student) throw new NotFoundError('Student not found');
  const studentClass = await Class.findById(student.class).select('name code grade section');
  if (!studentClass || ![11, 12].includes(studentClass.grade)) {
    throw new NotFoundError('This results portal is available for Class 11 and Class 12 only');
  }
  const resultQuery: any = { student: student._id, isPublished: true };
  if (examId) resultQuery.exam = String(examId);
  const results = await Result.find(resultQuery)
    .populate('exam', 'name type academicYear startDate')
    .populate('subject', 'name code')
    .populate('class', 'name code grade section')
    .sort({ createdAt: -1 });
  await Student.populate(student, [{ path: 'user', select: 'name' }, { path: 'class', select: 'name code grade section' }]);
  res.json({ success:true, data:{ student:{ name:(student as any).user?.name || '', admissionNumber:student.admissionNumber, symbolNumber:(student as any).symbolNumber, rollNumber:student.rollNumber, class:student.class }, results } });
});

export const deleteResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Result.findByIdAndDelete(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  res.json({
    success: true,
    message: 'Result deleted successfully',
  });
});