import { Router } from 'express';
import { createTeacher, getTeachers, getTeacher, updateTeacher, approveTeacher, assignClassSubject, deleteTeacher, getMyProfile, getTeacherStats } from '../controllers/teacher';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTeacherSchema, updateTeacherSchema, approveTeacherSchema, assignClassSubjectSchema } from '../validators/teacher';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin'), validate(createTeacherSchema), createTeacher);
router.get('/', authorize('admin'), getTeachers);
router.get('/my-profile', authorize('teacher', 'admin'), getMyProfile);
router.get('/stats', authorize('teacher', 'admin'), getTeacherStats);
router.get('/:id', authorize('admin', 'teacher'), getTeacher);
router.put('/:id', authorize('admin'), validate(updateTeacherSchema), updateTeacher);
router.post('/:id/approve', authorize('admin'), validate(approveTeacherSchema), approveTeacher);
router.post('/:id/assign', authorize('admin'), validate(assignClassSubjectSchema), assignClassSubject);
router.delete('/:id', authorize('admin'), deleteTeacher);

export default router;