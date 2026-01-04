import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import logger from '../config/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ovanthra-blog';

async function verifyData() {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info(`Connected to MongoDB: ${MONGO_URI}`);

        const userCount = await User.countDocuments();
        const categoryCount = await Category.countDocuments();
        const postCount = await Post.countDocuments();

        logger.info('=== Database Status ===');
        logger.info(`Users: ${userCount}`);
        logger.info(`Categories: ${categoryCount}`);
        logger.info(`Posts: ${postCount}`);
        logger.info('=====================');

        if (userCount > 0) {
            logger.info('\n=== Sample Users ===');
            const users = await User.find().select('name email role').limit(5);
            users.forEach(user => {
                logger.info(`- ${user.name} (${user.email}) - Role: ${user.role}`);
            });
        }

        if (categoryCount > 0) {
            logger.info('\n=== Categories ===');
            const categories = await Category.find().select('name slug');
            categories.forEach(cat => {
                logger.info(`- ${cat.name} (${cat.slug})`);
            });
        }

        if (postCount > 0) {
            logger.info('\n=== Sample Posts ===');
            const posts = await Post.find().populate('category_id', 'name').populate('author_id', 'name').limit(5);
            posts.forEach(post => {
                logger.info(`- ${post.title}`);
                logger.info(`  Author: ${(post.author_id as any)?.name || 'Unknown'}`);
                logger.info(`  Category: ${(post.category_id as any)?.name || 'Unknown'}`);
                logger.info(`  Status: ${post.status}`);
            });
        }

        if (userCount === 0 && categoryCount === 0 && postCount === 0) {
            logger.warn('⚠️  No data found in database!');
            logger.info('Please run: npm run seed');
        } else {
            logger.info('\n✅ Database has data!');
        }

        process.exit(0);
    } catch (error) {
        logger.error('Error verifying database:', error);
        process.exit(1);
    }
}

verifyData();
