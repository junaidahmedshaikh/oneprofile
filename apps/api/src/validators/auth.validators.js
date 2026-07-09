import { z } from 'zod';

const password = z.string().min(12, 'Password must be at least 12 characters long');

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  firstName: z.string().max(60).optional().default(''),
  lastName: z.string().max(60).optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(8).max(20).optional().or(z.literal('')),
  password,
  device: z.object({
    fingerprint: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional()
  }).optional()
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Email or phone is required',
  path: ['email']
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
  device: z.object({
    fingerprint: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional()
  }).optional()
});

export const otpRequestSchema = z.object({
  identifier: z.string().min(3)
});

export const otpVerifySchema = z.object({
  identifier: z.string().min(3),
  otp: z.string().min(4).max(10),
  device: z.object({
    fingerprint: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional()
  }).optional()
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(8),
  password
});

export const emailVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(10)
});

export const phoneVerifySchema = z.object({
  phone: z.string().min(8).max(20),
  otp: z.string().min(4).max(10)
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional()
});
