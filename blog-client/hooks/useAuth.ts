import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { login, signup, googleLogin, logout, clearError, updateUser } from '@/lib/slices/authSlice';
import { UserLogin, UserRegister } from '@/lib/post';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, token, status, error } = useAppSelector((state) => state.auth);

    const handleLogin = useCallback(
        async (credentials: UserLogin) => {
            const result = await dispatch(login(credentials));
            return result;
        },
        [dispatch]
    );

    const handleSignup = useCallback(
        async (userData: UserRegister) => {
            const result = await dispatch(signup(userData));
            return result;
        },
        [dispatch]
    );

    const handleGoogleLogin = useCallback(
        async (token: string) => {
            const result = await dispatch(googleLogin(token));
            return result;
        },
        [dispatch]
    );

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleUpdateUser = useCallback((userData: Partial<import('@/lib/post').User>) => {
        dispatch(updateUser(userData));
    }, [dispatch]);

    return {
        user,
        token,
        status,
        error,
        isAuthenticated: !!user && !!token,
        isLoading: status === 'loading',
        login: handleLogin,
        signup: handleSignup,
        googleLogin: handleGoogleLogin,
        logout: handleLogout,
        clearError: handleClearError,
        updateUser: handleUpdateUser,
    };
}
