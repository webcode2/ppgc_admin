import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slice/authSlice"
import themeReducer from "./slice/themeSlice";


export const CHAT_SERVER_URL = "http://localhost:4000"



export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer
    },
});
