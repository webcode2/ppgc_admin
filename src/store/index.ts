import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import propertyReducer from "./slice/propertySlice";
import hotelReducer from "./slice/hotelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    hotel: hotelReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
