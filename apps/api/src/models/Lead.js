import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'archived'],
      default: 'new',
      index: true
    }
  },
  { timestamps: true }
);

// Optimize query path for lead listing and summary calculation
leadSchema.index({ userId: 1, status: 1 });
leadSchema.index({ userId: 1, createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
