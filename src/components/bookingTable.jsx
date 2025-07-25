import React from 'react';
import { Calendar, User, DoorClosed } from 'lucide-react';

export default function BookingTable({ data }) {
    return (
        <div className="overflow-x-auto w-full mt-10">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4  font-bold">Name</th>
                        <th className="py-3 px-4  font-bold">Room No</th>
                        <th className="py-3 px-4  font-bold">Check-In Date</th>
                        <th className="py-3 px-4  font-bold">Check-Out Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((booking, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-4 px-4   space-x-2 whitespace-nowrap">
                                <span>{booking.name}</span>
                            </td>
                            <td className="py-4 px-4   space-x-2">
                                <span>{booking.roomNo}</span>
                            </td>
                            <td className="py-4 px-4   space-x-2">
                                <span>{booking.checkIn}</span>
                            </td>
                            <td className="py-4 px-4  space-x-2 ">
                                <span>{booking.checkOut}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
