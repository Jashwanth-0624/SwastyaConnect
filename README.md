# SwasthyaConnect - Healthcare Interoperability Platform

A comprehensive healthcare platform built with React, Node.js, Express.js, and MongoDB, designed for unified patient care across hospitals.

## Features

- **AI Clinical Summary Generator** - Automated patient history summaries
- **Smart Patient Identity Matching** - Unified patient records across hospitals
- **Real-Time Medical Event Alerts** - Instant notifications for critical events
- **Advanced Consent Calendar** - Time-based consent management
- **Predictive Analytics Dashboard** - AI-powered risk predictions
- **Medical Document OCR** - Extract data from scanned documents
- **Emergency Health QR Code** - Quick access to critical health data
- **Drug Interaction Checker** - Medication safety verification
- **Telemedicine Integration** - Remote care with unified records
- **ABDM Integration** - National Health Ecosystem connectivity

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Query
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (already created with your MongoDB connection string):
```
MONGODB_URI=mongodb+srv://rjashwanth562_db_user:nLK2pSF5Tukbaj3u@cluster0.o2sxngl.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies (from root directory):
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Swastya/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Patient.js
│   │   ├── ABDMRecord.js
│   │   ├── MedicalAlert.js
│   │   └── ... (other models)
│   ├── routes/
│   │   ├── patients.js
│   │   ├── abdmRecords.js
│   │   └── ... (other routes)
│   └── server.js
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   └── base44Client.js
│   ├── components/
│   │   ├── ui/
│   │   └── showcase/
│   ├── Pages/
│   └── utils/
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

Similar endpoints exist for:
- ABDM Records (`/api/abdm-records`)
- Medical Alerts (`/api/medical-alerts`)
- Clinical Summaries (`/api/clinical-summaries`)
- Drug Interactions (`/api/drug-interactions`)
- Emergency Health Data (`/api/emergency-health-data`)
- Consent Records (`/api/consent-records`)
- Medical Documents (`/api/medical-documents`)
- Predictive Analytics (`/api/predictive-analytics`)
- Telemed Sessions (`/api/telemed-sessions`)
- Demo Requests (`/api/demo-requests`)
- Feature Interests (`/api/feature-interests`)

## Development

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Production Build

### Frontend
```bash
npm run build
```

The built files will be in the `dist` directory.

### Backend
The backend is ready for production. Make sure to:
1. Set `NODE_ENV=production` in your `.env` file
2. Use a process manager like PM2
3. Set up proper MongoDB connection pooling

## Notes

- The MongoDB connection string is already configured in `backend/.env`
- File uploads are stored in `backend/uploads/`
- The API client mimics the base44 structure for backward compatibility
- AI/LLM features use mock responses - integrate with actual services for production

## License

This project is for demonstration purposes.

