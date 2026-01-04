import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser as loginAPI, registerUser as registerAPI, googleAuth as googleAPI } from '../api';
import { User, UserLogin, UserRegister, AuthResponse } from '../post';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Helper to get initial state from localStorage if available
const getUserFromStorage = (): User | null => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

const getTokenFromStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const initialState: AuthState = {
    user: getUserFromStorage(),
    token: getTokenFromStorage(),
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
            // Map AuthResponse to User type if they differ, or assert if compatible.
            // Assuming AuthResponse has user fields.
            // Adjust based on actual API response structure. 
            // Looking at `post.ts`, AuthResponse has _id, name, email, role, token.
            state.user = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                token: action.payload.token // User type in post.ts includes token
            };
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('token', state.token);
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
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('token', state.token);
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
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('token', state.token);
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
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
