import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // each item: { _id, title, price, quantity, ...otherProps }
  totalAmount: 0,
};

const safeNumber = (val) => {
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const id = payload?._id ?? payload?.id;
      if (!id) return;

      const price = safeNumber(payload.price);
      const idx = state.items.findIndex((i) => i._id === id);

      if (idx >= 0) {
        state.items[idx].quantity += 1;
      } else {
        // store a minimal item copy to prevent accidentally storing huge objects,
        // but preserve useful fields (you can add/remove fields as needed)
        state.items.push({
          _id: id,
          title: payload.title ?? "",
          price: price,
          quantity: 1,
        });
      }

      state.totalAmount = safeNumber(state.totalAmount) + price;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      if (!id) return;

      const idx = state.items.findIndex((i) => i._id === id);
      if (idx === -1) return;

      const item = state.items[idx];
      state.totalAmount =
        safeNumber(state.totalAmount) - safeNumber(item.price) * item.quantity;
      // remove item
      state.items.splice(idx, 1);
    },

    increaseQuantity: (state, action) => {
      // expects id as payload
      const id = action.payload;
      if (!id) return;

      const idx = state.items.findIndex((i) => i._id === id);
      if (idx === -1) return;

      const item = state.items[idx];
      item.quantity += 1;
      state.totalAmount =
        safeNumber(state.totalAmount) + safeNumber(item.price);
    },

    decreaseQuantity: (state, action) => {
      // expects id as payload
      const id = action.payload;
      if (!id) return;

      const idx = state.items.findIndex((i) => i._id === id);
      if (idx === -1) return;

      const item = state.items[idx];
      if (item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount =
          safeNumber(state.totalAmount) - safeNumber(item.price);
      } else {
        // if it was 1, remove it
        state.totalAmount =
          safeNumber(state.totalAmount) - safeNumber(item.price);
        state.items.splice(idx, 1);
      }
    },

    // Optional helper to clear cart (handy in testing)
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
