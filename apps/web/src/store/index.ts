import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './slices/leadsSlice';
import authReducer from './slices/authSlice';
// Import other slices as they are created

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    auth: authReducer,
    // Add other reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;