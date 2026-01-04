import type { Request, Response } from 'express';
import Bookmark from '../models/Bookmark.js';
import Post from '../models/Post.js';
import logger from '../config/logger.js';

// Add bookmark
export const addBookmark = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const user = (req as any).user;
        const userId = user?._id || user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if already bookmarked
        const existing = await Bookmark.findOne({ user_id: userId, post_id: postId });
        if (existing) {
            return res.status(400).json({ message: 'Already bookmarked' });
        }

        const bookmark = await Bookmark.create({
            user_id: userId,
            post_id: postId
        });

        res.status(201).json({ message: 'Bookmark added', bookmark });
    } catch (error: any) {
        logger.error('Add bookmark error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove bookmark
export const removeBookmark = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const user = (req as any).user;
        const userId = user?._id || user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const bookmark = await Bookmark.findOneAndDelete({ user_id: userId, post_id: postId });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark removed' });
    } catch (error: any) {
        logger.error('Remove bookmark error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's bookmarks
export const getUserBookmarks = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const userId = user?._id || user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const bookmarks = await Bookmark.find({ user_id: userId })
            .populate('post_id')
            .sort({ created_at: -1 });

        res.status(200).json(bookmarks.map(b => b.post_id));
    } catch (error: any) {
        logger.error('Get bookmarks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check if post is bookmarked
export const checkBookmark = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const user = (req as any).user;
        const userId = user?._id || user?.id;

        if (!userId) {
            return res.status(200).json({ bookmarked: false });
        }

        const bookmark = await Bookmark.findOne({ user_id: userId, post_id: postId });

        res.status(200).json({ bookmarked: !!bookmark });
    } catch (error: any) {
        logger.error('Check bookmark error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
