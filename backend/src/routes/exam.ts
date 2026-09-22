import { Router } from 'express';
import { createExam, getExams, getExam, updateExam, publishExam, deleteExam, getExamSchedule } from '../controllers/exam';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExamSchema, updateExamSchema, publishExamSchema } from '../validators/exam';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin'), validate(createExamSchema), createExam);
router.get('/', authorize('admin', 'teacher'), getExams);
router.get('/schedule', authorize('admin', 'teacher', 'student', 'parent'), getExamSchedule);
router.get('/:id', authorize('admin', 'teacher'), getExam);
router.put('/:id', authorize('admin'), validate(updateExamSchema), updateExam);
router.post('/:id/publish', authorize('admin'), validate(publishExamSchema), publishExam);
router.delete('/:id', authorize('admin'), deleteExam);

export default router;