import { Router } from 'express';
import { createNotice, getNotices, getPublishedNotices, getNotice, getNoticeBySlug, updateNotice, deleteNotice, getPinnedNotices, getLatestNotices } from '../controllers/notice';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNoticeSchema, updateNoticeSchema } from '../validators/notice';

const router = Router();

router.get('/published', getPublishedNotices);
router.get('/pinned', getPinnedNotices);
router.get('/latest', getLatestNotices);
router.get('/slug/:slug', getNoticeBySlug);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createNoticeSchema), createNotice);
router.get('/', authorize('admin', 'teacher'), getNotices);
router.get('/:id', authorize('admin', 'teacher'), getNotice);
router.put('/:id', authorize('admin'), validate(updateNoticeSchema), updateNotice);
router.delete('/:id', authorize('admin'), deleteNotice);

export default router;