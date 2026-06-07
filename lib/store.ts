/**
 * store.ts
 *
 * Configures the Redux store with all slices and the RTK Query middleware.
 * The RTK Query middleware handles caching, invalidation, and polling.
 */

import { configureStore } from '@reduxjs/toolkit';
import { dummyJsonApi } from '@/features/api/dummyJsonApi';
import authReducer from '@/features/auth/authSlice';
import filterReducer from '@/features/filter/filterSlice';

export const store = configureStore({
  reducer: {
    // Auth state
    auth: authReducer,

    // Filter / search state
    filter: filterReducer,

    // RTK Query API reducer (manages cache, loading, error states)
    [dummyJsonApi.reducerPath]: dummyJsonApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // RTK Query requires its own middleware for caching, invalidation, polling, etc.
      .concat(dummyJsonApi.middleware),
});

// Infer types from the store itself for maximum type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
