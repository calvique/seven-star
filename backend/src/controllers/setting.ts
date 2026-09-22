import { Response } from 'express';
import { Setting } from '../models';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createSetting = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = await Setting.findOne({ key: req.body.key });
  if (existing) throw new BadRequestError('Setting with this key already exists');

  const setting = await Setting.create({
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: 'Setting created successfully',
    data: { setting },
  });
});

export const getSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { group, isPublic } = req.query;
  const query: any = {};

  if (group) query.group = group;
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';

  const settings = await Setting.find(query).sort({ group: 1, order: 1 });

  const grouped = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) acc[setting.group] = [];
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  res.json({
    success: true,
    data: { settings: grouped },
  });
});

export const getPublicSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const settings = await Setting.find({ isPublic: true }).sort({ group: 1, order: 1 });
  
  const grouped = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) acc[setting.group] = [];
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  res.json({
    success: true,
    data: { settings: grouped },
  });
});

export const getSetting = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const setting = await Setting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Setting not found');

  res.json({
    success: true,
    data: { setting },
  });
});

export const getSettingByKey = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const setting = await Setting.findOne({ key: req.params.key });
  if (!setting) throw new NotFoundError('Setting not found');

  res.json({
    success: true,
    data: { setting },
  });
});

export const updateSetting = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const setting = await Setting.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!setting) throw new NotFoundError('Setting not found');

  res.json({
    success: true,
    message: 'Setting updated successfully',
    data: { setting },
  });
});

export const updateSettingByKey = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const setting = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!setting) throw new NotFoundError('Setting not found');

  res.json({
    success: true,
    message: 'Setting updated successfully',
    data: { setting },
  });
});

export const deleteSetting = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const setting = await Setting.findByIdAndDelete(req.params.id);
  if (!setting) throw new NotFoundError('Setting not found');

  res.json({
    success: true,
    message: 'Setting deleted successfully',
  });
});

export const seedDefaultSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const defaults = [
    // General
    { key: 'school.name', value: 'Seven Star English Boarding School', group: 'general', label: 'School Name', type: 'string', isPublic: true, order: 1 },
    { key: 'school.tagline', value: 'Shaping Future Leaders', group: 'general', label: 'School Tagline', type: 'string', isPublic: true, order: 2 },
    { key: 'school.established', value: '2063 B.S.', group: 'general', label: 'Established Year', type: 'string', isPublic: true, order: 3 },
    { key: 'school.address', value: 'Devdaha-2, Rupandehi, Nepal', group: 'general', label: 'School Address', type: 'string', isPublic: true, order: 4 },
    { key: 'school.phone', value: '9857078448', group: 'general', label: 'Phone Number', type: 'string', isPublic: true, order: 5 },
    { key: 'school.email', value: 'sevenstar.school2063@gmail.com', group: 'general', label: 'Email Address', type: 'string', isPublic: true, order: 6 },
    { key: 'school.officeHours', value: 'Sun - Fri: 9:00 AM - 5:00 PM', group: 'general', label: 'Office Hours', type: 'string', isPublic: true, order: 7 },
    
    // Contact
    { key: 'contact.principal.name', value: 'Tikaram Chapagain', group: 'contact', label: 'Principal Name', type: 'string', isPublic: true, order: 1 },
    { key: 'contact.principal.phone', value: '9857078448', group: 'contact', label: 'Principal Phone', type: 'string', isPublic: true, order: 2 },
    { key: 'contact.principal.email', value: 'tikaramchapain238@gmail.com', group: 'contact', label: 'Principal Email', type: 'string', isPublic: true, order: 3 },
    { key: 'contact.chairman.name', value: 'Prajapati Sapkota', group: 'contact', label: 'Chairman Name', type: 'string', isPublic: true, order: 4 },
    { key: 'contact.chairman.phone', value: '9857024293', group: 'contact', label: 'Chairman Phone', type: 'string', isPublic: true, order: 5 },
    { key: 'contact.vicePrincipal.name', value: 'Mohan Giri', group: 'contact', label: 'Vice Principal Name', type: 'string', isPublic: true, order: 6 },
    { key: 'contact.vicePrincipal.phone', value: '9851206206', group: 'contact', label: 'Vice Principal Phone', type: 'string', isPublic: true, order: 7 },
    
    // Social
    { key: 'social.facebook', value: 'https://www.facebook.com/sevenstar.boarding', group: 'social', label: 'Facebook URL', type: 'string', isPublic: true, order: 1 },
    
    // SEO
    { key: 'seo.metaTitle', value: 'Seven Star English Boarding School - Devdaha, Rupandehi', group: 'seo', label: 'Default Meta Title', type: 'string', isPublic: true, order: 1 },
    { key: 'seo.metaDescription', value: 'Seven Star English Boarding School, Devdaha-2, Rupandehi, Nepal. NEB Affiliated +2 Programs. Quality Education from Nursery to Grade 12.', group: 'seo', label: 'Default Meta Description', type: 'string', isPublic: true, order: 2 },
    { key: 'seo.metaKeywords', value: ['Seven Star School', 'Devdaha', 'Rupandehi', 'Nepal', 'Education', 'Boarding School', '+2'], group: 'seo', label: 'Default Meta Keywords', type: 'json', isPublic: true, order: 3 },
  ];

  for (const setting of defaults) {
    await Setting.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: setting },
      { upsert: true, new: true }
    );
  }

  res.json({
    success: true,
    message: 'Default settings seeded successfully',
  });
});