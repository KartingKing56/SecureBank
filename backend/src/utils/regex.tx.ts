//--------------------------------------
// Regex check for transaction - https://chatgpt.com - used for regex values
//--------------------------------------
export const TX_REGEX = {
  amount: /^(?:0|[1-9]\d{0,12})(?:\.\d{1,2})?$/,
  currency: /^[A-Z]{3}$/,
  provider: /^(SWIFT)$/,
  name: /^[A-Za-z][A-Za-z .,'-]{1,59}$/,
  bankName: /^[A-Za-z0-9 .,'-]{2,80}$/,
  ibanOrAccount: /^[A-Z0-9]{6,34}$/,
  note: /^[A-Za-z0-9 .,'\-()/_]{0,140}$/,
};
