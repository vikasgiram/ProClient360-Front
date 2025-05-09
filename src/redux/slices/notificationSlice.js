import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        markAsSeen: (state, action) => {
            state.notifications = state.notifications.map((notif) =>
                notif._id === action.payload ? { ...notif, isSeen: true } : notif
            );
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter((notif) => notif._id !== action.payload);
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { setNotifications, markAsSeen, removeNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
