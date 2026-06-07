/**
 * filterSlice.ts
 *
 * Redux slice for product search and category filtering.
 * This state persists across navigation so that returning to the
 * product list from a detail page restores the previous filter context.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FilterState } from '@/types';

const initialState: FilterState = {
  searchQuery: '',
  selectedCategory: null,
  page: 0,       // zero-indexed page (0 = first page)
  limit: 20,     // products per page
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /** Update search query and reset pagination */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.selectedCategory = null; // Clear category when searching
      state.page = 0;
    },

    /** Set active category and reset pagination */
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.searchQuery = '';  // Clear search when filtering by category
      state.page = 0;
    },

    /** Increment page for pagination / load-more */
    incrementPage: (state) => {
      state.page += 1;
    },

    /** Reset page to 0 (e.g., on fresh navigation) */
    resetPage: (state) => {
      state.page = 0;
    },

    /** Reset all filters to initial state */
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.page = 0;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  incrementPage,
  resetPage,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
