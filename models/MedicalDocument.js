import mongoose from 'mongoose';

const medicalDocumentSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  document_type: {
    type: String,
    enum: ['prescription', 'lab_report', 'clinical_note', 'discharge_summary', 'imaging_report'],
    required: true
  },
  file_url: {
    type: String,
    required: true
  },
  extracted_data: mongoose.Schema.Types.Mixed,
  extraction_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  raw_text: String,
  confidence_score: Number,
  processed_date: Date
}, {
  timestamps: true
});

export default mongoose.model('MedicalDocument', medicalDocumentSchema);

