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

  const teacher = await Teacher.findOne({ user: req.userId });
  if (teacher && !teacher.assignedSubjects.some(s => s.toString() === subjectId)) {
    throw new ForbiddenError('You are not authorized to enter results for this subject');
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

  const teacher = await Teacher.findOne({ user: req.userId });
  if (teacher && !teacher.assignedSubjects.some(s => s.toString() === subjectId)) {
    throw new ForbiddenError('You are not authorized to enter results for this subject');
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

  const teacher = await Teacher.findOne({ user: req.userId });
  if (teacher && req.user?.role === 'teacher') {
    query.subject = { $in: teacher.assignedSubjects };
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

  const teacher = await Teacher.findOne({ user: req.userId });
  if (teacher && req.user?.role === 'teacher' && !teacher.assignedSubjects.some(s => s.toString() === result.subject.toString())) {
    throw new ForbiddenError('Not authorized to view this result');
  }

  res.json({
    success: true,
    data: { result },
  });
});

export const updateResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { marksObtained, maxMarks, remarks, isPublished } = req.body;

  const result = await Result.findById(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  const teacher = await Teacher.findOne({ user: req.userId });
  if (teacher && req.user?.role === 'teacher' && !teacher.assignedSubjects.some(s => s.toString() === result.subject.toString())) {
    throw new ForbiddenError('Not authorized to update this result');
  }

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

  if (req.user?.role !== 'admin') throw new ForbiddenError('Only admin can publish results');

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
  const { rollNumber, examId, academicYear, symbolNumber } = req.query;

  if (!rollNumber && !symbolNumber) {
    throw new BadRequestError('Roll number or symbol number is required');
  }

  let student;
  if (rollNumber) {
    student = await Student.findOne({ rollNumber, academicYear: academicYear || { $exists: true } });
  } else {
    student = await Student.findOne({ $or: [{ symbolNumber }, { admissionNumber: symbolNumber }], academicYear: academicYear || { $exists: true } });
  }

  if (!student) throw new NotFoundError('Student not found');
  const studentClass = await Class.findById(student.class).select('grade');
  if (!studentClass || ![11, 12].includes(studentClass.grade)) {
    throw new NotFoundError('The public results portal is only available for Class 11 and Class 12');
  }

  const query: any = { student: student._id, isPublished: true };
  if (examId) query.exam = examId;

  const results = await Result.find(query)
    .populate('exam', 'name type academicYear startDate')
    .populate('subject', 'name code')
    .populate('class', 'name code grade section')
    .sort({ 'exam.startDate': -1 });

  await Student.populate(student, { path: 'user', select: 'name' });

  res.json({
    success: true,
    data: {
      student: {
        name: (student as any).user?.name || '',
        admissionNumber: student.admissionNumber,
        rollNumber: student.rollNumber,
        class: student.class,
      },
      results,
    },
  });
});

export const deleteResult = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Result.findByIdAndDelete(req.params.id);
  if (!result) throw new NotFoundError('Result not found');

  res.json({
    success: true,
    message: 'Result deleted successfully',
  });
});