const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Entity-specific API classes
class EntityAPI {
  constructor(client, entityName) {
    this.client = client;
    this.entityName = entityName;
  }


  async get(id) {
    const result = await this.client.get(`/${this.entityName}/${id}`);
    // Ensure id field is set from _id for compatibility
    if (result && result._id && !result.id) {
      result.id = result._id;
    }
    return result;
  }

  async create(data) {
    const result = await this.client.post(`/${this.entityName}`, data);
    // Ensure id field is set from _id for compatibility
    if (result && result._id && !result.id) {
      result.id = result._id;
    }
    return result;
  }

  async update(id, data) {
    const result = await this.client.put(`/${this.entityName}/${id}`, data);
    // Ensure id field is set from _id for compatibility
    if (result && result._id && !result.id) {
      result.id = result._id;
    }
    return result;
  }

  async delete(id) {
    return this.client.delete(`/${this.entityName}/${id}`);
  }
  
  async list(sort = '-createdAt') {
    const results = await this.client.get(`/${this.entityName}`, { sort });
    // Ensure id field is set from _id for all items
    if (Array.isArray(results)) {
      return results.map(item => {
        if (item._id && !item.id) {
          item.id = item._id;
        }
        return item;
      });
    }
    return results;
  }
}

// Main API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Create entity APIs
const entities = {
  Patient: new EntityAPI(apiClient, 'patients'),
  ABDMRecord: new EntityAPI(apiClient, 'abdm-records'),
  MedicalAlert: new EntityAPI(apiClient, 'medical-alerts'),
  ClinicalSummary: new EntityAPI(apiClient, 'clinical-summaries'),
  DrugInteraction: new EntityAPI(apiClient, 'drug-interactions'),
  EmergencyHealthData: new EntityAPI(apiClient, 'emergency-health-data'),
  ConsentRecord: new EntityAPI(apiClient, 'consent-records'),
  MedicalDocument: new EntityAPI(apiClient, 'medical-documents'),
  PredictiveAnalytic: new EntityAPI(apiClient, 'predictive-analytics'),
  TelemedSession: new EntityAPI(apiClient, 'telemed-sessions'),
  DemoRequest: new EntityAPI(apiClient, 'demo-requests'),
  FeatureInterest: new EntityAPI(apiClient, 'feature-interests'),
};

// Mock integrations for compatibility
const integrations = {
  Core: {
    async UploadFile({ file }) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/medical-documents`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return { file_url: data.file_url || `/uploads/${file.name}` };
    },
    
    async InvokeLLM({ prompt }) {
      // Mock LLM response - in production, this would call an actual LLM service
      // For now, generate a simple mock response based on the prompt
      const isClinicalSummary = prompt.includes('clinical summary');
      const isPrediction = prompt.includes('predict');
      
      if (isClinicalSummary) {
        return {
          response: `Clinical Summary:
          
1. Brief Clinical Overview:
   Patient presents with stable chronic conditions. Current health status requires ongoing monitoring and medication management.

2. Current Diagnoses:
   ${prompt.includes('Chronic Conditions') ? 'Hypertension, Type 2 Diabetes' : 'No active diagnoses'}

3. Medication Summary:
   Patient is on multiple medications requiring careful monitoring for interactions and efficacy.

4. Risk Assessment Score: 45/100
   Moderate risk level based on chronic conditions and medication complexity.

5. Key Risk Factors:
   - Multiple chronic conditions
   - Polypharmacy
   - Requires regular monitoring`,
          summary: 'Moderate risk patient with stable chronic conditions requiring ongoing care.',
        };
      } else if (isPrediction) {
        const riskScore = Math.floor(Math.random() * 40) + 20; // 20-60
        const riskLevel = riskScore < 30 ? 'low' : riskScore < 50 ? 'moderate' : 'high';
        
        return {
          response: `Prediction Analysis:
          
Risk Score: ${riskScore}/100
Risk Level: ${riskLevel.toUpperCase()}

Contributing Factors:
- Patient age and medical history
- Current medication regimen
- Chronic condition management

Recommendations:
- Continue current treatment plan
- Schedule follow-up in 3 months
- Monitor vital signs regularly`,
          risk_score: riskScore,
          risk_level: riskLevel,
          contributing_factors: ['Age', 'Medical history', 'Current medications'],
          recommendations: ['Continue treatment', 'Follow-up in 3 months', 'Regular monitoring'],
        };
      }
      
      return {
        response: `AI-generated response for: ${prompt.substring(0, 100)}...`,
        summary: 'This is a mock AI response. In production, this would be generated by an actual LLM service.',
      };
    },
  },
};

// Mock auth for compatibility
const auth = {
  async me() {
    // Return mock user - in production, this would check actual auth
    return {
      email: 'demo@swasthyaconnect.com',
      name: 'Demo User',
    };
  },
};

// Export API client similar to base44 structure
export const base44 = {
  entities,
  integrations,
  auth,
};

export default apiClient;

