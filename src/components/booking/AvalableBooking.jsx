import React from 'react';
import { Calendar, User, DoorClosed } from 'lucide-react';
import { NumericFormat } from "react-number-format";


export default function AvailableBookingTable({ data = [] }) {
    return (
        <div className="overflow-x-auto w-full mt-10">

            {!data.length && (<>
                <p className=" bg-gray-100 text-sm py-12 px-5 text-center rounded-2xl">You do not have any Outstanding Reservation or Available room</p></>)}

            {data.length > 0 && (<table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4  font-bold">Room No.</th>
                        <th className="py-3 px-4  font-bold">Price</th>
                        <th className="py-3 px-4  font-bold">Status</th>
                        <th className="py-3 px-4  font-bold"></th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((avail, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >

                            <td className="py-4 px-4   space-x-2">
                                <span>Room {avail?.roomNo}, kings hotel</span>
                            </td>
                            <td className="py-4 px-4 space-x-2">
                                <NumericFormat
                                    value={avail?.price}
                                    displayType="text"
                                    thousandSeparator
                                    prefix="₦"
                                />
                            </td>
                            <td className="py-4 px-4   space-x-2 whitespace-nowrap">
                                <span className={`${avail.status === "reserved" ? "text-blue-900" : "text-[#938E07]"}`}>{avail?.status}</span>
                            </td>
                            <td className="py-4 px-4  space-x-2 ">
                                <button className="border border-[#938E07] rounded-lg text-gray-900 px-3 py-1 active:scale-95 transition-all ease-in-out   ">Edit</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )
            }
        </div >
    );
}
