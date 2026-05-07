import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Create an axios instance - use relative URL to go through Vite proxy
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized) - but NOT for auth endpoints themselves
    // (e.g. wrong password on /login should not trigger logout)
    const isAuthRoute = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthRoute) {
      // Dispatch Redux logout — clears localStorage + auth state,
      // which makes the app render <LoginPage> and stop all further requests.
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Auth API functions
export const authApi = {
  register: (data: any) => apiClient.post('/v1/auth/register', data),
  login: (data: any) => apiClient.post('/v1/auth/login', data),
  refresh: (data: any) => apiClient.post('/v1/auth/refresh', data),
  me: () => apiClient.get('/v1/auth/me'),
};

// Project API functions
export const projectApi = {
  getProjects: () => apiClient.get('/v1/projects'),
  getProjectById: (id: number) => apiClient.get(`/v1/projects/${id}`),
  createProject: (data: any) => apiClient.post('/v1/projects', data),
  updateProject: (id: number, data: any) => apiClient.put(`/v1/projects/${id}`, data),
  deleteProject: (id: number) => apiClient.delete(`/v1/projects/${id}`),
  addMember: (id: number, data: any) => apiClient.post(`/v1/projects/${id}/members`, data),
};

// Task API functions
export const taskApi = {
  getTasksByProject: (projectId: number, filters?: { status?: string; assigneeId?: number }) => 
    apiClient.get(`/v1/tasks/project/${projectId}`, { params: filters }),
  getAllTasks: (filters?: { status?: string; projectId?: number }) => 
    apiClient.get('/v1/tasks', { params: filters }),
  getTaskStats: () => apiClient.get('/v1/tasks/stats'),
  createTask: (data: any) => apiClient.post('/v1/tasks', data),
  updateTask: (id: number, data: any) => apiClient.put(`/v1/tasks/${id}`, data),
  deleteTask: (id: number) => apiClient.delete(`/v1/tasks/${id}`),
};

// User API functions
export const userApi = {
  getUsers: () => apiClient.get('/v1/users'),
  getUserById: (id: number) => apiClient.get(`/v1/users/${id}`),
  updateUserRole: (id: number, role: string) => apiClient.put(`/v1/users/${id}/role`, { role }),
  toggleUserStatus: (id: number, is_active: boolean) => apiClient.patch(`/v1/users/${id}/status`, { is_active }),
};

