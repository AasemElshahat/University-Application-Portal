import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import API_BASE_URL from "../../config/api";

// --- 1. DEFINE TYPES ---
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean; // New: to show the spinner
  error: string | null; // New: to show alert messages
}

// Arguments we pass TO the thunk
interface LoginArgs {
  userID: string;
  password: string;
}

// What the thunk returns ON SUCCESS
interface LoginResponse {
  user: User;
  token: string;
}

// --- 2. INITIAL STATE ---
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// --- 3. THE THUNK (The "Waiter") ---
// This handles the dirty work of talking to the server
export const loginAsync = createAsyncThunk<
  LoginResponse, // Return type (Fulfilled)
  LoginArgs, // Argument type (What we pass in)
  { rejectValue: string } // Error type (What we pass to rejectWithValue)
>(
  "auth/loginAsync", // The name Redux uses internally
  async (credentials, { rejectWithValue }) => {
    try {
      // A. Create the Basic Auth Header
      const authHeader =
        "Basic " + window.btoa(credentials.userID + ":" + credentials.password);

      // B. Fetch the Token
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: "GET",
        headers: { Authorization: authHeader },
      });

      // Handle HTTP Errors (401, 500, etc.)
      if (!response.ok) {
        if (response.status === 401)
          return rejectWithValue("Invalid Credentials.");
        return rejectWithValue("Login failed with status: " + response.status);
      }

      // C. Extract Token
      const tokenHeader = response.headers.get("Authorization");
      const token = tokenHeader ? tokenHeader.split(" ")[1] : null;
      if (!token) return rejectWithValue("No token received from server!");

      // D. Decode Token to get UserID for the next step
      // (JWTs are "header.payload.signature". We want the payload in the middle)
      const payloadBase64 = token.split(".")[1];
      const payloadString = window.atob(payloadBase64);
      const tokenData = JSON.parse(payloadString);

      // E. Fetch User Details (Milestone 1 requirement: get firstName/lastName)
      const userResponse = await fetch(
        `${API_BASE_URL}/users/${tokenData.userID}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );

      // If we can't get details, we just use the ID.
      // If we can, we use the real name.
      const userDetails = userResponse.ok ? await userResponse.json() : {};

      // F. Return the "Package" (This goes to the .fulfilled case)
      return {
        user: {
          userID: tokenData.userID,
          firstName: userDetails.firstName || "",
          lastName: userDetails.lastName || "",
          isAdministrator: tokenData.isAdministrator,
        },
        token: token,
      };
    } catch (error) {
      // Handle Network Errors (Server down, no internet)
      return rejectWithValue("Network error. Is the backend running?");
    }
  }
);

// --- 4. THE SLICE (The State Manager) ---
export const authSlice = createSlice({
  name: "auth",
  initialState,

  // STANDARD REDUCERS (Synchronous stuff)
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },

  // EXTRA REDUCERS (Listening to the Thunk)
  extraReducers: (builder) => {
    builder
      // 1. PENDING: The waiter left. Show spinner.
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 2. FULFILLED: The waiter returned with food. Save it.
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // 3. REJECTED: The waiter returned with an error note. Show it.
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        // The 'action.payload' here is the string we passed to rejectWithValue
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setAuthError } = authSlice.actions;
export default authSlice.reducer;
