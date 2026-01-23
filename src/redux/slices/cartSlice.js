import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    byTable: {}, // cartKey → items[]
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const { cartKey } = item;

      if (!state.byTable[cartKey]) {
        state.byTable[cartKey] = [];
      }

      const cart = state.byTable[cartKey];

      const existingItem = cart.find(
        (i) => i._id === item._id && i.portion === item.portion,
      );

      if (existingItem) {
        existingItem.qty += item.qty;
        existingItem.total = existingItem.qty * existingItem.unitPrice;
      } else {
        cart.push({
          ...item,
          total: item.qty * item.unitPrice,
        });
      }
    },

    increaseQty: (state, action) => {
      const { cartKey, cartId } = action.payload;
      const item = state.byTable[cartKey]?.find((i) => i.cartId === cartId);
      if (item) {
        item.qty += 1;
        item.total = item.qty * item.unitPrice;
      }
    },

    decreaseQty: (state, action) => {
      const { cartKey, cartId } = action.payload;
      const item = state.byTable[cartKey]?.find((i) => i.cartId === cartId);
      if (item && item.qty > 1) {
        item.qty -= 1;
        item.total = item.qty * item.unitPrice;
      }
    },

    clearCart: (state, action) => {
      delete state.byTable[action.payload]; // cartKey
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
