import { Router } from 'express';
import authRoutes from './auth.routes.js';
import onboardingRoutes from './onboarding.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
