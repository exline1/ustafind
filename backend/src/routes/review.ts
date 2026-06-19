import { Router } from 'express';
import { createReview, deleteReview } from '../controllers/review.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, createReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;
