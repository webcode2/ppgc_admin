
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
import PropertyScreen from "./pages/proerties/PropertyScreen";
import { uiRoute } from "./utils";
import TokenVerifyScreen from "./pages/auth/TokenScreen";
import TokenVerifyScreenSuccess from "./pages/auth/successScreen";
import Booking from "./pages/bookings/BookingPage";
import NewBooking from "./components/booking/NewBooking";
import NewPropertyScreen from "./pages/proerties/newProperty";
import UpdatePropertyScreen from "./pages/proerties/updateProperty";
import InvestmentScreen from "./pages/investment/ListAllIvestment";
import ProfileForm from "./pages/profile/updateProfile";
import AccountSettings from "./pages/profile/AccountSettings";
import ProfileScreen from "./pages/profile/profile";
import NotificationUI from "./pages/notifications";






let router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultScreen,
    children: [

      // Main App
      {
        path: "/", Component: Dashboard,
        children: [
          { index: true, Component: DashBoardIndex },
          { path: "bookings", Component: Booking },
          { path: "bookings/new-room", Component: NewBooking },

          // properties
          { path: "properties", Component: PropertyScreen },
          { path: "properties/new-property", Component: NewPropertyScreen },
          { path: "properties/:property_id/edit", Component: UpdatePropertyScreen },


          // Invevstment
          { path: "investments/", Component: InvestmentScreen },

          // Profile
          { path: "profile", Component: ProfileScreen },
          { path: "profile/settings", Component: AccountSettings },
          { path: "profile/update", Component: ProfileForm },

          // Notification
          { path: "notifications", Component: NotificationUI },



        ]
      },
      // Authentication ROute

      {
        path: "auth/", Component: DefaultScreen,
        children: [
          { index: true, path: "login", Component: Login },
          { path: "register", Component: Register },
          { path: uiRoute.verifyEmail.route.trim(), Component: TokenVerifyScreen }, 
          { path: uiRoute.authSuccess.appRoute, Component: TokenVerifyScreenSuccess }, 
          { path: "forget-password", Component: ResetPassword },
        ],
      },

      { path: "*", Component: ErrorPage }
    ]
  },


]);

export default router;
