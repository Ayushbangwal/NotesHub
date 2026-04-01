import { api } from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserBan: (id, data) => api.patch(`/admin/users/${id}/ban`, data),
  getAllNotes: (params) => api.get('/admin/notes', { params }),
  deleteNote: (id) => api.delete(`/admin/notes/${id}`),
  toggleNoteApproval: (id) => api.patch(`/admin/notes/${id}/approve`),

  // ✅ NEW — Bulk Actions
  bulkNoteAction: (noteIds, action) => api.post('/admin/notes/bulk', { noteIds, action }),

  // ✅ NEW — Announcements
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  getAllAnnouncements: () => api.get('/admin/announcements'),
  toggleAnnouncement: (id) => api.patch(`/admin/announcements/${id}/toggle`),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
  getActiveAnnouncements: () => api.get('/admin/announcements/active'),
};