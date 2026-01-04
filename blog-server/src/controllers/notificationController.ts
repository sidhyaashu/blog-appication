import type { Request, Response } from 'express';
import Notification from '../models/Notification.js';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient_id: user._id })
            .populate('sender_id', 'name avatar')
            .populate('post_id', 'title slug')
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(skip);

        // Filter out notifications where sender is null (deleted user) or post is null (deleted post) if strict consistency is desired, 
        // but often better to handle on frontend or use lean() and filter.

        const total = await Notification.countDocuments({ recipient_id: user._id });

        res.json({
            notifications,
            pagination: {
                page,
                limit,
                total,
                hasMore: skip + notifications.length < total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { id } = req.body; // If id provided, mark one. Else mark all.

        if (id) {
            await Notification.findByIdAndUpdate(id, { read: true });
        } else {
            await Notification.updateMany(
                { recipient_id: user._id, read: false },
                { read: true }
            );
        }

        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const count = await Notification.countDocuments({
            recipient_id: user._id,
            read: false
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
