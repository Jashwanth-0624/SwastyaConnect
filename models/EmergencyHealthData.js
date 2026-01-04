import mongoose from 'mongoose';

const emergencyHealthDataSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  qr_code_url: String,
  qr_code_data: String,
  blood_group: String,
  allergies: [String],
  current_medications: [String],
  chronic_conditions: [String],
  past_surgeries: [String],
  emergency_contact: String,
  generated_at: {
    type: Date,
    default: Date.now
  },
  access_count: {
    type: Number,
    default: 0
  },
  last_accessed: Date
}, {
  timestamps: true
});

export default mongoose.model('EmergencyHealthData', emergencyHealthDataSchema);

