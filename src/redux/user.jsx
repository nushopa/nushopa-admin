import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    addUser: (state, { payload }) => {
      return { ...state, isLoggedIn: true, user: payload };
    },

    // New action for creating a user
    createUser: (state, { payload }) => {
      // Add logic to handle creating a new user in the state
      return { ...state, isLoggedIn: true, user: payload };
    },
    clearUser: (state) => {
      // Add logic to clear user-related data when logging out
      return { ...state, isLoggedIn: false, user: null };
    },

  },
});

export const { addUser, createUser, clearUser } = userSlice.actions;
export default userSlice;
