import { Router } from 'express';
import { createAdmission, getAdmissions, getAdmission, updateAdmission, deleteAdmission, acceptAdmission, getAdmissionStats } from '../controllers/admission';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAdmissionSchema, updateAdmissionSchema } from '../validators/admission';

const router = Router();

router.post('/', createAdmission);

router.use(authenticate);

router.get('/', authorize('admin'), getAdmissions);
router.get('/stats', authorize('admin'), getAdmissionStats);
router.get('/:id', authorize('admin'), getAdmission);
router.put('/:id', authorize('admin'), validate(updateAdmissionSchema), updateAdmission);
router.post('/:id/accept', authorize('admin'), acceptAdmission);
router.delete('/:id', authorize('admin'), deleteAdmission);

export default router;