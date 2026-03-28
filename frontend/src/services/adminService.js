import api from './api'

export const adminService = {
  // Get platform statistics
  getStats: () => api.get('/admin/stats'),

  // Get all users
  getAllUsers: (params) => api.get('/admin/users', { params }),

  // Ban/unban user
  toggleUserBan: (id, data) => api.put(`/admin/users/${id}/ban`, data),

  // Get all notes for admin
  getAllNotes: (params) => api.get('/admin/notes', { params }),

  // Delete note (admin)
  deleteNote: (id) => api.delete(`/admin/notes/${id}`),

  // Approve/unapprove note
  toggleNoteApproval: (id) => api.put(`/admin/notes/${id}/approve`),
}
