import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: 'JWT secret not configured' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

            // Fetch user from database
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Attach user to request
            (req as any).user = user;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
};
