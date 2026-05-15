// ==================== API SERVICE ====================
// Centralized Axios instance with interceptors

import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors & token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const { token } = response.data
        localStorage.setItem('token', token)
        apiClient.defaults.headers.Authorization = `Bearer ${token}`
        originalRequest.headers.Authorization = `Bearer ${token}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    const message = error.response?.data?.error || 'Something went wrong'
    toast.error(message)
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: { username: string; email: string; password: string; displayName: string }) =>
    apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
}

// User API
export const userApi = {
  getProfile: (username: string) => apiClient.get(`/users/${username}`),
  updateProfile: (data: any) => apiClient.patch('/users/me', data),
  follow: (userId: string) => apiClient.post(`/users/${userId}/follow`),
  unfollow: (userId: string) => apiClient.delete(`/users/${userId}/follow`),
  getFeed: (page: number) => apiClient.get(`/users/me/feed?page=${page}`),
  search: (query: string) => apiClient.get(`/users/search?q=${query}`),
}

// Post API
export const postApi = {
  create: (data: any) => apiClient.post('/posts', data),
  getById: (id: string) => apiClient.get(`/posts/${id}`),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
  like: (id: string, vibe: string) => apiClient.post(`/posts/${id}/like`, { vibe }),
  unlike: (id: string) => apiClient.delete(`/posts/${id}/like`),
  getComments: (id: string) => apiClient.get(`/posts/${id}/comments`),
  createComment: (id: string, content: string, parentId?: string) =>
    apiClient.post(`/posts/${id}/comments`, { content, parentId }),
  bookmark: (id: string) => apiClient.post(`/posts/${id}/bookmark`),
  unbookmark: (id: string) => apiClient.delete(`/posts/${id}/bookmark`),
}

// Message API
export const messageApi = {
  getChats: () => apiClient.get('/messages/chats'),
  getChat: (chatId: string) => apiClient.get(`/messages/chats/${chatId}`),
  createDirectChat: (userId: string) => apiClient.post('/messages/chats/direct', { userId }),
  createGroupChat: (data: any) => apiClient.post('/messages/chats/group', data),
  getMessages: (chatId: string, page?: number) =>
    apiClient.get(`/messages/chats/${chatId}/messages?page=${page || 1}`),
  sendMessage: (chatId: string, data: any) =>
    apiClient.post(`/messages/chats/${chatId}/messages`, data),
  editMessage: (messageId: string, content: string) =>
    apiClient.patch(`/messages/${messageId}`, { content }),
  deleteMessage: (messageId: string) => apiClient.delete(`/messages/${messageId}`),
  addReaction: (messageId: string, emoji: string) =>
    apiClient.post(`/messages/${messageId}/reactions`, { emoji }),
  removeReaction: (messageId: string, emoji: string) =>
    apiClient.delete(`/messages/${messageId}/reactions/${emoji}`),
  searchMessages: (query: string) => apiClient.get(`/messages/search?q=${query}`),
}

// Story API
export const storyApi = {
  create: (data: any) => apiClient.post('/stories', data),
  getFeed: () => apiClient.get('/stories/feed'),
  getMine: () => apiClient.get('/stories/me'),
  view: (storyId: string, reaction?: string) =>
    apiClient.post(`/stories/${storyId}/view`, { reaction }),
  delete: (storyId: string) => apiClient.delete(`/stories/${storyId}`),
}

// Live API
export const liveApi = {
  getStreams: () => apiClient.get('/live/streams'),
  getStream: (streamId: string) => apiClient.get(`/live/streams/${streamId}`),
  create: (data: any) => apiClient.post('/live/streams', data),
  start: (streamId: string) => apiClient.post(`/live/streams/${streamId}/start`),
  end: (streamId: string) => apiClient.post(`/live/streams/${streamId}/end`),
  join: (streamId: string) => apiClient.post(`/live/streams/${streamId}/join`),
  leave: (streamId: string) => apiClient.post(`/live/streams/${streamId}/leave`),
  sendChat: (streamId: string, content: string) =>
    apiClient.post(`/live/streams/${streamId}/chat`, { content }),
  getChat: (streamId: string) => apiClient.get(`/live/streams/${streamId}/chat`),
  banViewer: (streamId: string, userId: string, reason?: string) =>
    apiClient.post(`/live/streams/${streamId}/ban/${userId}`, { reason }),
}

// Notification API
export const notificationApi = {
  getAll: () => apiClient.get('/notifications'),
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
}

// Admin API
export const adminApi = {
  getQueue: (params?: any) => apiClient.get('/admin/moderation/queue', { params }),
  assignQueueItem: (queueId: string) => apiClient.post(`/admin/moderation/queue/${queueId}/assign`),
  resolveQueueItem: (queueId: string, data: any) =>
    apiClient.post(`/admin/moderation/queue/${queueId}/resolve`, data),
  getReports: (params?: any) => apiClient.get('/admin/reports', { params }),
  resolveReport: (reportId: string, data: any) =>
    apiClient.post(`/admin/reports/${reportId}/resolve`, data),
  getUsers: (params?: any) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (userId: string, data: any) =>
    apiClient.patch(`/admin/users/${userId}/status`, data),
  getAppeals: (params?: any) => apiClient.get('/admin/appeals', { params }),
  resolveAppeal: (appealId: string, data: any) =>
    apiClient.post(`/admin/appeals/${appealId}/resolve`, data),
  getAnalytics: (period?: string) => apiClient.get('/admin/analytics', { params: { period } }),
  getPolicies: () => apiClient.get('/admin/policies'),
  updatePolicy: (policyId: string, data: any) =>
    apiClient.patch(`/admin/policies/${policyId}`, data),
}
