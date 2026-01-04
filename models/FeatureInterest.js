import mongoose from 'mongoose';

const featureInterestSchema = new mongoose.Schema({
  feature_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  interest_level: {
    type: String,
    enum: ['curious', 'interested', 'very_interested', 'need_urgently'],
    default: 'interested'
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('FeatureInterest', featureInterestSchema);

