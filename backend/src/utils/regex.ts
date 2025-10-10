export const REGEX = {
    firstName: /^[A-Za-z]{2.30}$/,
    surname: /^[A-Za-z]{2,40}$/,
    idNumber: /^\d{13}$/,
    username: /^[A-Za-z0-9_]{4,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
};