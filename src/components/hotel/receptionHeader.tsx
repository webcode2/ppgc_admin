import { useEffect, useState, useMemo } from "react";
import { Bed, DoorOpen, CalendarCheck } from "lucide-react";
import { ReadRoom } from "../../utils/types/hotelTypes"; // Assuming ReadRoom is the type for individual rooms

interface ReceptionHeaderProps {
    hotel_details: { name: string } | null; // Simplified type based on usage
    rooms: ReadRoom[]; // Array of room objects
}

export default function ReceptionHeader({ hotel_details, rooms }: ReceptionHeaderProps) {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate room statistics based on the passed 'rooms' array
    const { occupiedCount, availableCount, bookedCount } = useMemo(() => {
        const stats = {
            occupiedCount: 0,
            availableCount: 0,
            bookedCount: 0,
        };

        if (rooms && rooms.length > 0) {
            rooms.forEach(room => {
                const status = room.status?.toLowerCase();
                if (status === "occupied") {
                    stats.occupiedCount += 1;
                } else if (status === "available") {
                    stats.availableCount += 1;
                } else if (status === "booked") {
                    stats.bookedCount += 1;
                }
            });
        }
        return stats;
    }, [rooms]);

    const totalRooms = rooms.length;

    return (
        <div className="col-span-12 bg-white rounded-2xl shadow p-6 mb-4">
            {/* Title Section */}
            <div className="mb-4 flex justify-between items-start flex-col md:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome to {hotel_details?.name} Reception Desk
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage check-ins, check-outs and reservations.
                    </p>
                </div>
                {/* Current Time and Date */}
                <p className="text-xl text-gray-400 mt-1 whitespace-nowrap">
                    {dateTime.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    •{" "}
                    {dateTime.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                {/* Stats Cards */}
                {/* Optimized grid layout to be responsive and use full width */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {/* Total Rooms */}
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-[#979207] rounded-full mr-3">
                            <Bed />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Total Rooms</p>
                            <h2 className="text-lg font-bold text-gray-800">{totalRooms}</h2>
                        </div>
                    </div>

                    {/* Occupied Rooms (Now Dynamic) */}
                    <div className="flex items-center bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full mr-3">
                            <Bed />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Occupied</p>
                            <h2 className="text-lg font-bold text-gray-800">{occupiedCount}</h2>
                            <span className="text-xs text-gray-400">Currently in use</span>
                        </div>
                    </div>

                    {/* Available Rooms (Now Dynamic) */}
                    <div className="flex items-center bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full mr-3">
                            <DoorOpen />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Available</p>
                            <h2 className="text-lg font-bold text-gray-800">{availableCount}</h2>
                            <span className="text-xs text-gray-400">Ready for check-in</span>
                        </div>
                    </div>

                    {/* Reserved/Booked Rooms (Now Dynamic) */}
                    <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full mr-3">
                            <CalendarCheck />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Reserved</p>
                            <h2 className="text-lg font-bold text-gray-800">{bookedCount}</h2>
                            <span className="text-xs text-gray-400">Upcoming stays</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}