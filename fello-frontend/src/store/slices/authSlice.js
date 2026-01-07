import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            console.log('✅ Register response:', data);
            return data.data.user;
        } catch (error) {
            console.error('❌ Register error:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            console.log('✅ Login response:', data);
            return data.data.user;
        } catch (error) {
            console.error('❌ Login error:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            console.log('✅ Logout successful');
        } catch (error) {
            console.error('❌ Logout error:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth/me');
            console.log('✅ Current user fetched:', data.data.user.username);
            return data.data.user;
        } catch (error) {
            console.log('❌ Get current user failed:', error.response?.status);
            return rejectWithValue(error.response?.data?.message || 'Failed to get user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                console.log('✅ Redux: User registered');
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log('✅ Redux: User logged in');
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                console.log('✅ Redux: User logged out');
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                console.log('✅ Redux: Current user set');
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                console.log('❌ Redux: Auth check failed');
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;