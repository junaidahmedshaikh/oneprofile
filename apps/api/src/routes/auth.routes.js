import { Router } from 'express';
import {
  register,
  login,
  otpLoginRequest,
  otpLoginVerify,
  refresh,
  logout,
  logoutAll,
  profile,
  sessions,
  forgotPassword,
  resetPassword,
  requestEmailVerification,
  confirmEmailVerification,
  requestPhoneVerification,
  confirmPhoneVerification,
  googleStart,
  googleCallback,
  verifyRegistration,
  resendRegistration,
  requestForgotPassword,
  verifyForgotPassword,
  requestChangeEmail,
  confirmChangeEmailVerify
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  emailVerifySchema,
  phoneVerifySchema,
  verifyRegistrationSchema,
  resendRegistrationSchema,
  forgotPasswordVerifySchema,
  changeEmailRequestSchema,
  changeEmailConfirmSchema
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/otp/request', validate(otpRequestSchema), otpLoginRequest);
router.post('/otp/verify', validate(otpVerifySchema), otpLoginVerify);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, profile);
router.get('/sessions', authenticate, sessions);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email/request', authenticate, validate(emailVerifySchema.omit({ otp: true })), requestEmailVerification);
router.post('/verify-email/confirm', validate(emailVerifySchema), confirmEmailVerification);
router.post('/verify-phone/request', authenticate, validate(phoneVerifySchema.omit({ otp: true })), requestPhoneVerification);
router.post('/verify-phone/confirm', validate(phoneVerifySchema), confirmPhoneVerification);
router.get('/google', googleStart);
router.get('/google/callback', googleCallback);

// New Email OTP verification endpoints
router.post('/verify-registration/confirm', validate(verifyRegistrationSchema), verifyRegistration);
router.post('/verify-registration/resend', validate(resendRegistrationSchema), resendRegistration);
router.post('/forgot-password/request', validate(forgotPasswordSchema), requestForgotPassword);
router.post('/forgot-password/verify', validate(forgotPasswordVerifySchema), verifyForgotPassword);
router.post('/change-email/request', authenticate, validate(changeEmailRequestSchema), requestChangeEmail);
router.post('/change-email/confirm', authenticate, validate(changeEmailConfirmSchema), confirmChangeEmailVerify);

export default router;
