import type { Request, Response } from 'express';
import Clap from '../models/Clap.js';
import Post from '../models/Post.js';
import logger from '../config/logger.js';

// Add or update clap for a post
export const clapPost = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const user = (req as any).user;
        const userId = user?._id || user?.id;
        const { count = 1 } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Validate count
        const clapCount = Math.min(Math.max(parseInt(count), 1), 50);

        // Find existing clap or create new
        let clap = await Clap.findOne({ user_id: userId, post_id: postId });

        if (clap) {
            // Update existing clap (max 50 total)
            clap.count = Math.min(clap.count + clapCount, 50);
            clap.updated_at = new Date();
            await clap.save();
        } else {
            // Create new clap
            clap = await Clap.create({
                user_id: userId,
                post_id: postId,
                count: clapCount
            });
        }

        // Get total clap count for the post
        const totalClaps = await Clap.aggregate([
            { $match: { post_id: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: null, total: { $sum: '$count' } } }
        ]);

        const total = totalClaps[0]?.total || 0;

        res.status(200).json({
            userClaps: clap.count,
            totalClaps: total
        });
    } catch (error: any) {
        logger.error('Clap post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getClapStats = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const user = (req as any).user;
        const userId = user?._id || user?.id;

        // Get total claps
        const totalClaps = await Clap.aggregate([
            { $match: { post_id: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: null, total: { $sum: '$count' } } }
        ]);

        // Get user's claps if authenticated
        let userClaps = 0;
        if (userId) {
            const userClap = await Clap.findOne({ user_id: userId, post_id: postId });
            userClaps = userClap?.count || 0;
        }

        res.status(200).json({
            totalClaps: totalClaps[0]?.total || 0,
            userClaps
        });
    } catch (error: any) {
        logger.error('Get clap stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

import mongoose from 'mongoose';
