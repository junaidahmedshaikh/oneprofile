import mongoose from 'mongoose';

const profileViewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    visitorIp: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    referrer: { type: String, default: 'direct', trim: true, index: true }
  },
  { timestamps: true }
);

// Optimize time-series analytics grouping by indexing userId and createdAt
profileViewSchema.index({ userId: 1, createdAt: 1 });

export const ProfileView = mongoose.model('ProfileView', profileViewSchema);
