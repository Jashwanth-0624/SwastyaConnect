import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    unique: true,
    default: () => `PAT${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  },
  // MongoDB will automatically create _id field
  full_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  phone: String,
  email: String,
  address: String,
  emergency_contact: String,
  allergies: [String],
  chronic_conditions: [String],
  current_medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  past_surgeries: [String],
  abdm_id: String,
  unified_patient_id: String
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);

