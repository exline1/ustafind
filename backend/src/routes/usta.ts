import { Router } from 'express';
import { getUstalar, getUstaById, approveUsta, rejectUsta } from '../controllers/usta.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getUstalar);
router.get('/:id', getUstaById);
router.post('/:id/approve', requireAdmin, approveUsta);
router.post('/:id/reject', requireAdmin, rejectUsta);

export default router;
