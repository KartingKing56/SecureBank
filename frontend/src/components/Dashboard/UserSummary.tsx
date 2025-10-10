import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function UserSummary() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch('/api/user/me');
      if (!res.ok) return;
      const data = await res.json();
      setUser(data);
    })();
  }, []);

  if (!user) return null;

  return (
    <div className="card shadow-sm p-3 mb-3">
      <div><strong>{user.firstName} {user.surname}</strong></div>
      <div className="text-muted">Username: {user.username}</div>
      <div className="text-muted">Account: {user.accountNumber}</div>
    </div>
  );
}
