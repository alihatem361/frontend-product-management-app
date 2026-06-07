/**
 * authSlice.ts
 *
 * Redux slice for authentication state.
 * Stores the user profile and JWT token in memory.
 * The token is *also* persisted in a cookie via tokenStorage.ts
 * so it survives page refreshes and is readable by Next.js middleware.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';
import { setToken, removeToken, getToken } from '@/utils/tokenStorage';

const initialState: AuthState = {
  user: null,
  // Rehydrate token from cookie on slice init (handles page refresh)
  token: typeof window !== 'undefined' ? (getToken() ?? null) : null,
  isAuthenticated: typeof window !== 'undefined' ? Boolean(getToken()) : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after a successful login or registration response.
     * Saves the user profile + token to Redux and persists the token in a cookie.
     */
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
      const { token, refreshToken, ...userProfile } = action.payload;
      state.user = userProfile;
      state.token = token;
      state.isAuthenticated = true;
      // Persist token in cookie for middleware route protection
      setToken(token);
    },

    /**
     * Called on logout.
     * Clears Redux state and removes the cookie.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeToken();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
