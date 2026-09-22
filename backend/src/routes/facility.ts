import { Router } from 'express';
import { createFacility, getFacilities, getPublishedFacilities, getFacility, getFacilityBySlug, updateFacility, deleteFacility, getFacilitiesByCategory } from '../controllers/facility';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createFacilitySchema, updateFacilitySchema } from '../validators/facility';

const router = Router();

router.get('/published', getPublishedFacilities);
router.get('/category', getFacilitiesByCategory);
router.get('/slug/:slug', getFacilityBySlug);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createFacilitySchema), createFacility);
router.get('/', authorize('admin'), getFacilities);
router.get('/:id', authorize('admin'), getFacility);
router.put('/:id', authorize('admin'), validate(updateFacilitySchema), updateFacility);
router.delete('/:id', authorize('admin'), deleteFacility);

export default router;