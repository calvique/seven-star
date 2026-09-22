import { Router } from 'express';
import { createExam, getExams, getExam, updateExam, publishExam, deleteExam, getExamSchedule } from '../controllers/exam';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExamSchema, updateExamSchema, publishExamSchema } from '../validators/exam';

const router = Router();

router.get('/schedule', getExamSchedule);

router.use(authenticate);

router.post('/', authorize('admin'), validate(createExamSchema), createExam);
router.get('/', authorize('admin', 'teacher'), getExams);
router.get('/:id', authorize('admin', 'teacher'), getExam);
router.put('/:id', authorize('admin'), validate(updateExamSchema), updateExam);
router.post('/:id/publish', authorize('admin'), validate(publishExamSchema), publishExam);
router.delete('/:id', authorize('admin'), deleteExam);

export default router;