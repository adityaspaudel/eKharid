import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, title, price, quantity }
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.totalAmount += item.price;
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        state.totalAmount -= item.price * item.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        state.totalAmount += item.price;
      }
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount -= item.price;
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
