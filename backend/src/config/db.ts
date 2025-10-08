import mongoose from 'mongoose';
import { logger } from './logger';
import { ENV } from './env';

export async function connectDB() {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('MONGODB connected');
}

export async function disconnectDB() {
    await mongoose.connection.close();
}