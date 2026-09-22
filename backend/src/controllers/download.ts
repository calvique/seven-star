import { Response } from 'express';
import { Download } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createDownload = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const download = await Download.create({
    ...data,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await download.populate('publishedBy', 'name');

  res.status(201).json({
    success: true,
    message: 'Download created successfully',
    data: { download },
  });
});

export const getDownloads = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, isPublic, search, targetAudience } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';
  if (targetAudience) query.targetAudience = targetAudience;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const downloads = await Download.find(query)
    .populate('publishedBy', 'name')
    .sort({ publishedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Download.countDocuments(query);

  res.json({
    success: true,
    data: {
      downloads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublicDownloads = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, targetAudience } = req.query;
  const query: any = { 
    isPublic: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ]
  };
  if (category) query.category = category;
  if (targetAudience) query.targetAudience = targetAudience;

  const downloads = await Download.find(query)
    .populate('publishedBy', 'name')
    .sort({ publishedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Download.countDocuments(query);

  res.json({
    success: true,
    data: {
      downloads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getDownload = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const download = await Download.findById(req.params.id)
    .populate('publishedBy', 'name');

  if (!download) throw new NotFoundError('Download not found');

  res.json({
    success: true,
    data: { download },
  });
});

export const incrementDownloadCount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const download = await Download.findById(req.params.id);
  if (!download) throw new NotFoundError('Download not found');

  download.downloadCount += 1;
  await download.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Download count incremented',
    data: { downloadCount: download.downloadCount },
  });
});

export const updateDownload = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const download = await Download.findById(req.params.id);
  if (!download) throw new NotFoundError('Download not found');

  if (title && title !== download.title) {
    data.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(download, data);
  await download.save();

  await download.populate('publishedBy', 'name');

  res.json({
    success: true,
    message: 'Download updated successfully',
    data: { download },
  });
});

export const deleteDownload = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const download = await Download.findByIdAndDelete(req.params.id);
  if (!download) throw new NotFoundError('Download not found');

  res.json({
    success: true,
    message: 'Download deleted successfully',
  });
});

export const getDownloadsByCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, limit = 10 } = req.query;
  const query: any = { 
    isPublic: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ]
  };
  if (category) query.category = category;

  const downloads = await Download.find(query)
    .populate('publishedBy', 'name')
    .sort({ publishedAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { downloads },
  });
});