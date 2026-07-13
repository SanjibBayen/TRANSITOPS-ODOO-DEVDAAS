import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  is_read: boolean;
  link?: string;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (userId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/${userId}/notifications`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load notifications');
  }
});

export const markAsRead = createAsyncThunk('notifications/markRead', async ({ userId, notificationId }: { userId: string; notificationId: string }, { rejectWithValue }) => {
  try {
    await api.patch(`/users/${userId}/notifications/${notificationId}/read`);
    return notificationId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.is_read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload);
        if (notif) { notif.is_read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      });
  },
});

export default notificationSlice.reducer;