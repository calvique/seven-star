import { Response } from 'express';
import { Admin, User } from '../models';
import { asyncHandler, BadRequestError, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAdmins = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
  const admins = await Admin.find().populate('user','name email phone avatar isActive lastLogin').sort({ createdAt: -1 });
  res.json({ success:true, data:{ admins, pagination:{ page:1, limit:admins.length, total:admins.length, pages:1 } } });
});

export const updateAdmin = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) throw new NotFoundError('Admin not found');
  if (req.body.permissions) admin.permissions = req.body.permissions;
  if (typeof req.body.isActive === 'boolean') await User.findByIdAndUpdate(admin.user,{isActive:req.body.isActive});
  await admin.save();
  res.json({ success:true, message:'Admin updated successfully', data:{ admin } });
});

export const deleteAdmin = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) throw new NotFoundError('Admin not found');
  if (admin.user.toString() === req.userId) throw new BadRequestError('You cannot delete your own admin account');
  await User.findByIdAndUpdate(admin.user,{isActive:false});
  await admin.deleteOne();
  res.json({ success:true, message:'Admin deactivated successfully' });
});
