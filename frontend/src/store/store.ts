import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/state/authSlice";
import userReducer from "../userManagement/state/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
});

// These types help TypeScript understand our Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
