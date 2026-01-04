import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Pages/Home';
import AdvanceFeatures from './Pages/AdvanceFeatures';
import AIClinicalSummary from './Pages/AIClinicalSummary';
import PatientMatching from './Pages/PatientMatching';
import MedicalAlerts from './Pages/MedicalAlerts';
import ConsentCalendar from './Pages/ConsentCalendar';
import PredictiveAnalytics from './Pages/PredictiveAnalytics';
import DocumentOCR from './Pages/DocumentOCR';
import EmergencyQR from './Pages/EmergencyQR';
import DrugChecker from './Pages/DrugChecker';
import Telemedicine from './Pages/Telemedicine';
import ABDMIntegration from './Pages/ABDMintegration';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advance-features" element={<AdvanceFeatures />} />
          <Route path="/advanced-features" element={<AdvanceFeatures />} />
          <Route path="/ai-clinical-summary" element={<AIClinicalSummary />} />
          <Route path="/patient-matching" element={<PatientMatching />} />
          <Route path="/medical-alerts" element={<MedicalAlerts />} />
          <Route path="/consent-calendar" element={<ConsentCalendar />} />
          <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
          <Route path="/document-ocr" element={<DocumentOCR />} />
          <Route path="/emergency-qr" element={<EmergencyQR />} />
          <Route path="/drug-checker" element={<DrugChecker />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/abdm-integration" element={<ABDMIntegration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

