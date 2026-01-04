import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import otherRoutes from './routes/others.js';
import engagementRoutes from './routes/engagement.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import logger from './config/logger.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// ... (existing imports)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

import notificationRoutes from './routes/notification.js';

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // New upload route
app.use('/api/notifications', notificationRoutes);
app.use('/api', otherRoutes);
app.use('/api', engagementRoutes);

// Database Connection
connectDB().then(async () => {
    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        logger.warn('Admin email or password not provided in environment variables. Skipping admin user seeding.');
        return;
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        logger.info('Admin user seeded');
    }
});

// ... (existing code)

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Ovanthra Blog API is running');
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

