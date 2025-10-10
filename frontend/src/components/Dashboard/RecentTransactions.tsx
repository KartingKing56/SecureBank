import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Tx = {
  _id: string;
  reference: string;
  amount: string;
  currency: string;
  status: 'pending' | 'queued' | 'forwarded' | 'failed';
  createdAt: string;
  beneficiary: { name: string; bankName?: string; ibanOrAccount: string };
};

export default function RecentTransactions() {
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/tx?limit=5&page=1');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setItems(data.items || []);
      } catch (e: any) {
        setErr(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading transactions…</p>;
  if (err) return <p className="text-danger">{err}</p>;
  if (!items.length) return <p>No recent transactions.</p>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="mb-3">Recent Transactions</h5>
      <ul className="list-unstyled">
        {items.map(tx => (
          <li key={tx._id} className="mb-2">
            <div className="d-flex justify-content-between">
              <span><strong>{tx.reference}</strong> — {tx.beneficiary.name}</span>
              <span>{tx.currency} {tx.amount}</span>
            </div>
            <small className="text-muted">
              {new Date(tx.createdAt).toLocaleString()} • {tx.status}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
