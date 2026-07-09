import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', default: null, index: true },
    refreshTokenHash: { type: String, required: true, index: true },
    userAgent: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    deviceName: { type: String, default: '' },
    deviceType: { type: String, default: 'web' },
    os: { type: String, default: '' },
    browser: { type: String, default: '' },
    isRevoked: { type: Boolean, default: false, index: true },
    revokedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
    lastUsedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, isRevoked: 1, expiresAt: -1 });

export const Session = mongoose.model('Session', sessionSchema);
