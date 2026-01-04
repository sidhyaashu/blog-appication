import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../api';

interface NewsletterState {
    email: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NewsletterState = {
    email: '',
    status: 'idle',
    error: null,
};

// Async Thunk
export const subscribeNewsletter = createAsyncThunk(
    'newsletter/subscribe',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || 'Subscription failed');
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to subscribe');
        }
    }
);

const newsletterSlice = createSlice({
    name: 'newsletter',
    initialState,
    reducers: {
        clearStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(subscribeNewsletter.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(subscribeNewsletter.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.email = '';
        });
        builder.addCase(subscribeNewsletter.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });
    },
});

export const { clearStatus } = newsletterSlice.actions;
export default newsletterSlice.reducer;
