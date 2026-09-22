import { Response } from 'express';
import { Facility } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

export const createFacility = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, ...data } = req.body;

  const facility = await Facility.create({
    ...data,
    name,
    slug: slugify(name, { lower: true, strict: true }),
    publishedBy: req.userId,
  });

  await facility.populate('publishedBy', 'name');

  res.status(201).json({
    success: true,
    message: 'Facility created successfully',
    data: { facility },
  });
});

export const getFacilities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, isActive, isPublished, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const facilities = await Facility.find(query)
    .populate('publishedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Facility.countDocuments(query);

  res.json({
    success: true,
    data: {
      facilities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getPublishedFacilities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category } = req.query;
  const query: any = { isPublished: true, isActive: true };
  if (category) query.category = category;

  const facilities = await Facility.find(query)
    .populate('publishedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Facility.countDocuments(query);

  res.json({
    success: true,
    data: {
      facilities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getFacility = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const facility = await Facility.findById(req.params.id)
    .populate('publishedBy', 'name');

  if (!facility) throw new NotFoundError('Facility not found');

  res.json({
    success: true,
    data: { facility },
  });
});

export const getFacilityBySlug = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const facility = await Facility.findOne({ slug: req.params.slug })
    .populate('publishedBy', 'name');

  if (!facility) throw new NotFoundError('Facility not found');

  res.json({
    success: true,
    data: { facility },
  });
});

export const updateFacility = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, ...data } = req.body;

  const facility = await Facility.findById(req.params.id);
  if (!facility) throw new NotFoundError('Facility not found');

  if (name && name !== facility.name) {
    data.slug = slugify(name, { lower: true, strict: true });
  }

  Object.assign(facility, data);
  await facility.save();

  await facility.populate('publishedBy', 'name');

  res.json({
    success: true,
    message: 'Facility updated successfully',
    data: { facility },
  });
});

export const deleteFacility = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const facility = await Facility.findByIdAndDelete(req.params.id);
  if (!facility) throw new NotFoundError('Facility not found');

  res.json({
    success: true,
    message: 'Facility deleted successfully',
  });
});

export const getFacilitiesByCategory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, limit = 10 } = req.query;
  const query: any = { isPublished: true, isActive: true };
  if (category) query.category = category;

  const facilities = await Facility.find(query)
    .populate('publishedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { facilities },
  });
});