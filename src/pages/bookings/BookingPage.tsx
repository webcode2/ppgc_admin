import React, { useEffect } from 'react';
import DashboardCard from "../../components/dashboardCard";
import FloatingAddButton from "../../components/AddFloatingButton";
import { useNavigate } from "react-router-dom";
// Assuming AvailableBookingTable is now the general Booking table component
import AvailableBookingTable from "../../components/booking/AvalableBooking";
import { uiRoute } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
// Assuming fetchBookings is imported from bookingSlice
import { fetchBookings } from "../../store/slice/bookingSlice";


function Booking() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Assuming the Booking state slice is named 'booking' (lowercase)
    const data = useSelector((state: RootState) => state.booking.bookings);
    const isLoading = useSelector((state: RootState) => state.booking.isLoading);


    // Dispatch fetch bookings on component mount
    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);


    // Determine the route for adding a new booking, with a fallback
    const newBookingRoute = uiRoute.newBooking?.route || '/bookings/new-booking';


    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading booking data...</div>;
    }


    return (
        <div className="space-y-6 p-5">

            <DashboardCard
                title="All Bookings Overview"
                extraView={data.length > 5}
                viewAllAction={() => {
                    alert("Viewing all available bookings.")
                }}
            >
                {/* Display the table with a slice of data */}
                <AvailableBookingTable data={data.slice(0, 5)} />

            </DashboardCard>

            {/* <FloatingAddButton className="bg-transparent border-[#7f7a06] border rounded-full text-[#7f7a06] active:scale-95 transition-all"
                onClick={() => {
                    navigate(newBooking);
                }}
            /> */}
            <FloatingAddButton className="   bg-transparent border-[#7f7a06] border rounded-full text-[#7f7a06] active:scale-95 transition-all" onClick={() => {
                navigate("/bookings/new-booking")
            }} />

        </div>
    );
}

export default Booking;