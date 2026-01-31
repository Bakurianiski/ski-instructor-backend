import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats
} from '../controllers/bookingController.js';

const router = express.Router();

// Public routes
router.post('/', createBooking);

// Admin routes (დროებით public, მერე დავამატებთ authentication)
router.get('/', getAllBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;