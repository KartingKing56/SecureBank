import axios from "axios";

const API_BASE = "/api";

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function getRole(): "customer" | "employee" | "admin" | null {
  const r = localStorage.getItem("role");
  if (r === "customer" || r === "employee" || r === "admin") return r;
  return null;
}

export function getCsrfFromCookie(cookieName = "csrf_token"): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function ensureCsrf(): Promise<void> {
  await axios.post(`${API_BASE}/auth/csrf`, {}, { withCredentials: true });
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const method = (config.method || "get").toLowerCase();
  if (["post", "patch", "put", "delete"].includes(method)) {
    const csrf = getCsrfFromCookie("csrf_token");
    if (csrf) config.headers["X-CSRF-Token"] = csrf;
  }
  return config;
});
