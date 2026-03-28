import api from './api'

export const notesService = {
  // Get all notes with filters
  getAllNotes: (params) => api.get('/notes', { params }),

  // Get single note
  getNoteById: (id) => api.get(`/notes/${id}`),

  // Upload new note
  uploadNote: (formData) => api.post('/notes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Update note
  updateNote: (id, data) => api.put(`/notes/${id}`, data),

  // Delete note
  deleteNote: (id) => api.delete(`/notes/${id}`),

  // Download note
  downloadNote: (id) => api.post(`/notes/${id}/download`),

  // Rate note
  rateNote: (id, rating) => api.post(`/notes/${id}/rate`, { rating }),

  // Toggle bookmark
  toggleBookmark: (id) => api.post(`/notes/${id}/bookmark`),

  // Get trending notes
  getTrendingNotes: () => api.get('/notes/trending'),

  // Get note comments
  getNoteComments: (id) => api.get(`/notes/${id}/comments`),

  // Add comment to note
  addComment: (id, text) => api.post(`/notes/${id}/comments`, { text }),

  // Delete comment
  deleteComment: (noteId, commentId) => api.delete(`/notes/${noteId}/comments/${commentId}`),
}
