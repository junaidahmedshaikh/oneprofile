import { Router } from 'express';
import authRoutes from './auth.routes.js';
import onboardingRoutes from './onboarding.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import profileRoutes from './profile.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/profiles', profileRoutes);

export default router;
