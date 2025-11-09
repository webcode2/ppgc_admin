import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './App.js';
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

const container = document.getElementById('root');

// Safely handle potential null container error
if (!container) {
  throw new Error("Failed to find the root element with ID 'root' in the DOM.");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);  
