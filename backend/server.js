import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import patientRoutes from './routes/patients.js';
import abdmRecordRoutes from './routes/abdmRecords.js';
import medicalAlertRoutes from './routes/medicalAlerts.js';
import clinicalSummaryRoutes from './routes/clinicalSummaries.js';
import drugInteractionRoutes from './routes/drugInteractions.js';
import emergencyHealthDataRoutes from './routes/emergencyHealthData.js';
import consentRecordRoutes from './routes/consentRecords.js';
import medicalDocumentRoutes from './routes/medicalDocuments.js';
import predictiveAnalyticRoutes from './routes/predictiveAnalytics.js';
import telemedSessionRoutes from './routes/telemedSessions.js';
import demoRequestRoutes from './routes/demoRequests.js';
import featureInterestRoutes from './routes/featureInterests.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://swastya-connect.vercel.app',
      'https://swastya-connect-git-main-jashwanths-projects-eec3748e.vercel.app',
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.railway\.app$/,
      /^https:\/\/.*\.render\.com$/
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/abdm-records', abdmRecordRoutes);
app.use('/api/medical-alerts', medicalAlertRoutes);
app.use('/api/clinical-summaries', clinicalSummaryRoutes);
app.use('/api/drug-interactions', drugInteractionRoutes);
app.use('/api/emergency-health-data', emergencyHealthDataRoutes);
app.use('/api/consent-records', consentRecordRoutes);
app.use('/api/medical-documents', medicalDocumentRoutes);
app.use('/api/predictive-analytics', predictiveAnalyticRoutes);
app.use('/api/telemed-sessions', telemedSessionRoutes);
app.use('/api/demo-requests', demoRequestRoutes);
app.use('/api/feature-interests', featureInterestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SwasthyaConnect API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

