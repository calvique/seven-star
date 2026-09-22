import { Router } from 'express';
import { createResult, bulkCreateResults, getResults, getResult, updateResult, verifyResult, publishResult, getStudentResults, getResultSheet, searchResultByRoll, deleteResult } from '../controllers/result';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createResultSchema, bulkCreateResultSchema, updateResultSchema, verifyResultSchema, publishResultSchema } from '../validators/result';

const router = Router();

router.get('/search', searchResultByRoll);

router.use(authenticate);

router.post('/', authorize('admin', 'teacher'), validate(createResultSchema), createResult);
router.post('/bulk', authorize('admin', 'teacher'), validate(bulkCreateResultSchema), bulkCreateResults);
router.get('/', authorize('admin', 'teacher'), getResults);
router.get('/my-results', authorize('student', 'parent'), getStudentResults);
router.get('/sheet', authorize('admin', 'teacher'), getResultSheet);
router.get('/:id', authorize('admin', 'teacher', 'student', 'parent'), getResult);
router.put('/:id', authorize('admin', 'teacher'), validate(updateResultSchema), updateResult);
router.post('/:id/verify', authorize('admin'), validate(verifyResultSchema), verifyResult);
router.post('/:id/publish', authorize('admin', 'teacher'), validate(publishResultSchema), publishResult);
router.delete('/:id', authorize('admin'), deleteResult);

export default router;