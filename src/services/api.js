import axios from 'axios'

// Using Vite proxy - no need for full URL
const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── Destinations ──────────────────────────────────────
export const destinationAPI = {
  getAll:      (params) => api.get('/destinations', { params }),
  getFeatured: ()       => api.get('/destinations/featured'),
  getById:     (id)     => api.get(`/destinations/${id}`),
  create:      (data)   => api.post('/destinations', data),
  update:      (id, data) => api.put(`/destinations/${id}`, data),
  delete:      (id)     => api.delete(`/destinations/${id}`),
}

// ── Packages ──────────────────────────────────────────
export const packageAPI = {
  getAll:          (params) => api.get('/packages', { params }),
  getByDestination:(id)     => api.get(`/packages/destination/${id}`),
  getById:         (id)     => api.get(`/packages/${id}`),
  create:          (data)   => api.post('/packages', data),
  update:          (id, data) => api.put(`/packages/${id}`, data),
  delete:          (id)     => api.delete(`/packages/${id}`),
}

// ── Bookings ──────────────────────────────────────────
export const bookingAPI = {
  create:        (data)   => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getById:       (id)     => api.get(`/bookings/${id}`),
  updateStatus:  (id, status) => api.put(`/bookings/${id}/status`, null, { params: { status } }),
  cancelBooking: (id)     => api.put(`/bookings/${id}/cancel`),
}

// ── Guides ────────────────────────────────────────────
export const guideAPI = {
  getAll:      () => api.get('/guides'),
  getAvailable:() => api.get('/guides/available'),
  getById:     (id)     => api.get(`/guides/${id}`),
  create:      (data)   => api.post('/guides', data),
  update:      (id, data) => api.put(`/guides/${id}`, data),
  delete:      (id)     => api.delete(`/guides/${id}`),
}

// ── Reviews ───────────────────────────────────────────
export const reviewAPI = {
  create:           (data)         => api.post('/reviews', data),
  getByDestination: (id, params)   => api.get(`/reviews/destination/${id}`, { params }),
}

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
}

export default api
