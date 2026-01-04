import express from 'express';
import { registerUser, loginUser, googleAuth, validateAuthInput, updateProfile } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply strict rate limiting to all auth routes
router.use(authLimiter);

router.post(
    '/signup',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ],
    validateAuthInput,
    registerUser
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validateAuthInput,
    loginUser
);

router.post('/google', googleAuth);
router.put('/profile', protect, updateProfile);

export default router;
