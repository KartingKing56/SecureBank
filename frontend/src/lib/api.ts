export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();

  const headers = new Headers(init.headers || {});

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = getCsrfFromCookie("__Host-csrf");
    if (csrf && !headers.has("X-CSRF-Token")) {
      headers.set("X-CSRF-Token", csrf);
    }
  }

  if (
    !headers.has("Content-Type") &&
    init.body &&
    typeof init.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
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
    const csrf = getCsrfFromCookie("__Host-csrf");
    if (csrf) retryHeaders.set("X-CSRF-Token", csrf);
  }
  if (
    !retryHeaders.has("Content-Type") &&
    init.body &&
    typeof init.body === "string"
  ) {
    retryHeaders.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    headers: retryHeaders,
    credentials: "include",
  });
}

function getCsrfFromCookie(cookieName = "__Host-csrf"): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
