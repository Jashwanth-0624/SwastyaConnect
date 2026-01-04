import mongoose from 'mongoose';

const predictiveAnalyticSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  prediction_type: {
    type: String,
    enum: ['readmission_risk', 'disease_progression', 'icu_transfer', 'sepsis_warning', 'mortality_risk'],
    required: true
  },
  risk_score: {
    type: Number,
    required: true
  },
  risk_level: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical']
  },
  contributing_factors: [String],
  recommendations: [String],
  prediction_date: {
    type: Date,
    default: Date.now
  },
  model_version: String,
  confidence_score: Number
}, {
  timestamps: true
});

export default mongoose.model('PredictiveAnalytic', predictiveAnalyticSchema);

