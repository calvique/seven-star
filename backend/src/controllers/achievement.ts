import { Response } from 'express';
import { Achievement } from '../models';
import { Student } from '../models';
import { Teacher } from '../models';
import { Class } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createAchievement = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const achievement = await Achievement.create({
    ...data,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await Achievement.populate(achievement, [
    { path: 'publishedBy', select: 'name' },
    { path: 'student', select: 'admissionNumber rollNumber', populate: { path: 'user', select: 'name' } },
    { path: 'teacher', select: 'employeeId', populate: { path: 'user', select: 'name' } },
    { path: 'class', select: 'name code grade' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Achievement created successfully',
    data: { achievement },
  });
});

export const getAchievements = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, level, isPublished, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (level) query.level = level;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const achievements = await Achievement.find(query)
    .populate('publishedBy', 'name')
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('class', 'name code grade')
    .sort({ eventDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Achievement.countDocuments(query);

  res.json({
    success: true,
    data: {
      achievements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublishedAchievements = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, level } = req.query;
  const query: any = { isPublished: true };
  if (category) query.category = category;
  if (level) query.level = level;

  const achievements = await Achievement.find(query)
    .populate('publishedBy', 'name')
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('class', 'name code grade')
    .sort({ eventDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Achievement.countDocuments(query);

  res.json({
    success: true,
    data: {
      achievements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getAchievement = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const achievement = await Achievement.findById(req.params.id)
    .populate('publishedBy', 'name')
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('class', 'name code grade');

  if (!achievement) throw new NotFoundError('Achievement not found');

  res.json({
    success: true,
    data: { achievement },
  });
});

export const getAchievementBySlug = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const achievement = await Achievement.findOne({ slug: req.params.slug })
    .populate('publishedBy', 'name')
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('class', 'name code grade');

  if (!achievement) throw new NotFoundError('Achievement not found');

  res.json({
    success: true,
    data: { achievement },
  });
});

export const updateAchievement = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) throw new NotFoundError('Achievement not found');

  if (title && title !== achievement.title) {
    data.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(achievement, data);
  await achievement.save();

  await Achievement.populate(achievement, [
    { path: 'publishedBy', select: 'name' },
    { path: 'student', select: 'admissionNumber rollNumber', populate: { path: 'user', select: 'name' } },
    { path: 'teacher', select: 'employeeId', populate: { path: 'user', select: 'name' } },
    { path: 'class', select: 'name code grade' },
  ]);

  res.json({
    success: true,
    message: 'Achievement updated successfully',
    data: { achievement },
  });
});

export const deleteAchievement = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  if (!achievement) throw new NotFoundError('Achievement not found');

  res.json({
    success: true,
    message: 'Achievement deleted successfully',
  });
});

export const getAchievementsByCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, level, limit = 10 } = req.query;
  const query: any = { isPublished: true };
  if (category) query.category = category;
  if (level) query.level = level;

  const achievements = await Achievement.find(query)
    .populate('student', 'admissionNumber rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name' },
    })
    .populate('teacher', 'employeeId')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name' },
    })
    .populate('class', 'name code grade')
    .sort({ eventDate: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { achievements },
  });
});