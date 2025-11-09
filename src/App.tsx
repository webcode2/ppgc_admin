
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router";
import DefaultScreen from "./pages/layouts/DefaultScreen";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/foget_newpost";
import DashBoardIndex from "./pages/dashBoardIndex";
import ErrorPage from "./pages/error";
import { uiRoute } from "./utils/utils";
import TokenVerifyScreen from "./pages/auth/TokenScreen";
import TokenVerifyScreenSuccess from "./pages/auth/successScreen";
import Booking from "./pages/bookings/BookingPage";
import PropertyWizard from "./pages/proerties/newProperty";
import UpdatePropertyScreen from "./pages/proerties/updateProperty";
import InvestmentScreen from "./pages/investment/ListAllIvestment";
import ProfileForm from "./pages/profile/updateProfile";
import AccountSettings from "./pages/profile/AccountSettings";
import ProfileScreen from "./pages/profile/profile";
import NotificationUI from "./pages/notifications";
import NewHotel from "./pages/hotels/newHotel";
import Hotel from "./pages/hotels/hotelList";
import EditHotel from "./pages/hotels/updateHotel";
import NewRoom from "./pages/hotels/addHotelRoom";
import PropertyScreen from "./pages/proerties/PropertyScreen";
import { ProtectedScreen } from "./pages/layouts/ProtectedLayout";
import HotelReceptionPage from "./pages/hotels/signleHotel";
import NewBooking from "./pages/bookings/NewBooking";
import HotelRoomManagementPage from "./pages/hotels/rooms";
import RoomBookingPage from "./pages/bookings/roomBookingPage";






let router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedScreen />,
    // element: <Outlet />,
    children: [
      // Main App

      { index: true, Component: DashBoardIndex },


      //_____________________ Hotels______________________
      { path: "/hotels", Component: Hotel },
      { path: "hotels/new", Component: NewHotel },

      { path: uiRoute.hotelDetails.pattern, Component: HotelReceptionPage },
      { path: "hotels/:hotel_id/edit", Component: EditHotel },

      { path: uiRoute.createHotelRooms.pattern, Component: NewRoom },
      { path: uiRoute.updateHotelRoom.pattern, Component: NewRoom },
      { path: uiRoute.hotelRooms.pattern, Component: HotelRoomManagementPage },

      // Booking routes
      { path: uiRoute.bookings.pattern, Component: Booking },
      { path: uiRoute.newBooking.pattern, Component: RoomBookingPage },
      // { path: "bookings/new-room", Component: NewBooking },



      // properties
      { path: "properties", Component: PropertyScreen },
      { path: "properties/new-property", Component: PropertyWizard },
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
    path: "/auth/", Component: Outlet,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: uiRoute.login.pattern, Component: Login },
      { path: uiRoute.register.pattern, Component: Register },
      { path: uiRoute.resetPassword.pattern, Component: ResetPassword },


      { path: uiRoute.verifyEmail.pattern, Component: TokenVerifyScreen },
      { path: uiRoute.authSuccess.pattern, Component: TokenVerifyScreenSuccess },
    ],
  },
  // Page not found Error 
  { path: "*", Component: ErrorPage }


]);

export default router;
