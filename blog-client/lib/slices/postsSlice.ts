import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getPosts, getFeaturedPosts, getPostBySlug } from '../api';
import { Post } from '../post';

interface PostsState {
    posts: Post[];
    featuredPosts: Post[];
    currentPost: Post | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    featuredPosts: [],
    currentPost: null,
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
    try {
        const response = await getPosts();
        return response;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch posts');
    }
});

export const fetchFeaturedPosts = createAsyncThunk('posts/fetchFeaturedPosts', async (_, { rejectWithValue }) => {
    try {
        const response = await getFeaturedPosts();
        return response;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch featured posts');
    }
});

export const fetchPostBySlug = createAsyncThunk(
    'posts/fetchPostBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await getPostBySlug(slug);
            if (!response) {
                return rejectWithValue('Post not found');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch post');
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearCurrentPost(state) {
            state.currentPost = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts
        builder.addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        });
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        // Fetch Featured Posts
        builder.addCase(fetchFeaturedPosts.pending, (state) => {
            // Might want separate status for featured if they load independently, but global status is fine for now
        });
        builder.addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
            state.featuredPosts = action.payload;
        });

        // Fetch Post by Slug
        builder.addCase(fetchPostBySlug.pending, (state) => {
            state.status = 'loading';
            state.currentPost = null;
        });
        builder.addCase(fetchPostBySlug.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentPost = action.payload;
        });
        builder.addCase(fetchPostBySlug.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
