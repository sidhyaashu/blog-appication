import express from 'express';
import { getNotifications, markAsRead, getUnreadCount } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read', markAsRead);
router.get('/unread-count', getUnreadCount);

export default router;
