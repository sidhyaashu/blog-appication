import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser as loginAPI, registerUser as registerAPI, googleAuth as googleAPI } from '../api';
import { User, UserLogin, UserRegister, AuthResponse } from '../post';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state is null to prevent SSR/client mismatch
// State will be rehydrated from localStorage on client mount
const initialState: AuthState = {
    user: null,
    token: null,
    status: 'idle',
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: UserLogin, { rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials);
            if (!response) {
                return rejectWithValue('Login failed');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData: UserRegister, { rejectWithValue }) => {
        try {
            const response = await registerAPI(userData);
            if (!response) {
                return rejectWithValue('Signup failed');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Signup failed');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await googleAPI(token);
            if (!response) {
                return rejectWithValue('Google login failed');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Google login failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    // Ideally call server logout if needed, but for JWT usually just client side
    return;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.status = 'succeeded';
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.status = 'succeeded';
            state.user = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                token: action.payload.token
            };
            state.token = action.payload.token;
            // localStorage sync is handled by AuthRehydration component
        });
        builder.addCase(login.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        // Signup
        builder.addCase(signup.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.status = 'succeeded';
            state.user = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                token: action.payload.token
            };
            state.token = action.payload.token;
            // localStorage sync is handled by AuthRehydration component
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        // Google
        builder.addCase(googleLogin.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(googleLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.status = 'succeeded';
            state.user = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                token: action.payload.token
            };
            state.token = action.payload.token;
            // localStorage sync is handled by AuthRehydration component
        });
        builder.addCase(googleLogin.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            // localStorage cleanup happens in component/middleware
        });
    },
});

export const { clearError, setCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;
