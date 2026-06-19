import { Router } from 'express';
import { signup, login, getMe, updateProfile, selectRole, getAllUsers } from '../controllers/auth.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.post('/role-select', requireAuth, selectRole);
router.get('/users', requireAdmin, getAllUsers);

export default router;
