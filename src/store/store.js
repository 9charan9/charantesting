import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

// Custom middleware example - logger
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching action:', action.type);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Custom middleware example - error handler
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Caught an exception!', error);
    // You could dispatch an error action here
    throw error;
  }
};

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loggerMiddleware)
      .concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production', // DevTools enabled in development
});

export default store;