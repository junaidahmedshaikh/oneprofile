import mongoose from 'mongoose';

const otpChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    identifier: { type: String, required: true, index: true },
    identifierType: { type: String, enum: ['email', 'phone'], required: true },
    purpose: {
      type: String,
      enum: ['login', 'email_verification', 'phone_verification'],
      required: true,
      index: true
    },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

otpChallengeSchema.index({ identifier: 1, purpose: 1, expiresAt: 1 });

export const OtpChallenge = mongoose.model('OtpChallenge', otpChallengeSchema);
