import { Response } from 'express';
import { Notice } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createNotice = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const notice = await Notice.create({
    ...data,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await Notice.populate(notice, { path: 'publishedBy', select: 'name' });
  if (notice.classes && notice.classes.length > 0) {
    await Notice.populate(notice, { path: 'classes', select: 'name code' });
  }

  res.status(201).json({
    success: true,
    message: 'Notice created successfully',
    data: { notice },
  });
});

export const getNotices = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, category, priority, isPublished, search, targetAudience } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (targetAudience) query.targetAudience = targetAudience;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const notices = await Notice.find(query)
    .populate('publishedBy', 'name')
    .populate('classes', 'name code')
    .sort({ isPinned: -1, publishedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Notice.countDocuments(query);

  res.json({
    success: true,
    data: {
      notices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublishedNotices = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, category, targetAudience, classId } = req.query;
  const query: any = { 
    isPublished: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ]
  };

  if (category) query.category = category;
  if (targetAudience) query.targetAudience = targetAudience;
  if (classId) query.classes = classId;

  const notices = await Notice.find(query)
    .populate('publishedBy', 'name')
    .populate('classes', 'name code')
    .sort({ isPinned: -1, publishedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Notice.countDocuments(query);

  res.json({
    success: true,
    data: {
      notices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getNotice = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const notice = await Notice.findById(req.params.id)
    .populate('publishedBy', 'name')
    .populate('classes', 'name code');

  if (!notice) throw new NotFoundError('Notice not found');

  if (notice.isPublished) {
    notice.views += 1;
    await notice.save({ validateBeforeSave: false });
  }

  res.json({
    success: true,
    data: { notice },
  });
});

export const getNoticeBySlug = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const notice = await Notice.findOne({ slug: req.params.slug })
    .populate('publishedBy', 'name')
    .populate('classes', 'name code');

  if (!notice) throw new NotFoundError('Notice not found');

  if (notice.isPublished) {
    notice.views += 1;
    await notice.save({ validateBeforeSave: false });
  }

  res.json({
    success: true,
    data: { notice },
  });
});

export const updateNotice = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const notice = await Notice.findById(req.params.id);
  if (!notice) throw new NotFoundError('Notice not found');

  if (title && title !== notice.title) {
    data.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(notice, data);
  await notice.save();

  await Notice.populate(notice, [
    { path: 'publishedBy', select: 'name' },
    { path: 'classes', select: 'name code' },
  ]);

  res.json({
    success: true,
    message: 'Notice updated successfully',
    data: { notice },
  });
});

export const deleteNotice = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice deleted successfully',
  });
});

export const getPinnedNotices = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const notices = await Notice.find({ 
    isPublished: true, 
    isPinned: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ]
  })
    .populate('publishedBy', 'name')
    .sort({ publishedAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: { notices },
  });
});

export const getLatestNotices = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { limit = 5 } = req.query;
  
  const notices = await Notice.find({ 
    isPublished: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ]
  })
    .populate('publishedBy', 'name')
    .populate('classes', 'name code')
    .sort({ publishedAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { notices },
  });
});