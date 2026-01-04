import mongoose from 'mongoose';

const drugInteractionSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  drug_name: {
    type: String,
    required: true
  },
  interaction_type: {
    type: String,
    enum: ['drug_drug', 'drug_allergy', 'drug_condition', 'duplicate_therapy'],
    required: true
  },
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'major', 'contraindicated'],
    required: true
  },
  interacting_with: String,
  description: String,
  clinical_effects: String,
  recommendations: String,
  status: {
    type: String,
    enum: ['active', 'reviewed', 'override_approved', 'resolved'],
    default: 'active'
  },
  reviewed_by: String
}, {
  timestamps: true
});

export default mongoose.model('DrugInteraction', drugInteractionSchema);

