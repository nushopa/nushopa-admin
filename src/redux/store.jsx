import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userSlice from "./user";
import notificationSlice from "./notificationSlice"; // Import notification slice
import { adminApi } from "../services/api";
import { cloudinaryApi } from "../services/cloudinary";

// Root reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
  notifications: notificationSlice, // Add notification slice here
  [adminApi.reducerPath]: adminApi.reducer,
  [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
});

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage: storage,
  // You can add other configuration options here if needed
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      adminApi.middleware,
      cloudinaryApi.middleware
    ),
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
