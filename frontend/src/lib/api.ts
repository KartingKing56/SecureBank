export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});

  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const method = (init.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = getCsrfFromCookie();
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status !== 401) return response;

  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) return response;

  const { accessToken: newAccessToken } = await refreshResponse.json();
  if (!newAccessToken) return response;

  localStorage.setItem("accessToken", newAccessToken);

  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = getCsrfFromCookie();
    if (csrf) retryHeaders.set("X-CSRF-Token", csrf);
  }

  return fetch(input, {
    ...init,
    headers: retryHeaders,
    credentials: "include",
  });
}

function getCsrfFromCookie(cookieName = "csrf_token"): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
