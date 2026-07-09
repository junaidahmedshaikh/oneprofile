import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fingerprint: { type: String, required: true, index: true },
    name: { type: String, default: '' },
    type: { type: String, default: 'web' },
    os: { type: String, default: '' },
    browser: { type: String, default: '' },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    isTrusted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

deviceSchema.index({ userId: 1, fingerprint: 1 }, { unique: true });

export const Device = mongoose.model('Device', deviceSchema);
