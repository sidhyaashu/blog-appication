import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCategories as fetchCategoriesAPI, createCategory as createCategoryAPI, updateCategory as updateCategoryAPI, deleteCategory as deleteCategoryAPI } from '../api';
import { Category } from '../post';

interface CategoriesState {
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchCategoriesAPI();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async ({ name, token }: { name: string; token: string }, { rejectWithValue }) => {
        try {
            const response = await createCategoryAPI({ name }, token);
            if (!response) {
                return rejectWithValue('Failed to create category');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create category');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, name, token }: { id: string; name: string; token: string }, { rejectWithValue }) => {
        try {
            const response = await updateCategoryAPI(id, { name }, token);
            if (!response) {
                return rejectWithValue('Failed to update category');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
        try {
            await deleteCategoryAPI(id, token);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete category');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Categories
        builder.addCase(fetchCategories.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.categories = action.payload;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        // Create Category
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload);
        });

        // Update Category
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            const index = state.categories.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        });

        // Delete Category
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.categories = state.categories.filter((c) => c.id !== action.payload);
        });
    },
});

export default categoriesSlice.reducer;
