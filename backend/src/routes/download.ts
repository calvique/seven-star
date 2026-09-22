import { Router } from 'express';
import { createDownload, getDownloads, getPublicDownloads, getDownload, incrementDownloadCount, updateDownload, deleteDownload, getDownloadsByCategory } from '../controllers/download';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDownloadSchema, updateDownloadSchema } from '../validators/download';

const router = Router();

router.get('/public', getPublicDownloads);
router.get('/category', getDownloadsByCategory);
router.post('/:id/download', incrementDownloadCount);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createDownloadSchema), createDownload);
router.get('/', authorize('admin', 'teacher'), getDownloads);
router.get('/:id', authorize('admin', 'teacher'), getDownload);
router.put('/:id', authorize('admin'), validate(updateDownloadSchema), updateDownload);
router.delete('/:id', authorize('admin'), deleteDownload);

export default router;