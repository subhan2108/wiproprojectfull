// =======================
// Environment variables
// =======================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_PREFIX = import.meta.env.VITE_AUTH_ENDPOINTS_PREFIX;
const TOKEN_REFRESH_ENDPOINT = import.meta.env.VITE_TOKEN_REFRESH_ENDPOINT;

// =======================
// Helpers
// =======================
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (err) {
      console.warn('Logout request failed');
    }
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

// =======================
// Core fetch wrapper
// =======================
const fetchWithAuth = async (endpoint, options = {}) => {
  const config = {
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle token refresh
  if (response.status === 401 && !endpoint.includes(TOKEN_REFRESH_ENDPOINT)) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      await logoutUser();
      throw new Error('Session expired');
    }

    const refreshResponse = await fetch(
      `${API_BASE_URL}${TOKEN_REFRESH_ENDPOINT}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!refreshResponse.ok) {
      await logoutUser();
      throw new Error('Session expired');
    }

    const refreshData = await refreshResponse.json();
    localStorage.setItem('access_token', refreshData.access);

    // retry original request
    config.headers.Authorization = `Bearer ${refreshData.access}`;
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  }

  const contentType = response.headers.get('content-type');
  const data =
    contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || 'Request failed');
  }

  return data;
};

// =======================
// Base API object
// =======================
const apiRequest = {
  get: (url) => fetchWithAuth(url),
  post: (url, data, headers = {}) =>
    fetchWithAuth(url, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  put: (url, data) =>
    fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: (url, data) =>
    fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (url) =>
    fetchWithAuth(url, {
      method: 'DELETE',
    }),
};

// =======================
// Properties API
// =======================
export const propertiesAPI = {
  list: (params) =>
    apiRequest.get(
      `/properties/${params ? `?${new URLSearchParams(params)}` : ''}`
    ),

  get: (id) => apiRequest.get(`/properties/${id}/`),

  create: (data) => apiRequest.post('/properties/', data),

  update: (id, data) => apiRequest.put(`/properties/${id}/`, data),

  remove: (id) => apiRequest.delete(`/properties/${id}/`),

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest.post(
      `/properties/${id}/upload-image/`,
      formData
    );
  },
};

// =======================
// Auth API
// =======================
export const authAPI = {
  login: (credentials) =>
    apiRequest.post(`${AUTH_PREFIX}/login/`, credentials),

  register: (data) =>
    apiRequest.post(`${AUTH_PREFIX}/register/`, data),

  profile: () =>
    apiRequest.get(`${AUTH_PREFIX}/profile/`),

  updateProfile: (data) =>
    apiRequest.put(`${AUTH_PREFIX}/profile/`, data),

  changePassword: (data) =>
    apiRequest.post(`${AUTH_PREFIX}/change-password/`, data),

  logout: logoutUser,
};

// =======================
// Export config
// =======================
export const config = {
  API_BASE_URL,
};

export default apiRequest;
