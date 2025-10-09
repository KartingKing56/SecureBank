import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import express from 'express';
import { ENV } from './env'

const allowedOrigins = [
    'http://localhost:5173',
    'https://localhost:5173',
];

function sanitizeBodyAndParams(): express.RequestHandler {
  return (req, _res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
  };
}

export function securityMiddleware() {
    return [
        helmet({
            crossOriginOpenerPolicy: { policy: 'same-origin'},
            crossOriginResourcePolicy: { policy: 'same-origin'}
        }),
        express.json({ limit: '100kb'}),
        express.urlencoded({ extended: false, limit: '50kb' }),
        hpp(),
        sanitizeBodyAndParams(),
        cors({
            origin(origin, cb) {
                if (!origin) return cb(null, true);
                if (allowedOrigins.includes(origin)) return cb(null, true);
                cb(new Error('Not allowed by CORS'));
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
            exposedHeaders: ['ETag'],
        }),
        compression(),
        cookieParser()
    ];
}