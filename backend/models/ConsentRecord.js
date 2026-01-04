import mongoose from 'mongoose';

const consentRecordSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  requester_name: {
    type: String,
    required: true
  },
  requester_email: String,
  data_types: [{
    type: String,
    enum: ['medical_history', 'lab_results', 'prescriptions', 'imaging', 'vitals', 'allergies', 'all_records']
  }],
  purpose: {
    type: String,
    required: true
  },
  consent_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired', 'revoked'],
    default: 'pending'
  },
  valid_from: Date,
  valid_until: Date,
  conditions: String,
  approved_by: String,
  approved_at: Date
}, {
  timestamps: true
});

export default mongoose.model('ConsentRecord', consentRecordSchema);

