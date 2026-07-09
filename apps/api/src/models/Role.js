import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    scope: { type: String, enum: ['platform', 'tenant'], default: 'platform' },
    description: { type: String, default: '' },
    permissions: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', roleSchema);
