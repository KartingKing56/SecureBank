//--------------------------------------
// Regex check for transaction - https://chatgpt.com - used for regex values
//--------------------------------------
const SWIFT_BIC = /^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export const TX_REGEX = {
  amount: /^(?:[1-9]\d{0,12})(?:\.\d{1,2})?$/,
  currency: /^[A-Z]{3}$/,
  provider: /^(SWIFT)$/,
  name: /^[A-Za-z][A-Za-z .,'-]{1,59}$/,
  bankName: /^[A-Za-z0-9 .,'-]{2,80}$/,
  ibanOrAccount: /^[A-Z0-9]{6,34}$/,
  swiftBic: SWIFT_BIC,
  note: /^[A-Za-z0-9 .,'\-()/_]{0,140}$/,
};
