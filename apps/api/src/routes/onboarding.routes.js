import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  onboardingSaveSchema,
  onboardingStepSchema,
  onboardingSkipSchema,
  onboardingLogoSchema,
  onboardingResumeSchema
} from '../validators/onboarding.validators.js';
import {
  lookups,
  state,
  save,
  stepComplete,
  stepSkip,
  logo,
  aiContent,
  resume,
  publish
} from '../controllers/onboarding.controller.js';

const router = Router();

router.get('/lookups', lookups);
router.get('/me', authenticate, state);
router.put('/me', authenticate, validate(onboardingSaveSchema), save);
router.post('/step', authenticate, validate(onboardingStepSchema), stepComplete);
router.post('/skip', authenticate, validate(onboardingSkipSchema), stepSkip);
router.post('/logo', authenticate, validate(onboardingLogoSchema), logo);
router.post('/content/ai', authenticate, aiContent);
router.post('/resume-later', authenticate, validate(onboardingResumeSchema), resume);
router.post('/publish', authenticate, publish);

export default router;
