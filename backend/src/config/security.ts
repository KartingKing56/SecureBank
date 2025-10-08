import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import express from 'express';
import { ENV } from './env'

export function securityMiddleware() {
    return [
        helmet({
            crossOriginOpenerPolicy: { policy: 'same-origin'},
            crossOriginResourcePolicy: { policy: 'same-origin'}
        }),
        express.json({ limit: '100kb'}),
        express.urlencoded({ extended: false, limit: '50kb' }),
        hpp(),
        mongoSanitize(),
        cors({ origin: ENV.CORS_ORIGIN, credentials: true }),
        compression(),
        cookieParser()
    ];
}