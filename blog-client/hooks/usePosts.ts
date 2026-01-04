import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchPosts, fetchFeaturedPosts, fetchPostBySlug, clearCurrentPost } from '@/lib/slices/postsSlice';

export function usePosts() {
    const dispatch = useAppDispatch();
    const { posts, featuredPosts, currentPost, status, error } = useAppSelector((state) => state.posts);

    const loadPosts = useCallback(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const loadFeaturedPosts = useCallback(() => {
        dispatch(fetchFeaturedPosts());
    }, [dispatch]);

    const loadPostBySlug = useCallback(
        (slug: string) => {
            dispatch(fetchPostBySlug(slug));
        },
        [dispatch]
    );

    const clearPost = useCallback(() => {
        dispatch(clearCurrentPost());
    }, [dispatch]);

    return {
        posts,
        featuredPosts,
        currentPost,
        status,
        error,
        isLoading: status === 'loading',
        loadPosts,
        loadFeaturedPosts,
        loadPostBySlug,
        clearPost,
    };
}
