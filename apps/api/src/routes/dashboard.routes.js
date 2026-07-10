import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getSummary,
  getActivities,
  getAppointments,
  getNotifications,
  markNotificationRead
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/summary', authenticate, getSummary);
router.get('/activity', authenticate, getActivities);
router.get('/appointments', authenticate, getAppointments);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationRead);

export default router;
