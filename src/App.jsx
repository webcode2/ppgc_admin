
import "./index.css";
import {
  createBrowserRouter,
} from "react-router";
import Home from "./pages/Home";
import { ProtctedScreens } from "./pages/layouts/ProtectedLayout";
import DefaultScreen from "./pages/layouts/DefaultScreen";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/foget_newpost";
import DashBoardIndex from "./pages/dashBoardIndex";
import ErrorPage from "./pages/error";
import Dashboard from "./pages/layouts/dashboard";
import Booking from "./pages/Booking";
import PropertyScreen from "./pages/PropertyScreen";



let router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultScreen,
    children: [

      // Main App
      { index: true, Component: Home },
      {
        path: "dashboard/", Component: Dashboard,
        children: [
          { index: true, Component: DashBoardIndex },
          { path: "bookings", Component: Booking },
          { path: "properties", Component: PropertyScreen },

        ]
      },
      // Authentication ROute

      {
        path: "auth/", Component: DefaultScreen,
        children: [
          { index: true, path: "login", Component: Login },
          { path: "register", Component: Register },
          { path: "forget-password", Component: ResetPassword },
        ],
      },

      { path: "*", Component: ErrorPage }
    ]
  },


]);

export default router;
