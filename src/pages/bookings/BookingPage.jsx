import React from 'react'
import DashboardCard from "../../components/dashboardCard"
import AvailableBookingTable from "../../components/booking/AvalableBooking";
import { rooms } from "../../store/dummy";
import FloatingAddButton from "../../components/AddFloatingButton";
import { useNavigate } from "react-router-dom";
import BookingTable from "../../components/booking/bookingTable";


function Booking() {
    const navigate = useNavigate()
    const bookings = [
        {
            name: 'John Doe',
            roomNo: '203',
            checkIn: '2025-07-20',
            checkOut: '2025-07-25',
        },
        {
            name: 'Jane Smith',
            roomNo: '105',
            checkIn: '2025-07-22',
            checkOut: '2025-07-27',
        },
    ];





    return (<div className="space-y-6">
        <DashboardCard title="Room Bookings"
            extraView={bookings.length > 5}
            dropDownData={["This Week", "This Month", "Last six Month", "This Year"]} >

            <BookingTable data={bookings} />
        </DashboardCard>

        {/* Available Rooms */}

        <DashboardCard title="Available Bookings" extraView={rooms.length > 5} viewAllAction={() => { alert("veiw more available rooms") }}>
            < AvailableBookingTable data={rooms.slice(0, 4)} />

        </DashboardCard>
        <FloatingAddButton className="   bg-transparent border-[#7f7a06] border rounded-lg text-[#7f7a06] active:scale-95 transition-all" onClick={() => {
            navigate("/bookings/new-room")
        }} />

    </div>)
}

export default Booking