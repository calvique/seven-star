import { Response } from 'express';
import mongoose from 'mongoose';
import { Contact } from '../models';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createContact = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const contact = await Contact.create({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Contact message sent successfully',
    data: { contact },
  });
});

export const getContacts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, category, status, search } = req.query;
  const query: any = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name')
    .populate('respondedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Contact.countDocuments(query);

  res.json({
    success: true,
    data: {
      contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getContact = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name')
    .populate('respondedBy', 'name');

  if (!contact) throw new NotFoundError('Contact not found');

  res.json({
    success: true,
    data: { contact },
  });
});

export const updateContact = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, assignedTo, response } = req.body;

  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new NotFoundError('Contact not found');

  if (status) contact.status = status;
  if (assignedTo) contact.assignedTo = assignedTo;
  if (response) {
    contact.response = response;
    contact.respondedBy = new mongoose.Types.ObjectId(req.userId);
    contact.respondedAt = new Date();
    if (status === 'new') contact.status = 'in-progress';
  }

  await contact.save();

  await Contact.populate(contact, [
    { path: 'assignedTo', select: 'name' },
    { path: 'respondedBy', select: 'name' },
  ]);

  res.json({
    success: true,
    message: 'Contact updated successfully',
    data: { contact },
  });
});

export const deleteContact = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new NotFoundError('Contact not found');

  res.json({
    success: true,
    message: 'Contact deleted successfully',
  });
});

export const getContactStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await Contact.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      statusStats: stats,
      categoryStats: categoryStats,
    },
  });
});