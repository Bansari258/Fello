import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '../api/authAPI';

const initialState = {
    user: null,
    post: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);
export const createPost = createAsyncThunk(
    'auth',
    async (postData, { rejectWithValue }) => {
        try {
            const response = await authAPI.createPost(postData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'post failed');
        }
    }
);


export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authAPI.getCurrentUser();
            return user;
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                try {
                    // try to refresh access token using httpOnly cookie
                    await authAPI.refreshToken();
                    const user = await authAPI.getCurrentUser();
                    return user;
                } catch (err2) {
                    return rejectWithValue(err2.response?.data?.message || 'Failed to refresh token');
                }
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                // mark this browser as logged in so app won't make unnecessary checks on startup
                try { localStorage.setItem('fello_logged_in', '1'); } catch (e) { }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload.postData
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                try { localStorage.setItem('fello_logged_in', '1'); } catch (e) { }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                try { localStorage.removeItem('fello_logged_in'); } catch (e) { }
                // Cookies are cleared by backend
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
