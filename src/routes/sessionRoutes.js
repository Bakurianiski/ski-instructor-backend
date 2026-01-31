import express from 'express';
import {
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession
} from '../controllers/sessionController.js';

const router = express.Router();

// Public routes
router.get('/', getAllSessions);
router.get('/:id', getSession);

// Admin routes (დროებით public, მერე დავამატებთ authentication)
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;