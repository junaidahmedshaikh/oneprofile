import mongoose from 'mongoose';

const enterpriseQuoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    businessEmail: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    industry: { type: String, default: '' },
    companySize: { type: String, default: '' },
    numEmployees: { type: Number, default: 0 },
    numTeamMembers: { type: Number, default: 0 },
    requiredFeatures: { type: String, default: '' },
    existingSoftware: { type: String, default: '' },
    budget: { type: String, default: '' },
    expectedLaunchDate: { type: Date, default: null },
    additionalRequirements: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export const EnterpriseQuote = mongoose.model('EnterpriseQuote', enterpriseQuoteSchema);
