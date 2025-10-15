import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import counterReducer from './slices/counterSlice';
import cartReducer from './slices/cartSlice';

const persistConfig = { key: 'root', storage };

const combineReducer = combineReducers({
  counter: counterReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, combineReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [logger],
});

export const persistor = persistStore(store);
