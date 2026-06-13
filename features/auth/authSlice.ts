/**
 * authSlice.ts
 *
 * Redux slice for authentication state.
 * Stores the user profile and JWT token in memory.
 * The token is *also* persisted in a cookie via tokenStorage.ts
 * so it survives page refreshes and is readable by Next.js middleware.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types";
import { setToken, removeToken, getToken } from "@/utils/tokenStorage";
import { jwtDecode } from "jwt-decode"; // added for token expiration handling (optional enhancement)

// Initialize auth state with token from cookie (if present) to handle page refreshes.
const tokenFromCookie = typeof window !== "undefined" ? getToken() : null;
let userFromToken = null;
if (tokenFromCookie) {
  try {
    userFromToken = jwtDecode<User>(tokenFromCookie);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
  }
}

const initialState: AuthState = {
  user: userFromToken,
  // Rehydrate token from cookie on slice init (handles page refresh)
  token: tokenFromCookie || null,
  isAuthenticated: !!tokenFromCookie,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Called after a successful login or registration response.
     * Saves the user profile + token to Redux and persists the token in a cookie.
     */
    setCredentials: (state, action: PayloadAction<User>) => {
      const { refreshToken, ...userProfile } = action.payload;
      const accessToken = userProfile.accessToken || userProfile.token; // Support both token and accessToken fields

      if (!accessToken) {
        console.warn("No access token found in setCredentials payload");
        return;
      }
      state.user = userProfile;
      state.token = accessToken;
      state.isAuthenticated = true;
      // Persist token in cookie for middleware route protection
      setToken(accessToken);
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
