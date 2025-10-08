import 'dotenv/config';

const required = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing env var: ${k}`)
        return v;
};

export const ENV = {
    MODE_ENV: process.env.NODE_ENV ?? 'development',
    IS_PROD: (process.env.NODE_ENV ?? 'development') === 'production',
    PORT: parseInt(process.env.PORT ?? '8443', 10),
    CORS_ORIGIN: required('CORS_ORIGIN'),
    MONGODB_URI: required('MONGODB_URI'),
    JWT: {
        ISS: required('JWT_ISS'),
        AUD: required('JWT_AUD'),
        ACCESS_TTL: required('JWT_ACCESS_TTL'),
        REFRESH_TTL: required('JWT_REFRESH_TTL'),
        SECRET: required('JWT_SECRET')
    },
    PASSWORD_PEPPER: required('PASSWORD_PEPPER'),
    CSRF_COOKIE_NAME: process.env.CSRF_COOKIE_NAME ?? '__Host-csrf'
}