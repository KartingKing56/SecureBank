import mongoose from 'mongoose';
import { logger } from './logger';
import { ENV } from './env';


//--------------------------------------
// Config file for starting and disconnecting Database.
//--------------------------------------

export async function connectDB() {
    mongoose.set('strictQuery', true);
    mongoose.set('sanitizeFilter', true);
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('MONGODB connected');
}

export async function disconnectDB() {
    await mongoose.connection.close();
}