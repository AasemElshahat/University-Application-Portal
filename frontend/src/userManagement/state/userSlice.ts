import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { RootState } from "../../store/store";
import API_BASE_URL from "../../config/api";

interface CreateUpdateUserData {
  userID: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdministrator: boolean;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const loadUsers = createAsyncThunk(
  "users/loadUsers",
  async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return thunkAPI.rejectWithValue("Unauthorized");
        } else {
          return thunkAPI.rejectWithValue("Failed to load users");
        }
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userID: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userID}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to delete user");
      }

      return userID;
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: CreateUpdateUserData, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to create user");
      }

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

export const editUser = createAsyncThunk(
  "users/editUser",
  async (user: CreateUpdateUserData, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${user.userID}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to update user");
      }

      return response.json(); // ← Return the updated user data
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // loadUsers
      .addCase(loadUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(
          (user) => user.userID !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // createUser
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // editUser
      .addCase(editUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user.userID === action.payload.userID ? action.payload : user
        );
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
