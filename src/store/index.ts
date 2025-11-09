import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import propertyReducer from "./slice/propertySlice";
import hotelReducer from "./slice/hotelSlice";
import bookingRdeucer from "./slice/bookingSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    hotel: hotelReducer,
    booking: bookingRdeucer
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;