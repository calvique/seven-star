import { Response } from 'express';
import mongoose from 'mongoose';
import { Suggestion } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createSuggestion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const suggestion = await Suggestion.create({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Suggestion submitted successfully',
    data: { suggestion },
  });
});

export const getSuggestions = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, status, priority, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) {
    query.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ];
  }

  const suggestions = await Suggestion.find(query)
    .populate('assignedTo', 'name')
    .populate('respondedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Suggestion.countDocuments(query);

  res.json({
    success: true,
    data: {
      suggestions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getSuggestion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const suggestion = await Suggestion.findById(req.params.id)
    .populate('assignedTo', 'name')
    .populate('respondedBy', 'name');

  if (!suggestion) throw new NotFoundError('Suggestion not found');

  res.json({
    success: true,
    data: { suggestion },
  });
});

export const updateSuggestion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, assignedTo, response, priority } = req.body;

  const suggestion = await Suggestion.findById(req.params.id);
  if (!suggestion) throw new NotFoundError('Suggestion not found');

  if (status) suggestion.status = status;
  if (assignedTo) suggestion.assignedTo = assignedTo;
  if (response) {
    suggestion.response = response;
    suggestion.respondedBy = new mongoose.Types.ObjectId(req.userId);
    suggestion.respondedAt = new Date();
    if (status === 'pending') suggestion.status = 'resolved';
  }
  if (priority) suggestion.priority = priority;

  await suggestion.save();

  await Suggestion.populate(suggestion, [
    { path: 'assignedTo', select: 'name' },
    { path: 'respondedBy', select: 'name' },
  ]);

  res.json({
    success: true,
    message: 'Suggestion updated successfully',
    data: { suggestion },
  });
});

export const deleteSuggestion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
  if (!suggestion) throw new NotFoundError('Suggestion not found');

  res.json({
    success: true,
    message: 'Suggestion deleted successfully',
  });
});

export const getSuggestionStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const stats = await Suggestion.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await Suggestion.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Suggestion.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      statusStats: stats,
      categoryStats: categoryStats,
      priorityStats: priorityStats,
    },
  });
});