import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/auth";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const token = await login(username, password);
    return token;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Ошибка авторизации";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
