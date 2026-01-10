const API_BASE_URL = "https://wiproadmin.onrender.com";
const AUTH_PREFIX = "/api/auth";
const TOKEN_REFRESH_ENDPOINT = "/auth/token/refresh/";

/* =======================
   Helpers
======================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const logoutUser = async () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

/* =======================
   Core Fetch Wrapper
======================= */
const fetchWithAuth = async (endpoint, options = {}) => {
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  // 🔁 Token refresh
  if (response.status === 401 && !endpoint.includes(TOKEN_REFRESH_ENDPOINT)) {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      logoutUser();
      throw new Error("Session expired");
    }

    const refreshRes = await fetch(
      `${API_BASE_URL}${TOKEN_REFRESH_ENDPOINT}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    if (!refreshRes.ok) {
      logoutUser();
      throw new Error("Session expired");
    }

    const refreshData = await refreshRes.json();
    localStorage.setItem("access_token", refreshData.access);

    // Retry original request
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshData.access}`,
      },
      ...options,
    });
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }

  return response.json();
};

/* =======================
   Properties API
======================= */
export const propertiesAPI = {
  list: () => fetchWithAuth("/properties/"),

  get: (id) => fetchWithAuth(`/properties/${id}/`),

  create: (data) =>
    fetchWithAuth("/properties/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchWithAuth(`/properties/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchWithAuth(`/properties/${id}/`, {
      method: "DELETE",
    }),

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${API_BASE_URL}/properties/${id}/upload-image/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }).then((res) => res.json());
  },
};

/* =======================
   Auth API
======================= */
export const authAPI = {
  login: (data) =>
    fetchWithAuth("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    fetchWithAuth("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  profile: () => fetchWithAuth("/auth/profile/"),

  logout: logoutUser,
};

export default fetchWithAuth;
