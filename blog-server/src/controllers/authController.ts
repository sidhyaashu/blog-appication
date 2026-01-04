import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { body, validationResult } from 'express-validator';

const generateToken = (id: string, role: string = 'user') => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const validateAuthInput = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as any).toString(), user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password || ''))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as any).toString(), user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('GOOGLE_CLIENT_ID is not defined');
        return res.status(500).json({ message: 'Server error: Google client ID not configured' });
    }
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) return res.status(400).json({ message: 'Invalid token' });

        const { email, name, sub: googleId, email_verified } = payload;

        // Security: Verify email is confirmed by Google
        if (!email_verified) {
            return res.status(403).json({ message: 'Google email not verified' });
        }

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but no googleId (legacy email user), update it? 
            // Or just login. For now, just login.
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                password: '', // No password for Google users
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken((user._id as any).toString(), user.role),
        });
    } catch (error) {
        res.status(400).json({ message: 'Google Auth Failed' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio || user.bio;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                token: generateToken((updatedUser._id as any).toString(), updatedUser.role),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
