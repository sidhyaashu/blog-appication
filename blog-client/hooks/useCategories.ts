import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/slices/categoriesSlice';

export function useCategories() {
    const dispatch = useAppDispatch();
    const { categories, status, error } = useAppSelector((state) => state.categories);

    const loadCategories = useCallback(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const addCategory = useCallback(
        (name: string, token: string) => {
            return dispatch(createCategory({ name, token }));
        },
        [dispatch]
    );

    const editCategory = useCallback(
        (id: string, name: string, token: string) => {
            return dispatch(updateCategory({ id, name, token }));
        },
        [dispatch]
    );

    const removeCategory = useCallback(
        (id: string, token: string) => {
            return dispatch(deleteCategory({ id, token }));
        },
        [dispatch]
    );

    return {
        categories,
        status,
        error,
        isLoading: status === 'loading',
        loadCategories,
        addCategory,
        editCategory,
        removeCategory,
    };
}
