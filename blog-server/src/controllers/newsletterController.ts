import type { Request, Response } from 'express';
import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newSubscription = await Newsletter.create({ email });
        res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
    } catch (error: any) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
