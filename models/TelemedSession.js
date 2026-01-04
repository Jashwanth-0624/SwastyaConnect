import mongoose from 'mongoose';

const telemedSessionSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  doctor_name: {
    type: String,
    required: true
  },
  doctor_email: String,
  session_status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  scheduled_time: {
    type: Date,
    required: true
  },
  duration_minutes: Number,
  chief_complaint: String,
  diagnosis: String,
  prescriptions: [{
    medication: String,
    dosage: String,
    duration: String
  }],
  notes: String,
  follow_up_required: {
    type: Boolean,
    default: false
  },
  follow_up_date: Date,
  meeting_link: String
}, {
  timestamps: true
});

export default mongoose.model('TelemedSession', telemedSessionSchema);

