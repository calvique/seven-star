import { Router } from 'express';
import { createAchievement, getAchievements, getPublishedAchievements, getAchievement, getAchievementBySlug, updateAchievement, deleteAchievement, getAchievementsByCategory } from '../controllers/achievement';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAchievementSchema, updateAchievementSchema } from '../validators/achievement';

const router = Router();

router.get('/published', getPublishedAchievements);
router.get('/category', getAchievementsByCategory);
router.get('/slug/:slug', getAchievementBySlug);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createAchievementSchema), createAchievement);
router.get('/', authorize('admin'), getAchievements);
router.get('/:id', authorize('admin'), getAchievement);
router.put('/:id', authorize('admin'), validate(updateAchievementSchema), updateAchievement);
router.delete('/:id', authorize('admin'), deleteAchievement);

export default router;