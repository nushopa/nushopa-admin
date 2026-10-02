import { createSlice } from "@reduxjs/toolkit";

const toArray = (p) =>
  Array.isArray(p) ? p : p?.notifications ?? p?.data ?? [];

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => toArray(action.payload),
    addNotification: (state, action) => {
      if (!action.payload) return;
      const exists = state.some((n) => n._id === action.payload._id);
      if (!exists) state.push(action.payload);
    },
  },
});

export const { setNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;