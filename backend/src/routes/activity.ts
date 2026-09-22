import { Router } from 'express';
import { createActivity, getActivities, getPublishedActivities, getActivity, getActivityBySlug, updateActivity, deleteActivity, getActivitiesByCategory, getWeeklyECA } from '../controllers/activity';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createActivitySchema, updateActivitySchema } from '../validators/activity';

const router = Router();

router.get('/published', getPublishedActivities);
router.get('/weekly-eca', getWeeklyECA);
router.get('/category', getActivitiesByCategory);
router.get('/slug/:slug', getActivityBySlug);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createActivitySchema), createActivity);
router.get('/', authorize('admin'), getActivities);
router.get('/:id', authorize('admin'), getActivity);
router.put('/:id', authorize('admin'), validate(updateActivitySchema), updateActivity);
router.delete('/:id', authorize('admin'), deleteActivity);

export default router;