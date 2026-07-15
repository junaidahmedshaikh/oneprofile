import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true },
    phone: { type: String, trim: true, unique: true, sparse: true, index: true },
    passwordHash: { type: String, default: null },
    avatarUrl: { type: String, default: '' },
    roles: [{ type: String, trim: true, default: 'user' }],
    permissions: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'deleted'],
      default: 'pending'
    },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    phoneVerifiedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: '' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      locale: { type: String, default: 'en' }
    },
    onboardingStatus: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'published'],
      default: 'not_started',
      index: true
    },
    onboardingProgress: { type: Number, default: 0 },
    publishedProfileSlug: { type: String, default: '' },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.virtual('displayName').get(function displayName() {
  return this.name || [this.firstName, this.lastName].filter(Boolean).join(' ').trim();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
