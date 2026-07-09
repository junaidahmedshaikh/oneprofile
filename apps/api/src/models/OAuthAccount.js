import mongoose from 'mongoose';

const oauthAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, enum: ['google'], required: true, index: true },
    providerAccountId: { type: String, required: true, index: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

oauthAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const OAuthAccount = mongoose.model('OAuthAccount', oauthAccountSchema);
