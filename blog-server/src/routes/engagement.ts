import express from 'express';
import { clapPost, getClapStats } from '../controllers/clapController.js';
import { addBookmark, removeBookmark, getUserBookmarks, checkBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Claps
router.post('/posts/:id/clap', protect, clapPost);
router.get('/posts/:id/claps', getClapStats);

// Bookmarks
router.post('/posts/:id/bookmark', protect, addBookmark);
router.delete('/posts/:id/bookmark', protect, removeBookmark);
router.get('/bookmarks', protect, getUserBookmarks);
router.get('/posts/:id/bookmark/check', protect, checkBookmark);

export default router;
