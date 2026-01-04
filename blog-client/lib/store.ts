import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import categoriesReducer from './slices/categoriesSlice';
import newsletterReducer from './slices/newsletterSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postsReducer,
        categories: categoriesReducer,
        newsletter: newsletterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
