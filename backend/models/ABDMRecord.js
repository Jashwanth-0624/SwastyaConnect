import mongoose from 'mongoose';

const abdmRecordSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  abdm_health_id: String,
  phr_address: String,
  abha_number: String,
  link_status: {
    type: String,
    enum: ['not_linked', 'pending', 'linked', 'failed'],
    default: 'not_linked'
  },
  consent_requests: [{
    request_id: String,
    hip_name: String,
    status: String,
    date: Date
  }],
  linked_facilities: [String],
  last_sync: Date,
  verification_status: {
    type: String,
    enum: ['unverified', 'pending', 'verified'],
    default: 'unverified'
  }
}, {
  timestamps: true
});

export default mongoose.model('ABDMRecord', abdmRecordSchema);

