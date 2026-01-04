import mongoose from 'mongoose';

const clinicalSummarySchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  summary_text: {
    type: String,
    required: true
  },
  diagnoses: [String],
  lab_results_summary: String,
  medications_summary: String,
  risk_score: Number,
  risk_factors: [String],
  generated_date: {
    type: Date,
    default: Date.now
  },
  last_visit_date: Date
}, {
  timestamps: true
});

export default mongoose.model('ClinicalSummary', clinicalSummarySchema);

