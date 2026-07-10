import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getMe,
  updateMe,
  getPublic
} from '../controllers/profile.controller.js';

const router = Router();

// Secure editing routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

// Public profile viewer routes
router.get('/public/:slug', getPublic);

export default router;
