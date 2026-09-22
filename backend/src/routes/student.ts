import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, promoteStudent, deleteStudent, getMyProfile } from '../controllers/student';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createStudentSchema, updateStudentSchema, promoteStudentSchema } from '../validators/student';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin'), validate(createStudentSchema), createStudent);
router.get('/', authorize('admin', 'teacher'), getStudents);
router.get('/my-profile', authorize('student', 'parent'), getMyProfile);
router.get('/:id', authorize('admin', 'teacher', 'student', 'parent'), getStudent);
router.put('/:id', authorize('admin'), validate(updateStudentSchema), updateStudent);
router.post('/:id/promote', authorize('admin'), validate(promoteStudentSchema), promoteStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;