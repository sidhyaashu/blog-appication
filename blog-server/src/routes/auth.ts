import express from 'express';
import { registerUser, loginUser, googleAuth, validateAuthInput } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

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

export default router;
