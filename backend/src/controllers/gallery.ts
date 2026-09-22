import { Response } from 'express';
import { Gallery } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createGallery = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const gallery = await Gallery.create({
    ...data,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await gallery.populate('publishedBy', 'name');

  res.status(201).json({
    success: true,
    message: 'Gallery created successfully',
    data: { gallery },
  });
});

export const getGalleries = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 12, category, isPublished, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const galleries = await Gallery.find(query)
    .populate('publishedBy', 'name')
    .sort({ eventDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Gallery.countDocuments(query);

  res.json({
    success: true,
    data: {
      galleries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublishedGalleries = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 12, category } = req.query;
  const query: any = { isPublished: true };
  if (category) query.category = category;

  const galleries = await Gallery.find(query)
    .populate('publishedBy', 'name')
    .sort({ eventDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Gallery.countDocuments(query);

  res.json({
    success: true,
    data: {
      galleries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getGallery = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const gallery = await Gallery.findById(req.params.id)
    .populate('publishedBy', 'name');

  if (!gallery) throw new NotFoundError('Gallery not found');

  if (gallery.isPublished) {
    gallery.views += 1;
    await gallery.save({ validateBeforeSave: false });
  }

  res.json({
    success: true,
    data: { gallery },
  });
});

export const getGalleryBySlug = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const gallery = await Gallery.findOne({ slug: req.params.slug })
    .populate('publishedBy', 'name');

  if (!gallery) throw new NotFoundError('Gallery not found');

  if (gallery.isPublished) {
    gallery.views += 1;
    await gallery.save({ validateBeforeSave: false });
  }

  res.json({
    success: true,
    data: { gallery },
  });
});

export const updateGallery = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, ...data } = req.body;

  const gallery = await Gallery.findById(req.params.id);
  if (!gallery) throw new NotFoundError('Gallery not found');

  if (title && title !== gallery.title) {
    data.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(gallery, data);
  await gallery.save();

  await gallery.populate('publishedBy', 'name');

  res.json({
    success: true,
    message: 'Gallery updated successfully',
    data: { gallery },
  });
});

export const deleteGallery = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const gallery = await Gallery.findByIdAndDelete(req.params.id);
  if (!gallery) throw new NotFoundError('Gallery not found');

  res.json({
    success: true,
    message: 'Gallery deleted successfully',
  });
});

export const getGalleriesByCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, limit = 10 } = req.query;
  const query: any = { isPublished: true };
  if (category) query.category = category;

  const galleries = await Gallery.find(query)
    .populate('publishedBy', 'name')
    .sort({ eventDate: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { galleries },
  });
});