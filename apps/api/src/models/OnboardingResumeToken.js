import mongoose from 'mongoose';

const onboardingResumeTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const OnboardingResumeToken = mongoose.model('OnboardingResumeToken', onboardingResumeTokenSchema);
