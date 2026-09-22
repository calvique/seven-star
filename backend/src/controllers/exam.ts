import { Response } from 'express';
import { Exam, IExam } from '../models';
import { Class } from '../models';
import { Subject } from '../models';
import { Teacher } from '../models';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createExam = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, type, academicYear, classId, subjects, startDate, endDate, description, instructions } = req.body;

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  if (classDoc.academicYear !== academicYear) {
    throw new BadRequestError('Class academic year mismatch');
  }

  for (const sub of subjects) {
    const subject = await Subject.findById(sub.subjectId);
    if (!subject) {
      throw new NotFoundError(`Subject ${sub.subjectId} not found`);
    }
    if (subject.class.toString() !== classId) {
      throw new BadRequestError(`Subject ${subject.name} does not belong to this class`);
    }
  }

  const exam = await Exam.create({
    name,
    type,
    academicYear,
    class: classId,
    subjects: subjects.map((s: any) => ({
      subject: s.subjectId,
      date: new Date(s.date),
      startTime: s.startTime,
      endTime: s.endTime,
      maxMarks: s.maxMarks,
      passMarks: s.passMarks,
      room: s.room,
      invigilator: s.invigilatorId,
    })),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    description,
    instructions,
    isPublished: false,
  });

  await Exam.populate(exam, [
    { path: 'class', select: 'name code grade section' },
    { path: 'subjects.subject', select: 'name code' },
    { path: 'subjects.invigilator', select: 'employeeId' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: { exam },
  });
});

export const getExams = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, class: classId, type, academicYear, isPublished } = req.query;
  const query: any = {};

  if (classId) query.class = classId;
  if (type) query.type = type;
  if (academicYear) query.academicYear = academicYear;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const exams = await Exam.find(query)
    .populate('class', 'name code grade section')
    .populate('subjects.subject', 'name code')
    .populate('publishedBy', 'name')
    .sort({ startDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Exam.countDocuments(query);

  res.json({
    success: true,
    data: {
      exams,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getExam = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const exam = await Exam.findById(req.params.id)
    .populate('class', 'name code grade section')
    .populate('subjects.subject', 'name code credits')
    .populate('subjects.invigilator', 'employeeId')
    .populate({
      path: 'subjects.invigilator',
      populate: { path: 'user', select: 'name' },
    })
    .populate('publishedBy', 'name');

  if (!exam) {
    throw new NotFoundError('Exam not found');
  }

  res.json({
    success: true,
    data: { exam },
  });
});

export const updateExam = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { subjects, ...updateData } = req.body;

  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    throw new NotFoundError('Exam not found');
  }

  if (exam.isPublished) {
    throw new BadRequestError('Cannot modify published exam');
  }

  if (subjects) {
    for (const sub of subjects) {
      const subject = await Subject.findById(sub.subjectId);
      if (!subject) {
        throw new NotFoundError(`Subject ${sub.subjectId} not found`);
      }
    }
    exam.subjects = subjects.map((s: any) => ({
      subject: s.subjectId,
      date: new Date(s.date),
      startTime: s.startTime,
      endTime: s.endTime,
      maxMarks: s.maxMarks,
      passMarks: s.passMarks,
      room: s.room,
      invigilator: s.invigilatorId,
    }));
  }

  Object.assign(exam, updateData);
  await exam.save();

  await Exam.populate(exam, [
    { path: 'class', select: 'name code grade section' },
    { path: 'subjects.subject', select: 'name code' },
  ]);

  res.json({
    success: true,
    message: 'Exam updated successfully',
    data: { exam },
  });
});

export const publishExam = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    throw new NotFoundError('Exam not found');
  }

  if (exam.isPublished) {
    throw new BadRequestError('Exam already published');
  }

  exam.isPublished = true;
  exam.publishedAt = new Date();
  exam.publishedBy = req.userId as any;
  await exam.save();

  res.json({
    success: true,
    message: 'Exam published successfully',
    data: { exam },
  });
});

export const deleteExam = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    throw new NotFoundError('Exam not found');
  }

  if (exam.isPublished) {
    throw new BadRequestError('Cannot delete published exam');
  }

  await exam.deleteOne();

  res.json({
    success: true,
    message: 'Exam deleted successfully',
  });
});

export const getExamSchedule = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { classId, academicYear } = req.query;
  const query: any = { isPublished: true };
  if (classId) query.class = classId;
  if (academicYear) query.academicYear = academicYear;

  const exams = await Exam.find(query)
    .populate('class', 'name code grade section')
    .populate('subjects.subject', 'name code')
    .populate('subjects.invigilator', 'employeeId')
    .sort({ startDate: 1 });

  res.json({
    success: true,
    data: { exams },
  });
});