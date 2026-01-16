import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/state/authSlice";
import userReducer from "../userManagement/state/userSlice";
import degreeCourseReducer from "../degreeCourseManagement/state/degreeCourseSlice";
import applicationReducer from "../degreeCourseApplications/state/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    degreeCourses: degreeCourseReducer,
    applications: applicationReducer,
  },
});

// These types help TypeScript understand our Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
