// services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_PREFIX = "/auth";
const TOKEN_REFRESH_ENDPOINT = "/auth/token/refresh/";

// ================= HELPERS =================
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ================= LOGOUT =================
const logoutUser = () => {
  console.error("🚪 LOGOUT CALLED");
  console.trace();

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

// ================= FETCH WITH AUTH =================
export const fetchWithAuth = async (url, options = {}) => {
  console.log("➡️ fetchWithAuth:", url);

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  console.log("⬅️ status:", response.status);

  // 🔄 Access expired → try refresh
  if (response.status === 401 && !url.includes(TOKEN_REFRESH_ENDPOINT)) {
    console.warn("🔄 Access expired, trying refresh");

    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      logoutUser();
      throw new Error("No refresh token");
    }

    const refreshRes = await fetch(
      `${API_BASE_URL}${AUTH_PREFIX}${TOKEN_REFRESH_ENDPOINT}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    if (!refreshRes.ok) {
      console.error("❌ Refresh failed");
      logoutUser();
      throw new Error("Refresh failed");
    }

    const refreshData = await refreshRes.json();
    localStorage.setItem("access_token", refreshData.access);

    // retry original request
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }

  return response.json();
};

// ================= AUTH API =================
export const authAPI = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");

    localStorage.setItem("access_token", data.tokens.access);
    localStorage.setItem("refresh_token", data.tokens.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");

    localStorage.setItem("access_token", data.tokens.access);
    localStorage.setItem("refresh_token", data.tokens.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  },

  getProfile: () => fetchWithAuth(`${AUTH_PREFIX}/profile/`),

  getProfileDetails: () =>
    fetchWithAuth(`${AUTH_PREFIX}/profile-details/`),

  logout: logoutUser,
};

// ================= GENERIC API =================
export const apiRequest = {
  get: (url) => fetchWithAuth(url),
  post: (url, data) =>
    fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
  patch: (url, data) =>
    fetchWithAuth(url, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
};
