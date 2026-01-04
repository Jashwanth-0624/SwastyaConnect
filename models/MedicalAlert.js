import mongoose from 'mongoose';

const medicalAlertSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  alert_type: {
    type: String,
    enum: ['abnormal_vitals', 'lab_result', 'medication_conflict', 'emergency_admission', 'critical_value'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  vital_type: String,
  value: String,
  normal_range: String,
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  acknowledged_by: String,
  acknowledged_at: Date
}, {
  timestamps: true
});

export default mongoose.model('MedicalAlert', medicalAlertSchema);

