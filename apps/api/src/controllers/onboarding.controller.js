import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import {
  getLookups,
  getOnboardingState,
  saveOnboardingDraft,
  completeStep,
  skipStep,
  uploadLogo,
  generateAiContent,
  resumeLater,
  publishOnboarding,
  getOnboardingSummary,
  resumeFromToken
} from '../services/onboarding.service.js';

export const lookups = asyncHandler(async (_req, res) => {
  const data = await getLookups();
  return ok(res, { data });
});

export const state = asyncHandler(async (req, res) => {
  const data = await getOnboardingSummary(req.auth.sub);
  return ok(res, { data });
});

export const save = asyncHandler(async (req, res) => {
  const data = await saveOnboardingDraft(req.auth.sub, req.body);
  return ok(res, { message: 'Onboarding draft saved', data });
});

export const stepComplete = asyncHandler(async (req, res) => {
  const data = await completeStep(req.auth.sub, req.body.step, req.body);
  return ok(res, { message: 'Step completed', data });
});

export const stepSkip = asyncHandler(async (req, res) => {
  const data = await skipStep(req.auth.sub, req.body.step);
  return ok(res, { message: 'Step skipped', data });
});

export const logo = asyncHandler(async (req, res) => {
  const data = await uploadLogo(req.auth.sub, req.body.dataUri);
  return ok(res, { message: 'Logo uploaded', data });
});

export const aiContent = asyncHandler(async (req, res) => {
  const data = await generateAiContent(req.auth.sub);
  return ok(res, { message: 'Content generated', data });
});

export const resume = asyncHandler(async (req, res) => {
  if (req.body.token) {
    const data = await resumeFromToken(req.body.token);
    return ok(res, { message: 'Onboarding resumed', data });
  }
  const data = await resumeLater(req.auth.sub);
  return ok(res, { message: 'Resume later saved', data });
});

export const publish = asyncHandler(async (req, res) => {
  const data = await publishOnboarding(req.auth.sub);
  return ok(res, { message: 'Profile published successfully', data });
});
