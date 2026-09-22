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
    { key: 'school.name', value: 'Seven Star English Boarding School', group: 'general', label: 'School Name', type: 'string', isPublic: true, order: 1 },
    { key: 'school.tagline', value: 'Official school information and updates', group: 'general', label: 'School Tagline', type: 'string', isPublic: true, order: 2 },
    { key: 'school.address', value: 'Devdaha-2, Rupandehi, Nepal', group: 'general', label: 'School Address', type: 'string', isPublic: true, order: 3 },
    { key: 'school.phone', value: '', group: 'general', label: 'Phone Number', type: 'string', isPublic: true, order: 4 },
    { key: 'school.email', value: '', group: 'general', label: 'Email Address', type: 'string', isPublic: true, order: 5 },
    { key: 'school.officeHours', value: '', group: 'general', label: 'Office Hours', type: 'string', isPublic: true, order: 6 },
    { key: 'about.school.intro', value: 'Official school background and institutional information is maintained by the administration.', group: 'about', label: 'About Intro', type: 'string', isPublic: true, order: 1 },
    { key: 'about.school.mission', value: 'The school administration can publish its official mission statement here.', group: 'about', label: 'Mission', type: 'string', isPublic: true, order: 2 },
    { key: 'about.school.vision', value: 'The school administration can publish its official vision statement here.', group: 'about', label: 'Vision', type: 'string', isPublic: true, order: 3 },
    { key: 'about.school.history', value: 'The school administration can publish the official history of the school from the CMS.', group: 'about', label: 'History', type: 'string', isPublic: true, order: 4 },
    { key: 'about.chairman.message', value: 'The official chairman message will be published here by the administration.', group: 'about', label: 'Chairman Message', type: 'string', isPublic: true, order: 5 },
    { key: 'about.principal.message', value: 'The official principal message will be published here by the administration.', group: 'about', label: 'Principal Message', type: 'string', isPublic: true, order: 6 },
    { key: 'contact.principal.name', value: '', group: 'contact', label: 'Principal Name', type: 'string', isPublic: true, order: 1 },
    { key: 'contact.principal.phone', value: '', group: 'contact', label: 'Principal Phone', type: 'string', isPublic: true, order: 2 },
    { key: 'contact.principal.email', value: '', group: 'contact', label: 'Principal Email', type: 'string', isPublic: true, order: 3 },
    { key: 'contact.chairman.name', value: '', group: 'contact', label: 'Chairman Name', type: 'string', isPublic: true, order: 4 },
    { key: 'contact.chairman.phone', value: '', group: 'contact', label: 'Chairman Phone', type: 'string', isPublic: true, order: 5 },
    { key: 'social.facebook', value: 'https://www.facebook.com/sevenstar.boarding', group: 'social', label: 'Facebook URL', type: 'string', isPublic: true, order: 1 },
    { key: 'seo.metaTitle', value: 'Seven Star English Boarding School', group: 'seo', label: 'Default Meta Title', type: 'string', isPublic: true, order: 1 },
    { key: 'seo.metaDescription', value: 'Official website of Seven Star English Boarding School, Devdaha-2, Rupandehi, Nepal.', group: 'seo', label: 'Default Meta Description', type: 'string', isPublic: true, order: 2 },
    { key: 'seo.description', value: 'Official website of Seven Star English Boarding School. School information, notices, admissions, activities, gallery and results.', group: 'seo', label: 'SEO Description', type: 'string', isPublic: true, order: 3 },
    { key: 'seo.metaKeywords', value: ['Seven Star English Boarding School', 'Devdaha', 'Rupandehi', 'Nepal', 'school'], group: 'seo', label: 'Default Meta Keywords', type: 'json', isPublic: true, order: 4 },
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