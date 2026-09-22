import { Router } from 'express';
import { createSetting, getSettings, getPublicSettings, getSetting, getSettingByKey, updateSetting, updateSettingByKey, deleteSetting, seedDefaultSettings } from '../controllers/setting';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSettingSchema, updateSettingSchema } from '../validators/setting';

const router = Router();

router.get('/public', getPublicSettings);
router.post('/seed', authenticate, authorize('admin'), seedDefaultSettings);

router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(createSettingSchema), createSetting);
router.get('/', getSettings);
router.get('/key/:key', getSettingByKey);
router.get('/:id', getSetting);
router.put('/:id', validate(updateSettingSchema), updateSetting);
router.put('/key/:key', validate(updateSettingSchema), updateSettingByKey);
router.delete('/:id', deleteSetting);

export default router;