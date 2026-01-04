export function createPageUrl(pageName) {
  // Map page names to routes
  const routeMap = {
    'AIClinicalSummary': '/ai-clinical-summary',
    'PatientMatching': '/patient-matching',
    'MedicalAlerts': '/medical-alerts',
    'ConsentCalendar': '/consent-calendar',
    'PredictiveAnalytics': '/predictive-analytics',
    'DocumentOCR': '/document-ocr',
    'EmergencyQR': '/emergency-qr',
    'DrugChecker': '/drug-checker',
    'Telemedicine': '/telemedicine',
    'ABDMIntegration': '/abdm-integration',
  };
  
  return routeMap[pageName] || `/${pageName.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

export function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

