import { Router } from 'express';
import { createClass, getClasses, getClass, updateClass, deleteClass, getClassesByLevel } from '../controllers/class';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClassSchema, updateClassSchema } from '../validators/class';

const router = Router();

router.get('/by-level', getClassesByLevel);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createClassSchema), createClass);
router.get('/', authorize('admin', 'teacher'), getClasses);
router.get('/:id', authorize('admin', 'teacher'), getClass);
router.put('/:id', authorize('admin'), validate(updateClassSchema), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

export default router;