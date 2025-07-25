import React from 'react'
import DashboardCard from "../components/dashboardCard"
import BookingTable from "../components/bookingTable"
import InspectionBookingTable from "../components/inspectionBookingTable";

function Booking() {
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

    const inspectionData = [
        {
            name: 'Alice Johnson',
            property: 'Sunset Apartments - Unit 12B',
            inspectionDate: '2025-08-10',
            inspectionTime: '10:30 AM',
            callNumber: '+1 (555) 123-4567',
        },
        {
            name: 'Michael Smith',
            property: 'Riverside Villas - Unit 7C',
            inspectionDate: '2025-08-12',
            inspectionTime: '02:00 PM',
            callNumber: '+1 (555) 987-6543',
        },
        {
            name: 'Sara Williams',
            property: 'Greenview Condos - Unit 3A',
            inspectionDate: '2025-08-15',
            inspectionTime: '11:00 AM',
            callNumber: '+1 (555) 555-0199',
        },
        {
            name: 'David Brown',
            property: 'Oceanfront Suites - Penthouse',
            inspectionDate: '2025-08-18',
            inspectionTime: '09:00 AM',
            callNumber: '+1 (555) 222-3333',
        },
        {
            name: 'Emily Davis',
            property: 'Hilltop Residences - Unit 5D',
            inspectionDate: '2025-08-20',
            inspectionTime: '03:30 PM',
            callNumber: '+1 (555) 444-7788',
        },
        {
            name: 'John Miller',
            property: 'Maple Heights - Unit 8F',
            inspectionDate: '2025-08-21',
            inspectionTime: '01:15 PM',
            callNumber: '+1 (555) 666-1234',
        },
        {
            name: 'Olivia Taylor',
            property: 'Cityview Lofts - Unit 2E',
            inspectionDate: '2025-08-22',
            inspectionTime: '04:00 PM',
            callNumber: '+1 (555) 777-4321',
        },
        {
            name: 'James Anderson',
            property: 'Lakeside Homes - Unit 9G',
            inspectionDate: '2025-08-25',
            inspectionTime: '12:45 PM',
            callNumber: '+1 (555) 888-5678',
        },
    ];

    return (<div className="space-y-6">
        <DashboardCard title="Room Bookings">

            <BookingTable data={bookings} />
        </DashboardCard>

        <DashboardCard title="Inspection  Bookings">
            <InspectionBookingTable data={inspectionData} />

        </DashboardCard>
    </div>)
}

export default Booking