import { z } from 'zod';

const industrySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1)
});

const categorySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1)
});

const companyDetailsSchema = z.object({
  companyName: z.string().min(2).max(120),
  legalName: z.string().max(120).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(6).max(20).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  tagline: z.string().max(140).optional().or(z.literal('')),
  description: z.string().max(600).optional().or(z.literal(''))
});

const themeSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  primary: z.string().min(4),
  accent: z.string().min(4),
  mode: z.enum(['light', 'dark']).optional()
});

const aiContentSchema = z.object({
  headline: z.string().max(160).optional().or(z.literal('')),
  summary: z.string().max(500).optional().or(z.literal('')),
  benefits: z.array(z.string().max(120)).optional(),
  ctaLabel: z.string().max(40).optional().or(z.literal(''))
});

export const onboardingSaveSchema = z.object({
  currentStep: z.string().optional(),
  industry: industrySchema.optional(),
  businessCategory: categorySchema.optional(),
  companyDetails: companyDetailsSchema.optional(),
  theme: themeSchema.optional(),
  aiContent: aiContentSchema.optional(),
  completedSteps: z.array(z.string()).optional(),
  skippedSteps: z.array(z.string()).optional()
});

export const onboardingStepSchema = z.object({
  step: z.string().min(1),
  industry: industrySchema.optional(),
  businessCategory: categorySchema.optional(),
  companyDetails: companyDetailsSchema.optional(),
  theme: themeSchema.optional(),
  aiContent: aiContentSchema.optional()
});

export const onboardingSkipSchema = z.object({
  step: z.string().min(1)
});

export const onboardingLogoSchema = z.object({
  dataUri: z.string().min(20)
});

export const onboardingResumeSchema = z.object({
  token: z.string().min(12).optional()
});
