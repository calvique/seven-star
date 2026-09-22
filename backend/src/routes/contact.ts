import { Router } from 'express';
import { createContact, getContacts, getContact, updateContact, deleteContact, getContactStats } from '../controllers/contact';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createContactSchema, updateContactSchema } from '../validators/contact';

const router = Router();

router.post('/', createContact);

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id', validate(updateContactSchema), updateContact);
router.delete('/:id', deleteContact);

export default router;