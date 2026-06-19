import { Router } from 'express';
import {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  rentEquipment,
  getRentals,
  updateRentalStatus,
} from '../controllers/equipment.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Equipment endpoints
router.get('/', getEquipments);
router.get('/:id', getEquipmentById);
router.post('/', requireAuth, createEquipment);
router.put('/:id', requireAuth, updateEquipment);
router.delete('/:id', requireAuth, deleteEquipment);

// Rental flows
router.post('/:id/rent', requireAuth, rentEquipment);
router.get('/rentals/all', requireAuth, getRentals);
router.put('/rentals/:id/status', requireAuth, updateRentalStatus);

export default router;
