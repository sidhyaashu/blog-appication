import mongoose from 'mongoose';
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

        // Use atomic update to prevent race conditions
        const result = await Clap.findOneAndUpdate(
            { user_id: userId, post_id: postId },
            {
                $inc: { count: clapCount },
                $set: { updated_at: new Date() }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        // Ensure max 50 claps per user
        if (result.count > 50) {
            result.count = 50;
            await result.save();
        }

        // Update denormalized total_claps on Post atomically (no aggregation needed)
        await Post.findByIdAndUpdate(postId, {
            $inc: { total_claps: clapCount }
        });

        // Get updated totals from denormalized field
        const post = await Post.findById(postId).select('total_claps');
        const totalClaps = post?.total_claps || 0;

        res.status(200).json({
            userClaps: result.count,
            totalClaps
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

        // Read denormalized count from Post for performance
        const post = await Post.findById(postId).select('total_claps');
        const totalClaps = post?.total_claps || 0;

        // Get user's claps if authenticated
        let userClaps = 0;
        if (userId) {
            const userClap = await Clap.findOne({ user_id: userId, post_id: postId });
            userClaps = userClap?.count || 0;
        }

        res.status(200).json({
            totalClaps,
            userClaps
        });
    } catch (error: any) {
        logger.error('Get clap stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
