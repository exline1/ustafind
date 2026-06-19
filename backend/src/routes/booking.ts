import { Router } from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/booking.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, getBookings);
router.put('/:id/status', requireAuth, updateBookingStatus);

export default router;
