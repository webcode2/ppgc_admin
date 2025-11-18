// export const API_SERVER_BASE_URL = `https://ppgc-fastapi-latest.onrender.com`
export const API_SERVER_BASE_URL: string = `http://localhost:8000`



export const uiRoute = {
    "home": { name: "Home", route: "/" },

    // __________________________AUTH________________________________
    "login": { name: "Login", route: "/auth/login", pattern: "login" },
    "register": { name: "Register", route: "/auth/register", pattern: "register" },
    "resetPassword": { name: "Reset Password", route: "/auth/forget-password", pattern: "forget-password" },
    "verifyEmail": { name: "Verify Email", route: "/verify-email", pattern: "verify-email" },
    "authSuccess": { name: "Registration Success", route: "/auth/registration-succes", pattern: "registration-succes" },
    // ____________________________________BOOKINGS_______________________________

    "bookings": { name: "Bookings", route: "/bookings", pattern: "bookings" },
    "newBooking": { name: "New Booking", route: (room_id: string | number, hotel_id: string | number | null) => `/bookings/${hotel_id}/${room_id}/new-booking`, pattern: "bookings/:hotel_id/:room_id/new-booking" },

    // ___________________________________________________________________________
    //      _____________________________HOTELS___________________________
    // ___________________________________________________________________________
    // Hotel routes: Use template functions for dynamic path generation
    "hotels": { name: "Hotels", route: "/hotels" },

    /**
     * Generates the route path for a specific hotel's details page.
     * @param id The ID of the hotel.
     */
    "hotelDetails": { name: "Hotel Details", pattern: "hotels/:hotel_id", route: (id: string | number) => `/hotels/${id}` },



    /**
     * Generates the route path for a specific hotel's rooms management page.
     * @param id The ID of the hotel.
     */
    "hotelRooms": { name: "Hotel Rooms", pattern: "hotels/:hotel_id/rooms/all", route: (id: string | number) => `/hotels/${id}/rooms/all` },


    /**
     * @param id The ID of the hotel.
     */
    "createHotelRooms": { name: "Create Hotel Rooms", pattern: "hotels/:hotel_id/rooms/create", route: (id: string | number) => `/hotels/${id}/rooms/create` },


    /**
     * @param room_id The ID of the room.
     */
    "updateHotelRoom": {
        name: "Update Hotel Room", pattern: "hotels/:hotel_id/rooms/update", route: (room_id: string | number) => `/hotels/${room_id}/rooms/update`
    },



    /**
     * Generates the route path for a specific hotel's bookings page.
     * @param id The ID of the hotel.
     */
    "hotelBookings": {
        name: "Hotel Bookings",
        pattern: "/hotels/:id/bookings",
        route: (id: string | number) => `/hotels/${id}/bookings`
    },


    // _____________________________PROPERTIES____________________________

    "getPropertiesOverview": { name: "Properties Overview", route: "/properties", pattern: "properties/" },
    "getProperties": { name: "All Properties ", route: "/properties/all/", pattern: "properties/all/" },
    "newProperty": { name: "New Property", route: "/properties/new-property", pattern: "properties/new-property" },
    "propertyDetails": { name: "Property Details", route: (property_id: string | number) => `/properties/${property_id}/detail`, pattern: "properties/:property_id/detail" },
    "editProperty": { name: "Edit Property", route: (property_id: string | number) => `/properties/${property_id}/edit`, pattern: "properties/:property_id/edit" },



}









export const apiRoute = {
    // --- POST_Auth routes (Static) ---
    authLogin: { name: "login", route: `${API_SERVER_BASE_URL}/auth/login` },
    authRegister: { name: "register", route: `${API_SERVER_BASE_URL}/auth/register` },
    requestEmailVerificationCode: { name: "requestEmailVerificationCode", route: `${API_SERVER_BASE_URL}/auth/request-email-verification-code` },
    confirmEmailVerificationCode: { name: "confirmEmailVerificationCode", route: `${API_SERVER_BASE_URL}/auth/confirm-email-verification-code` },
    passeordResetRequest: { name: "passswordResetRequest", route: `${API_SERVER_BASE_URL}/auth/send-password-reset-mail` },
    passwordReset_PinResetConfirm: { name: "passwordReset_PinResetConfirm", route: `${API_SERVER_BASE_URL}/auth/change-pin-or-password` },

    // --- Hotels routes (Dynamic) ---
    createHotel: {
        name: "createHotel",
        route: `${API_SERVER_BASE_URL}/hotels/`
    },
    getHotels: {
        name: "getHotels",
        route: `${API_SERVER_BASE_URL}/hotels/`
    },

    /**
     * Generates the API path for updating a specific hotel.
     * @param id The ID of the hotel.
     */
    updateHotel: {
        name: "updateHotel",
        pattern: "hotels/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/hotels/${id}`
    },

    /**
     * Generates the API path for fetching a specific hotel.
     * @param id The ID of the hotel.
     */
    getHotel: {
        name: "getHotel",
        pattern: "hotels/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/hotels/${id}`
    },

    /**
     * Generates the API path for deleting a specific hotel.
     * @param id The ID of the hotel.
     */
    deleteHotel: {
        name: "deleteHotel",
        pattern: "hotels/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/hotels/${id}`
    },

    // --- Hotel Rooms routes (Dynamic) ---

    createRoom: {
        name: "createRoom",
        route: `${API_SERVER_BASE_URL}/rooms/`
    },
    getRooms: {
        name: "getRooms",
        route: `${API_SERVER_BASE_URL}/rooms/`
    },

    /**
     * Generates the API path for updating a specific room.
     * @param id The ID of the room.
     */
    updateRoom: {
        name: "updateRoom",
        pattern: "rooms/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/rooms/${id}`
    },

    /**
     * Generates the API path for fetching a specific room.
     * @param id The ID of the room.
     */
    getRoom: {
        name: "getRoom",
        pattern: "rooms/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/rooms/${id}`
    },

    /**
     * Generates the API path for deleting a specific room.
     * @param id The ID of the room.
     */
    deleteRoom: {
        name: "deleteRoom",
        pattern: "rooms/:id",
        route: (id: string | number) => `${API_SERVER_BASE_URL}/rooms/${id}`
    },



    //________________________________________________________________
    //________________________________BOOKING________________________


    "bookings": { name: "get all bookings", pattern: "/bookings/all/", route: "/bookings/all/" },
    "createBookings": { name: "create booking", pattern: "/bookings/", route: "/bookings/" },
};
