import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { setAccessToken, clearAccessToken } from '../../api/tokenService';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  bootstrapped: false, // true once the initial silent-refresh check has run
  error: null,
  message: null,
};

// ---------- Thunks ----------

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(payload);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Registration failed.'));
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(payload);
    setAccessToken(data.data.accessToken);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Invalid email or password.'));
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    clearAccessToken();
    return true;
  } catch (error) {
    // Clear client-side state regardless of server response
    clearAccessToken();
    return rejectWithValue(getErrorMessage(error, 'Logout failed.'));
  }
});

/**
 * Runs once on app startup: attempts a silent refresh using the httpOnly
 * cookie, then fetches the current user if it succeeds. This is what
 * makes the login persist across page reloads without storing the
 * access token anywhere persistent.
 */
export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  try {
    const refreshRes = await authApi.refreshToken();
    setAccessToken(refreshRes.data.data.accessToken);
    const meRes = await authApi.getMe();
    return meRes.data.data.user;
  } catch (error) {
    clearAccessToken();
    return rejectWithValue(null);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.getMe();
    return data.data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load profile.'));
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, { rejectWithValue }) => {
  try {
    const { data } = await authApi.verifyEmail(token);
    return data.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Email verification failed.'));
  }
});

export const resendVerification = createAsyncThunk('auth/resendVerification', async (email, { rejectWithValue }) => {
  try {
    const { data } = await authApi.resendVerification(email);
    return data.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to resend verification email.'));
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await authApi.forgotPassword(email);
    return data.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to send reset link.'));
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.resetPassword(token, password);
      setAccessToken(data.data.accessToken);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to reset password.'));
    }
  }
);

// ---------- Slice ----------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })

      // Bootstrap / silent refresh
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // Verify email
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Resend verification
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, clearAuthMessage, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
