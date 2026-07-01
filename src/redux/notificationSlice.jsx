import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => {
      return action.payload;
    },
    addNotification: (state, action) => {
      // Avoid duplicate notifications by checking _id
      const exists = state.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.push(action.payload);
      }
    },
  },
});

export const { setNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;