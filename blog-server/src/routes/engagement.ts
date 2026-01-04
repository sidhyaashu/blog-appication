import express from 'express';
import { clapPost, getClapStats } from '../controllers/clapController.js';
import { addBookmark, removeBookmark, getUserBookmarks, checkBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Claps - apply write limiter to prevent spam
router.post('/posts/:id/clap', protect, writeLimiter, clapPost);
router.get('/posts/:id/claps', getClapStats);

// Bookmarks - apply write limiter
router.post('/posts/:id/bookmark', protect, writeLimiter, addBookmark);
router.delete('/posts/:id/bookmark', protect, writeLimiter, removeBookmark);
router.get('/bookmarks', protect, getUserBookmarks);
router.get('/posts/:id/bookmark/check', protect, checkBookmark);

export default router;
