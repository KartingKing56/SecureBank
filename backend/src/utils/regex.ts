//--------------------------------------
// Regex for user - https://chatgpt.com - used for regex values
//--------------------------------------
export const REGEX = {
    firstName: /^[A-Za-z][A-Za-z'-]{1,39}$/,
    surname: /^[A-Za-z][A-Za-z'-]{1,39}$/,
    idNumber: /^\d{13}$/,
    username: /^[a-z0-9_]{4,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
};