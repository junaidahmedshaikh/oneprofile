import mongoose from 'mongoose';

const emailOtpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['registration', 'forgot-password', 'change-email'],
      required: true,
      index: true
    },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Auto-delete expired OTPs after they expire
emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailOtp = mongoose.model('EmailOtp', emailOtpSchema);
