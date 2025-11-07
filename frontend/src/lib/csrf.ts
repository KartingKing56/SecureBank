const CSRF_COOKIE_NAME = "__Host-csrf";

export function readCookie(name: string): string | null {
  const m = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()\\[\]\\/+^])/g, "\\$1")}=([^;]*)`
    )
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export async function ensureCsrf(): Promise<string> {
  let token = readCookie(CSRF_COOKIE_NAME);
  if (token) return token;

  const res = await fetch("/api/auth/csrf", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to obtain CSRF token");

  const data = await res.json().catch(() => ({}));
  token = data?.csrf || readCookie(CSRF_COOKIE_NAME);
  if (!token) throw new Error("CSRF cookie missing after issue");
  return token;
}

export function getCsrfToken(): string | null {
  return readCookie(CSRF_COOKIE_NAME);
}