import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userSlice from "./user";
import notificationSlice from "./notificationSlice";
import { adminApi } from "../services/api";
import { cloudinaryApi } from "../services/cloudinary";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  notifications: notificationSlice,
  [adminApi.reducerPath]: adminApi.reducer,
  [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
});

// Persist only the small `user` slice (UI profile info, no token).
// API caches and notifications are not written to localStorage.
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      adminApi.middleware,
      cloudinaryApi.middleware
    ),
});

const persistor = persistStore(store);

export { store, persistor };