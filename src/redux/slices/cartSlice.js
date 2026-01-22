import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    byTable: {}, // ✅ tableId → items[]
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const { tableId } = item;

      if (!state.byTable[tableId]) {
        state.byTable[tableId] = [];
      }

      const tableCart = state.byTable[tableId];

      const existingItem = tableCart.find(
        (i) => i._id === item._id && i.portion === item.portion,
      );

      if (existingItem) {
        existingItem.qty += item.qty;
        existingItem.total = existingItem.qty * existingItem.unitPrice;
      } else {
        tableCart.push({
          ...item,
          total: item.qty * item.unitPrice,
        });
      }
    },

    increaseQty: (state, action) => {
      const { tableId, cartId } = action.payload;
      const item = state.byTable[tableId]?.find((i) => i.cartId === cartId);
      if (item) {
        item.qty += 1;
        item.total = item.qty * item.unitPrice;
      }
    },

    decreaseQty: (state, action) => {
      const { tableId, cartId } = action.payload;
      const item = state.byTable[tableId]?.find((i) => i.cartId === cartId);
      if (item && item.qty > 1) {
        item.qty -= 1;
        item.total = item.qty * item.unitPrice;
      }
    },

    clearCart: (state, action) => {
      delete state.byTable[action.payload]; // ✅ clear only one table
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
