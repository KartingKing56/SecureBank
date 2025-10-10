export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('accessToken') || '';
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res1 = await fetch(input, { ...init, headers, credentials: 'include' });
  if (res1.status !== 401) return res1;

  const ref = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!ref.ok) return res1;

  const { accessToken } = await ref.json();
  if (!accessToken) return res1;

  localStorage.setItem('accessToken', accessToken);
  const headers2 = new Headers(init.headers || {});
  headers2.set('Authorization', `Bearer ${accessToken}`);
  return fetch(input, { ...init, headers: headers2, credentials: 'include' });
}