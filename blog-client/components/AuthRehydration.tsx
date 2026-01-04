'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';

/**
 * AuthRehydration component
 * Rehydrates auth state from localStorage on client mount
 * Prevents SSR hydration errors by loading after initial render
 * Also handles localStorage sync for both login and logout
 */
export default function AuthRehydration() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (storedToken && userStr) {
            try {
                const storedUser = JSON.parse(userStr);
                dispatch(setCredentials({ user: storedUser, token: storedToken }));
            } catch (error) {
                console.error('Failed to parse user from localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [dispatch]);

    // Sync state to localStorage (handle both login and logout)
    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user, token]);

    return null;
}
