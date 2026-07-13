import { z } from "zod";

export const onboardingSaveSchema = z.object({
  currentStep: z.string().optional(),
  industry: z.any().optional(),
  businessCategory: z.any().optional(),
  companyDetails: z.any().optional(),
  theme: z.any().optional(),
  aiContent: z.any().optional(),
  completedSteps: z.array(z.string()).optional(),
  skippedSteps: z.array(z.string()).optional(),
  personalDetails: z.any().optional(),
  socialLinks: z.any().optional(),
  experience: z.any().optional(),
  contactDetails: z.any().optional(),
  profileType: z.any().optional(),
  professionalCategory: z.any().optional(),
});

export const onboardingStepSchema = z.object({
  step: z.string().min(1),
  industry: z.any().optional(),
  businessCategory: z.any().optional(),
  companyDetails: z.any().optional(),
  theme: z.any().optional(),
  aiContent: z.any().optional(),
  personalDetails: z.any().optional(),
  socialLinks: z.any().optional(),
  experience: z.any().optional(),
  contactDetails: z.any().optional(),
  profileType: z.any().optional(),
  professionalCategory: z.any().optional(),
});

export const onboardingSkipSchema = z.object({
  step: z.string().min(1),
});

export const onboardingLogoSchema = z.object({
  dataUri: z.string().min(20),
});

export const onboardingResumeSchema = z.object({
  token: z.string().min(12).optional(),
});
