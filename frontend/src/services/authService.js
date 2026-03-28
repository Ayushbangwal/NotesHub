import api from './api'

export const authService = {
  // Register new user
  signup: (userData) => api.post('/auth/signup', userData),

  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Logout user
  logout: () => api.post('/auth/logout'),

  // Get current user
  getMe: () => api.get('/auth/me'),
}
