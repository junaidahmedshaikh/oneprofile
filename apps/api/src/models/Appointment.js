import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true, lowercase: true },
    clientPhone: { type: String, trim: true, default: '' },
    dateTime: { type: Date, required: true, index: true },
    duration: { type: Number, default: 30 }, // duration in minutes
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true
    }
  },
  { timestamps: true }
);

// Compound index for querying a user's upcoming active appointments
appointmentSchema.index({ userId: 1, dateTime: 1, status: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
