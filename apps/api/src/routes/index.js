import { Router } from 'express';
import authRoutes from './auth.routes.js';
import onboardingRoutes from './onboarding.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);

export default router;
