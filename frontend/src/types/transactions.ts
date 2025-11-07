export type TxStatus =
  | "pending"
  | "verified"
  | "queued"
  | "forwarded"
  | "failed";

export type Tx = {
  _id: string;
  amount: string;
  currency: string;
  status: TxStatus;
  provider?: string;
  beneficiaryId?: string;
  createdAt?: string;
};
