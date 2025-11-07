import axios from "axios";
import { ensureCsrf, getCsrfToken } from "./csrf";
import { apiFetch } from "./api";

const API_BASE = "/api";

export function getAccessToken(): string {
  return localStorage.getItem("accessToken") || "";
}
export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}
export function getRole(): "customer" | "employee" | "admin" | null {
  const r = localStorage.getItem("role");
  return r === "customer" || r === "employee" || r === "admin" ? r : null;
}

async function withAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  return fetch(input, { ...init, headers, credentials: "include" });
}

export async function listCustomers() {
  const res = await withAuth("/api/admin/users?role=customer");
  if (!res.ok) throw new Error("Failed to fetch customers");
  const data = await res.json();
  return data.items ?? data;
}

export async function listEmployees() {
  const res = await apiFetch("/api/admin/employees");
  if (!res.ok) throw new Error(`Failed to fetch employees (${res.status})`);
  return res.json();
}

export async function listStaffCustomers(params: { limit?: number; cursor?: string } = {}) {
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  const res = await apiFetch(`/api/staff/customers?${q.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
  return res.json() as Promise<{
    items: Array<{
      _id: string;
      firstName: string;
      surname: string;
      username: string;
      accountNumber: string;
      createdAt?: string;
    }>;
    nextCursor: string | null;
  }>;
}

export async function listAdminTransactions(params: { status?: string; limit?: number; cursor?: string }) {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  const res = await apiFetch(`/api/admin/transactions?${q.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch admin transactions (${res.status})`);
  return res.json();
}

export async function createEmployee(input: {
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  password: string;
  department?: string;
  staffId?: string;
}) {
  await ensureCsrf();
  const csrf = getCsrfToken() ?? "";
  const res = await apiFetch("/api/admin/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      body?.error === "validation_error"
        ? JSON.stringify(body.details)
        : body?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

function readCookie(name: string): string | null {
  const safe = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const m = document.cookie.match(new RegExp(`(?:^|; )${safe}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;

  const method = (config.method || "get").toLowerCase();
  if (["post", "patch", "put", "delete"].includes(method)) {
    const csrf = readCookie("__Host-csrf");
    if (csrf) (config.headers as any)["X-CSRF-Token"] = csrf;
  }
  return config;
});
