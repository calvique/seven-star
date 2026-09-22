import { Router } from 'express';
import { createSuggestion, getSuggestions, getSuggestion, updateSuggestion, deleteSuggestion, getSuggestionStats } from '../controllers/suggestion';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSuggestionSchema, updateSuggestionSchema } from '../validators/suggestion';

const router = Router();

router.post('/', createSuggestion);

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getSuggestions);
router.get('/stats', getSuggestionStats);
router.get('/:id', getSuggestion);
router.put('/:id', validate(updateSuggestionSchema), updateSuggestion);
router.delete('/:id', deleteSuggestion);

export default router;