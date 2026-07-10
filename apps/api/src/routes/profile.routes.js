import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getMe,
  updateMe,
  getPublic,
  uploadAvatar,
  uploadCover,
  downloadVCard
} from '../controllers/profile.controller.js';

const router = Router();

// Secure editing routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.post('/me/upload-avatar', authenticate, uploadAvatar);
router.post('/me/upload-cover', authenticate, uploadCover);

// Public profile viewer routes
router.get('/public/:slug', getPublic);
router.get('/public/:slug/vcard', downloadVCard);

export default router;
