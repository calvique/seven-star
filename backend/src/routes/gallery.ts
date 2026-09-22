import { Router } from 'express';
import { createGallery, getGalleries, getPublishedGalleries, getGallery, getGalleryBySlug, updateGallery, deleteGallery, getGalleriesByCategory } from '../controllers/gallery';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createGallerySchema, updateGallerySchema } from '../validators/gallery';

const router = Router();

router.get('/published', getPublishedGalleries);
router.get('/category', getGalleriesByCategory);
router.get('/slug/:slug', getGalleryBySlug);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createGallerySchema), createGallery);
router.get('/', authorize('admin'), getGalleries);
router.get('/:id', authorize('admin'), getGallery);
router.put('/:id', authorize('admin'), validate(updateGallerySchema), updateGallery);
router.delete('/:id', authorize('admin'), deleteGallery);

export default router;