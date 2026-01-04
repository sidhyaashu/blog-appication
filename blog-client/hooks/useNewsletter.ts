import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { subscribeNewsletter, clearStatus } from '@/lib/slices/newsletterSlice';

export function useNewsletter() {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.newsletter);

    const subscribe = useCallback(
        async (email: string) => {
            const result = await dispatch(subscribeNewsletter(email));
            return result;
        },
        [dispatch]
    );

    const clear = useCallback(() => {
        dispatch(clearStatus());
    }, [dispatch]);

    return {
        status,
        error,
        isLoading: status === 'loading',
        isSuccess: status === 'succeeded',
        subscribe,
        clearStatus: clear,
    };
}
