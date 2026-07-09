import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['info', 'alert', 'success', 'warning'],
      default: 'info',
      index: true
    },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// Compound index for getting unread notifications quickly
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
