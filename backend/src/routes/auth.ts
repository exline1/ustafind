import { Router } from 'express';
import { signup, login, getMe, updateProfile, selectRole } from '../controllers/auth.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.post('/role-select', requireAuth, selectRole);

export default router;
