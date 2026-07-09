import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['profile_view', 'card_shared', 'lead_captured', 'onboarding_step', 'onboarding_published', 'appointment_booked'],
      required: true,
      index: true
    },
    description: { type: String, required: true, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

// Compound index to fetch the most recent activities quickly
activitySchema.index({ userId: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
