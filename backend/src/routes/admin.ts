import { Router } from 'express';
import { getAdmins, updateAdmin, deleteAdmin } from '../controllers/admin';
import { authenticate, authorize } from '../middleware/auth';
const router=Router();
router.use(authenticate, authorize('admin'));
router.get('/', getAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
export default router;
