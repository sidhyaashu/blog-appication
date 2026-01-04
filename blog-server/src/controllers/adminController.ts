import type { Request, Response } from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalPosts = await Post.countDocuments();
        const posts = await Post.find().select('views');
        const totalViews = posts.reduce((acc, post: any) => acc + (post.views || 0), 0);
        const totalUsers = await User.countDocuments({ role: 'user' });

        res.json({
            totalPosts,
            totalViews,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
