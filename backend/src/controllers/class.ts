import { Response } from 'express';
import { Class, IClass } from '../models';
import { Teacher } from '../models';
import { Subject } from '../models';
import { asyncHandler, NotFoundError, BadRequestError, ConflictError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createClass = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, code, level, grade, section, capacity, classTeacherId, subjectIds, academicYear, description } = req.body;

  const existingClass = await Class.findOne({ code: code.toUpperCase(), academicYear });
  if (existingClass) {
    throw new ConflictError('Class code already exists for this academic year');
  }

  if (classTeacherId) {
    const teacher = await Teacher.findById(classTeacherId);
    if (!teacher) {
      throw new NotFoundError('Class teacher not found');
    }
    const currentClassTeacher = await Class.findOne({ classTeacher: classTeacherId, academicYear });
    if (currentClassTeacher) {
      throw new BadRequestError('Teacher is already a class teacher for another class this academic year');
    }
  }

  if (subjectIds && subjectIds.length > 0) {
    const subjects = await Subject.find({ _id: { $in: subjectIds }, academicYear });
    if (subjects.length !== subjectIds.length) {
      throw new BadRequestError('One or more subjects not found');
    }
  }

  const classDoc = await Class.create({
    name,
    code: code.toUpperCase(),
    level,
    grade,
    section: section?.toUpperCase(),
    capacity: capacity || 40,
    classTeacher: classTeacherId,
    subjects: subjectIds || [],
    academicYear,
    description,
    isActive: true,
  });

  await Class.populate(classDoc, [
    { path: 'classTeacher', select: 'employeeId designation' },
    { path: 'subjects', select: 'name code' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Class created successfully',
    data: { class: classDoc },
  });
});

export const getClasses = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, level, academicYear, isActive } = req.query;
  const query: any = {};

  if (level) query.level = level;
  if (academicYear) query.academicYear = academicYear;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const classes = await Class.find(query)
    .populate('classTeacher', 'employeeId')
    .populate({
      path: 'classTeacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('subjects', 'name code')
    .sort({ grade: 1, section: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Class.countDocuments(query);

  res.json({
    success: true,
    data: {
      classes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getClass = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const classDoc = await Class.findById(req.params.id)
    .populate('classTeacher', 'employeeId designation')
    .populate({
      path: 'classTeacher',
      populate: { path: 'user', select: 'name email phone avatar' },
    })
    .populate('subjects', 'name code credits isCore')
    .populate({
      path: 'subjects',
      populate: { path: 'teacher', select: 'employeeId' },
    });

  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  res.json({
    success: true,
    data: { class: classDoc },
  });
});

export const updateClass = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { classTeacherId, subjectIds, ...updateData } = req.body;

  const classDoc = await Class.findById(req.params.id);
  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  if (classTeacherId && classTeacherId !== classDoc.classTeacher?.toString()) {
    const teacher = await Teacher.findById(classTeacherId);
    if (!teacher) {
      throw new NotFoundError('Class teacher not found');
    }
    const currentClassTeacher = await Class.findOne({ 
      classTeacher: classTeacherId, 
      academicYear: classDoc.academicYear,
      _id: { $ne: classDoc._id }
    });
    if (currentClassTeacher) {
      throw new BadRequestError('Teacher is already a class teacher for another class this academic year');
    }
    classDoc.classTeacher = classTeacherId;
  }

  if (subjectIds) {
    const subjects = await Subject.find({ _id: { $in: subjectIds }, academicYear: classDoc.academicYear });
    if (subjects.length !== subjectIds.length) {
      throw new BadRequestError('One or more subjects not found');
    }
    classDoc.subjects = subjectIds;
  }

  Object.assign(classDoc, updateData);
  await classDoc.save();

  await Class.populate(classDoc, [
    { path: 'classTeacher', select: 'employeeId designation' },
    { path: 'subjects', select: 'name code' },
  ]);

  res.json({
    success: true,
    message: 'Class updated successfully',
    data: { class: classDoc },
  });
});

export const deleteClass = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const classDoc = await Class.findById(req.params.id);
  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  const studentCount = await require('../models').Student.countDocuments({ class: classDoc._id });
  if (studentCount > 0) {
    throw new BadRequestError('Cannot delete class with enrolled students');
  }

  await Subject.deleteMany({ class: classDoc._id });
  await classDoc.deleteOne();

  res.json({
    success: true,
    message: 'Class deleted successfully',
  });
});

export const getClassesByLevel = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { level, academicYear } = req.query;
  const query: any = { isActive: true };
  if (level) query.level = level;
  if (academicYear) query.academicYear = academicYear;

  const classes = await Class.find(query)
    .populate('classTeacher', 'employeeId')
    .populate({
      path: 'classTeacher',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ grade: 1, section: 1 });

  res.json({
    success: true,
    data: { classes },
  });
});