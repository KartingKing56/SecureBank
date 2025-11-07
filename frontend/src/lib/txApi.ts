import { ensureCsrf, getCsrfToken, getAccessToken } from "./csrf";

export async function createTransaction(input: {
  amount: string;
  currency: string;
  swiftBic: string;
  benName: string;
  benAccount: string;
  benBank?: string;
  note?: string;
}) {
  try {
    await ensureCsrf();
    const csrf = getCsrfToken();
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error('No access token available');
    }

    const res = await fetch("/api/tx", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf ?? "",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency.toUpperCase(),
        swiftBic: input.swiftBic.toUpperCase(),
        beneficiary: {
          name: input.benName,
          ibanOrAccount: input.benAccount.toUpperCase(),
          bankName: input.benBank,
        },
        note: input.note,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Transaction creation failed:', error);
    throw error;
  }
}