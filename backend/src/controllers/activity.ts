import { Response } from 'express';
import { Activity } from '../models';
import { Teacher } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createActivity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const activity = await Activity.create({
    ...data,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await Activity.populate(activity, [
    { path: 'publishedBy', select: 'name' },
    { path: 'coordinator', select: 'employeeId', populate: { path: 'user', select: 'name' } },
  ]);

  res.status(201).json({
    success: true,
    message: 'Activity created successfully',
    data: { activity },
  });
});

export const getActivities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, frequency, isActive, isPublished, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (frequency) query.frequency = frequency;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const activities = await Activity.find(query)
    .populate('publishedBy', 'name')
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Activity.countDocuments(query);

  res.json({
    success: true,
    data: {
      activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublishedActivities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, gradeLevel } = req.query;
  const query: any = { isPublished: true, isActive: true };
  if (category) query.category = category;
  if (gradeLevel) query.gradeLevel = Number(gradeLevel);

  const activities = await Activity.find(query)
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Activity.countDocuments(query);

  res.json({
    success: true,
    data: {
      activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getActivity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const activity = await Activity.findById(req.params.id)
    .populate('publishedBy', 'name')
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name email phone' },
    });

  if (!activity) throw new NotFoundError('Activity not found');

  res.json({
    success: true,
    data: { activity },
  });
});

export const getActivityBySlug = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const activity = await Activity.findOne({ slug: req.params.slug })
    .populate('publishedBy', 'name')
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name email phone' },
    });

  if (!activity) throw new NotFoundError('Activity not found');

  res.json({
    success: true,
    data: { activity },
  });
});

export const updateActivity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const activity = await Activity.findById(req.params.id);
  if (!activity) throw new NotFoundError('Activity not found');

  if (title && title !== activity.title) {
    data.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(activity, data);
  await activity.save();

  await Activity.populate(activity, [
    { path: 'publishedBy', select: 'name' },
    { path: 'coordinator', select: 'employeeId', populate: { path: 'user', select: 'name' } },
  ]);

  res.json({
    success: true,
    message: 'Activity updated successfully',
    data: { activity },
  });
});

export const deleteActivity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) throw new NotFoundError('Activity not found');

  res.json({
    success: true,
    message: 'Activity deleted successfully',
  });
});

export const getActivitiesByCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, limit = 10 } = req.query;
  const query: any = { isPublished: true, isActive: true };
  if (category) query.category = category;

  const activities = await Activity.find(query)
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { activities },
  });
});

export const getWeeklyECA = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const activities = await Activity.find({ 
    isPublished: true, 
    isActive: true,
    frequency: 'weekly',
  })
    .populate('coordinator', 'employeeId')
    .populate({
      path: 'coordinator',
      populate: { path: 'user', select: 'name' },
    })
    .sort({ 'schedule.dayOfWeek': 1, 'schedule.startTime': 1 });

  res.json({
    success: true,
    data: { activities },
  });
});