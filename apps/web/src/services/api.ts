import axios from 'axios';

// Create an axios instance - use relative URL to go through Vite proxy
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Lead API functions
export const leadApi = {
  getLeads: (params: any) => apiClient.get('/v1/leads', { params }),
  getLeadById: (id: string) => apiClient.get(`/v1/leads/${id}`),
  createLead: (data: any) => apiClient.post('/v1/leads', data),
  updateLead: (id: string, data: any) => apiClient.put(`/v1/leads/${id}`, data),
  deleteLead: (id: string) => apiClient.delete(`/v1/leads/${id}`),
  assignLead: (leadId: string, userId: string) => 
    apiClient.post(`/v1/leads/${leadId}/assign`, { userId }),
  updateLeadStatus: (leadId: string, status: string) => 
    apiClient.patch(`/v1/leads/${leadId}/status`, { status }),
};

// Activity API functions
export const activityApi = {
  getActivitiesByLeadId: (leadId: string, params: any) => 
    apiClient.get(`/v1/lead-activities/lead/${leadId}/activities`, { params }),
  createActivity: (data: any) => apiClient.post('/v1/lead-activities', data),
  updateActivity: (id: string, data: any) => 
    apiClient.put(`/v1/lead-activities/${id}`, data),
  deleteActivity: (id: string) => apiClient.delete(`/v1/lead-activities/${id}`),
  completeActivity: (id: string) => 
    apiClient.patch(`/v1/lead-activities/${id}/complete`),
};

// Automation Rule API functions
export const automationRuleApi = {
  getRules: (params: any) => apiClient.get('/v1/automation-rules', { params }),
  createRule: (data: any) => apiClient.post('/v1/automation-rules', data),
  getRuleById: (id: string) => apiClient.get(`/v1/automation-rules/${id}`),
  updateRule: (id: string, data: any) => 
    apiClient.put(`/v1/automation-rules/${id}`, data),
  deleteRule: (id: string) => apiClient.delete(`/v1/automation-rules/${id}`),
  toggleRuleStatus: (id: string) => 
    apiClient.patch(`/v1/automation-rules/${id}/toggle`),
};

// Auth API functions
export const authApi = {
  register: (data: any) => apiClient.post('/v1/auth/register', data),
  login: (data: any) => apiClient.post('/v1/auth/login', data),
  refresh: (data: any) => apiClient.post('/v1/auth/refresh', data),
  me: () => apiClient.get('/v1/auth/me'),
};