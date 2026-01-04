import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  organization: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['doctor', 'admin', 'it_manager', 'cio', 'other']
  },
  interested_features: [String],
  message: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'demo_scheduled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('DemoRequest', demoRequestSchema);

