/**
 * cartSlice.ts
 *
 * Redux slice for cart state.
 * Stores the shopping cart items in memory.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartState, CartItem, User } from "@/types";

// cart initial state
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Add an item to the cart. If the item already exists, increment its quantity.
     * @param state - The current cart state.
     * @param action - The action payload containing the CartItem to add.
     */
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item: CartItem) => item.id === newItem.id,
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },

    /**
     * Remove an item from the cart by productId.
     * @param state - The current cart state.
     * @param action - The action payload containing the productId to remove.
     */

    removeItem: (state, action: PayloadAction<number>) => {
      const productIdToRemove = action.payload;
      state.items = state.items.filter(
        (item: CartItem) => item.id !== productIdToRemove,
      );
    },

    /** Clear the entire cart, resetting items, totalQuantity, and totalPrice to initial state.
     * @param state - The current cart state.
     */
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
