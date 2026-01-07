import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/notifications');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.patch('/notifications/read-all');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount -= 1;
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export default notificationSlice.reducer;