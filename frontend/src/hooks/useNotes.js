import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesService } from '../services/notesService'
import toast from 'react-hot-toast'

export const useNotes = (params = {}) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesService.getAllNotes(params),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
  })
}

export const useNote = (id) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => notesService.getNoteById(id),
    enabled: !!id,
    staleTime: 0,
  })
}

export const useTrendingNotes = () => {
  return useQuery({
    queryKey: ['trending-notes'],
    queryFn: () => notesService.getTrendingNotes(),
    staleTime: 0,
  })
}

export const useUploadNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notesService.uploadNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes'])
      toast.success('Note uploaded successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload note')
    },
  })
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => notesService.updateNote(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['notes'])
      queryClient.invalidateQueries(['note', id])
      toast.success('Note updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update note')
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notesService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes'])
      toast.success('Note deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete note')
    },
  })
}

export const useDownloadNote = () => {
  return useMutation({
    mutationFn: notesService.downloadNote,
    onSuccess: (data) => {
      window.open(data.fileUrl, '_blank')
      toast.success('Download started!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to download note')
    },
  })
}

export const useRateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rating }) => notesService.rateNote(id, rating),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['note', id])
      queryClient.invalidateQueries(['notes'])
      toast.success('Rating submitted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to rate note')
    },
  })
}

export const useToggleBookmark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notesService.toggleBookmark,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['note', id])
      queryClient.invalidateQueries(['notes'])
      queryClient.invalidateQueries(['bookmarks'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to toggle bookmark')
    },
  })
}