import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const searchUsers = createAsyncThunk(
    'users/search',
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/search?q=${query}`);
            return data.data.users;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getSuggestedUsers = createAsyncThunk(
    'users/suggested',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/suggested?limit=5');
            return data.data.users;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getUserProfile = createAsyncThunk(
    'users/getProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/${userId}`);
            return data.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const { data } = await api.patch('/users/me', profileData);
            return data.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const followUser = createAsyncThunk(
    'users/follow',
    async (userId, { rejectWithValue }) => {
        try {
            await api.post(`/follow/${userId}`);
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const unfollowUser = createAsyncThunk(
    'users/unfollow',
    async (userId, { rejectWithValue }) => {
        try {
            await api.delete(`/follow/${userId}`);
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        searchResults: [],
        suggestedUsers: [],
        currentProfile: null,
        loading: false,
        error: null
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchResults = action.payload;
            })
            .addCase(getSuggestedUsers.fulfilled, (state, action) => {
                state.suggestedUsers = action.payload;
            })
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProfile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;