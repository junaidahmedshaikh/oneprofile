import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    role: { type: String, required: true, default: 'member' },
    permissions: [{ type: String, trim: true }],
    status: { type: String, enum: ['active', 'pending', 'revoked'], default: 'active' }
  },
  { timestamps: true }
);

membershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export const Membership = mongoose.model('Membership', membershipSchema);
