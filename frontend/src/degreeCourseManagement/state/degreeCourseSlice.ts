import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DegreeCourse, CreateUpdateDegreeCourseData } from "../../types/DegreeCourse";
import { RootState } from "../../store/store";
import API_BASE_URL from "../../config/api";

interface DegreeCourseState {
  degreeCourses: DegreeCourse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DegreeCourseState = {
  degreeCourses: [],
  isLoading: false,
  error: null,
};

/**
 * Load all degree courses
 */
export const loadDegreeCourses = createAsyncThunk(
  "degreeCourses/loadDegreeCourses",
  async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/degreeCourses`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return thunkAPI.rejectWithValue("Unauthorized");
        }
        return thunkAPI.rejectWithValue("Failed to load degree courses");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

/**
 * Delete a degree course by ID
 */
export const deleteDegreeCourse = createAsyncThunk(
  "degreeCourses/deleteDegreeCourse",
  async (degreeCourseId: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/degreeCourses/${degreeCourseId}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to delete degree course");
      }

      return degreeCourseId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

/**
 * Create a new degree course
 */
export const createDegreeCourse = createAsyncThunk(
  "degreeCourses/createDegreeCourse",
  async (degreeCourse: CreateUpdateDegreeCourseData, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/degreeCourses`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(degreeCourse),
      });

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to create degree course");
      }

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

/**
 * Update an existing degree course
 */
export const editDegreeCourse = createAsyncThunk(
  "degreeCourses/editDegreeCourse",
  async (
    data: { id: string; degreeCourse: CreateUpdateDegreeCourseData },
    thunkAPI
  ) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found!");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/degreeCourses/${data.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.degreeCourse),
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          return thunkAPI.rejectWithValue("Unauthorized");
        if (response.status === 403)
          return thunkAPI.rejectWithValue("Forbidden: You are not an admin");
        return thunkAPI.rejectWithValue("Failed to update degree course");
      }

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

export const degreeCourseSlice = createSlice({
  name: "degreeCourses",
  initialState,

  reducers: {
    clearDegreeCourseError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // loadDegreeCourses
      .addCase(loadDegreeCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDegreeCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.degreeCourses = action.payload;
      })
      .addCase(loadDegreeCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // deleteDegreeCourse
      .addCase(deleteDegreeCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDegreeCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.degreeCourses = state.degreeCourses.filter(
          (dc) => dc.id !== action.payload
        );
      })
      .addCase(deleteDegreeCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // createDegreeCourse
      .addCase(createDegreeCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDegreeCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.degreeCourses.push(action.payload);
      })
      .addCase(createDegreeCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // editDegreeCourse
      .addCase(editDegreeCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editDegreeCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.degreeCourses = state.degreeCourses.map((dc) =>
          dc.id === action.payload.id ? action.payload : dc
        );
      })
      .addCase(editDegreeCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDegreeCourseError } = degreeCourseSlice.actions;
export default degreeCourseSlice.reducer;
