import { Response } from 'express';
import { Subject } from '../models';
import { Class } from '../models';
import { Teacher } from '../models';
import { asyncHandler, NotFoundError, BadRequestError, ConflictError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createSubject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, code, classId, teacherId, credits, isCore, description, syllabus, academicYear } = req.body;

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  if (classDoc.academicYear !== academicYear) {
    throw new BadRequestError('Class academic year mismatch');
  }

  const existingSubject = await Subject.findOne({ 
    code: code.toUpperCase(), 
    class: classId, 
    academicYear 
  });
  if (existingSubject) {
    throw new ConflictError('Subject code already exists for this class and academic year');
  }

  if (teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (!teacher.assignedSubjects.some(s => s.toString() === teacherId)) {
      teacher.assignedSubjects.push(teacherId);
      await teacher.save();
    }
  }

  const subject = await Subject.create({
    name,
    code: code.toUpperCase(),
    class: classId,
    teacher: teacherId,
    credits: credits || 1,
    isCore: isCore !== false,
    description,
    syllabus,
    academicYear,
    isActive: true,
  });

  classDoc.subjects.push(subject._id);
  await classDoc.save();

  await Subject.populate(subject, [
    { path: 'class', select: 'name code grade section' },
    { path: 'teacher', select: 'employeeId', populate: { path: 'user', select: 'name' } },
  ]);

  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: { subject },
  });
});

export const getSubjects = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, class: classId, teacher: teacherId, academicYear, isActive } = req.query;
  const query: any = {};

  if (classId) query.class = classId;
  if (teacherId) query.teacher = teacherId;
  if (academicYear) query.academicYear = academicYear;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const subjects = await Subject.find(query)
    .populate('class', 'name code grade section')
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Subject.countDocuments(query);

  res.json({
    success: true,
    data: {
      subjects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getSubject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const subject = await Subject.findById(req.params.id)
    .populate('class', 'name code grade section')
    .populate('teacher', 'employeeId designation')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email phone avatar' },
    });

  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  res.json({
    success: true,
    data: { subject },
  });
});

export const updateSubject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { teacherId, ...updateData } = req.body;

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  if (teacherId !== undefined && teacherId !== subject.teacher?.toString()) {
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new NotFoundError('Teacher not found');
      }
      if (!teacher.assignedSubjects.some(s => s.toString() === teacherId)) {
        teacher.assignedSubjects.push(teacherId);
        await teacher.save();
      }
    }
    if (subject.teacher) {
      const oldTeacher = await Teacher.findById(subject.teacher);
      if (oldTeacher) {
        oldTeacher.assignedSubjects = oldTeacher.assignedSubjects.filter(
          s => s.toString() !== subject._id.toString()
        );
        await oldTeacher.save();
      }
    }
    subject.teacher = teacherId || undefined;
  }

  Object.assign(subject, updateData);
  await subject.save();

  await Subject.populate(subject, [
    { path: 'class', select: 'name code grade section' },
    { path: 'teacher', select: 'employeeId' },
  ]);

  res.json({
    success: true,
    message: 'Subject updated successfully',
    data: { subject },
  });
});

export const deleteSubject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  const classDoc = await Class.findById(subject.class);
  if (classDoc) {
    classDoc.subjects = classDoc.subjects.filter(s => s.toString() !== subject._id.toString());
    await classDoc.save();
  }

  if (subject.teacher) {
    const teacher = await Teacher.findById(subject.teacher);
    if (teacher) {
      teacher.assignedSubjects = teacher.assignedSubjects.filter(
        s => s.toString() !== subject._id.toString()
      );
      await teacher.save();
    }
  }

  await subject.deleteOne();

  res.json({
    success: true,
    message: 'Subject deleted successfully',
  });
});

export const getSubjectsByClass = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { classId, academicYear } = req.query;
  const query: any = { isActive: true };
  if (classId) query.class = classId;
  if (academicYear) query.academicYear = academicYear;

  const subjects = await Subject.find(query)
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ name: 1 });

  res.json({
    success: true,
    data: { subjects },
  });
});