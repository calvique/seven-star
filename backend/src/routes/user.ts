import { Router } from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/user';
import { authenticate, authorize } from '../middleware/auth';
const router=Router();
router.use(authenticate, authorize('admin'));
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
