import type { Tx, TxStatus } from "../types/transactions";
import { apiFetch } from "./api";

type ApiTx = {
  _id: string;
  amount: string | number;
  currency: string;
  status: string;
  provider?: string;
  beneficiaryId?: string;
  createdAt?: string;
};

const allowed = ["pending", "verified", "queued", "forwarded", "failed"] as const;

function normalizeStatus(s: string): TxStatus {
  const v = (s ?? "").toLowerCase();
  return (allowed as readonly string[]).includes(v) ? (v as TxStatus) : "pending";
}

function normalizeTx(t: ApiTx): Tx {
  return {
    _id: t._id,
    amount: String(t.amount),
    currency: (t.currency || "").toUpperCase(),
    status: normalizeStatus(t.status),
    provider: t.provider,
    beneficiaryId: t.beneficiaryId,
    createdAt: t.createdAt,
  };
}

export async function listMyTransactions(params: { 
  page?: number; 
  limit?: number;
  status?: TxStatus;
} = {}) {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.limit != null) q.set("limit", String(params.limit));
  if (params.status) q.set("status", params.status);

  const res = await apiFetch(`/api/transactions?${q.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to load transactions (${res.status})`);
  }

  const body = (await res.json()) as {
    page: number;
    limit: number;
    total: number;
    items: ApiTx[];
  };

  return {
    ...body,
    items: body.items.map(normalizeTx),
  };
}
