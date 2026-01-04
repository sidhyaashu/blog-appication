import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ovanthra-blog');
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
