import api from './api'

export const userService = {
  // Get user dashboard data
  getDashboard: () => api.get('/users/dashboard'),

  // Get user bookmarks
  getBookmarks: (params) => api.get('/users/bookmarks', { params }),

  // Get leaderboard
  getLeaderboard: () => api.get('/users/leaderboard'),
}
