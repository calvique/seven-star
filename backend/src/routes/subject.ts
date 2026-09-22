import { Router } from 'express';
import { createSubject, getSubjects, getSubject, updateSubject, deleteSubject, getSubjectsByClass } from '../controllers/subject';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSubjectSchema, updateSubjectSchema } from '../validators/subject';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin'), validate(createSubjectSchema), createSubject);
router.get('/', authorize('admin', 'teacher'), getSubjects);
router.get('/by-class', authorize('admin', 'teacher', 'student', 'parent'), getSubjectsByClass);
router.get('/:id', authorize('admin', 'teacher'), getSubject);
router.put('/:id', authorize('admin'), validate(updateSubjectSchema), updateSubject);
router.delete('/:id', authorize('admin'), deleteSubject);

export default router;