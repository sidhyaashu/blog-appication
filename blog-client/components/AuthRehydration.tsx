'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/slices/authSlice';

/**
 * AuthRehydration component
 * Rehydrates auth state from localStorage on client mount
 * Prevents SSR hydration errors by loading after initial render
 */
export default function AuthRehydration() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Only runs on client after mount
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                dispatch(setCredentials({ user, token }));
            } catch (error) {
                console.error('Failed to parse user from localStorage:', error);
                // Clean up invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [dispatch]);

    return null;
}
