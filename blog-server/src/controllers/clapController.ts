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
        const post = await Post.findById(postId).select('total_claps author_id');
        const totalClaps = post?.total_claps || 0;

        // Create Notification (only if it's a new clap session or significant milestone, but primarily just on interaction)
        // Since toggleClap can be called multiple times rapidly, we might want to debounce or check if a notif exists recently.
        // For simplicity: Notify if user is new clapper or hasn't clapped recently? 
        // Actually, cleaner approach: Just notify. But claps update existing doc.
        // Logic: If result was upserted (newly created), send notification.
        // Check `result` object from findOneAndUpdate with { rawResult: true } if enabled, or just check created_at vs updated_at?
        // Simpler: Just send notification, but maybe limit frequency?
        // Let's just trigger it. It's a "User clapped for your post".

        if (post && post.author_id.toString() !== userId.toString()) {
            try {
                const Notification = (await import('../models/Notification.js')).default;

                // Optional: Check if a 'clap' notification from this user for this post already exists and is unread?
                //To avoid spam, we can just update the timestamp of existing unread notification

                const existingNotif = await Notification.findOne({
                    recipient_id: post.author_id,
                    sender_id: userId,
                    type: 'clap',
                    post_id: postId,
                    read: false
                });

                if (existingNotif) {
                    existingNotif.created_at = new Date();
                    await existingNotif.save();
                } else {
                    await Notification.create({
                        recipient_id: post.author_id,
                        sender_id: userId,
                        type: 'clap',
                        post_id: postId
                    });
                }
            } catch (err) {
                console.error('Clap notification error', err);
            }
        }

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
