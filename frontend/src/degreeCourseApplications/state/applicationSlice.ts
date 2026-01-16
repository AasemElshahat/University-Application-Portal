import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DegreeCourseApplication } from "../../types/DegreeCourseApplication";
import API_BASE_URL from "../../config/api";
import { RootState } from "../../store/store";

interface ApplicationState {
    applications: DegreeCourseApplication[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ApplicationState = {
    applications: [],
    isLoading: false,
    error: null,
};

// Endpoint: /api/degreeCourseApplications
const ENDPOINT = `${API_BASE_URL}/degreeCourseApplications`;

export const loadApplications = createAsyncThunk(
    "applications/load",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const user = state.auth.user;

            if (!user) {
                throw new Error("User not authenticated");
            }

            // Determine correct endpoint based on role
            // Admin: GET / (All applications)
            // Student: GET /myApplications (Own applications)
            const url = user.isAdministrator 
                ? ENDPOINT
                : `${ENDPOINT}/myApplications`;

            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${state.auth.token || ""}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.Error || "Failed to load applications");
            }
            
            const data = await response.json();
            return data as DegreeCourseApplication[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createApplication = createAsyncThunk(
    "applications/create",
    async (application: Omit<DegreeCourseApplication, "id">, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${state.auth.token || ""}`
                },
                body: JSON.stringify(application),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.Error || "Failed to create application");
            }

            const data = await response.json();
            return data as DegreeCourseApplication;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteApplication = createAsyncThunk(
    "applications/delete",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const response = await fetch(`${ENDPOINT}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${state.auth.token || ""}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.Error || "Failed to delete application");
            }
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Load
        builder.addCase(loadApplications.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loadApplications.fulfilled, (state, action) => {
            state.isLoading = false;
            state.applications = action.payload;
        });
        builder.addCase(loadApplications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create
        builder.addCase(createApplication.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createApplication.fulfilled, (state, action) => {
            state.isLoading = false;
            state.applications.push(action.payload);
        });
        builder.addCase(createApplication.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Delete
        builder.addCase(deleteApplication.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteApplication.fulfilled, (state, action) => {
            state.isLoading = false;
            state.applications = state.applications.filter(app => app.id !== action.payload);
        });
        builder.addCase(deleteApplication.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
