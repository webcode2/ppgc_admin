import React, { useState, useMemo } from "react";
import { InspectionItem, InspectionStatus } from "../../utils/types/propertyInspection";



interface InspectionBookingTableProps {
    data: InspectionItem[];
}

export default function InspectionBookingTable({ data }: InspectionBookingTableProps) {
    const [filter, setFilter] = useState<"All" | InspectionStatus>("All");

    const filteredData = useMemo(() => {
        if (filter === "All") return data;
        return data.filter((item) => item.status === filter);
    }, [data, filter]);

    const getButtonClass = (buttonFilter: "All" | InspectionStatus) => {
        return `py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === buttonFilter
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`;
    };

    return (
        <div className="overflow-x-auto w-full mt-10">
            
            {/* Filter Controls */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilter("All")}
                    className={getButtonClass("All")}
                >
                    All Bookings
                </button>

                <button
                    onClick={() => setFilter("Inspected")}
                    className={getButtonClass("Inspected")}
                >
                    Inspected
                </button>

                <button
                    onClick={() => setFilter("Upcoming")}
                    className={getButtonClass("Upcoming")}
                >
                    Upcoming
                </button>
            </div>

            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4 font-bold">Name</th>
                        <th className="py-3 px-4 font-bold">Property</th>
                        <th className="py-3 px-4 font-bold">Inspection Date</th>
                        <th className="py-3 px-4 font-bold">Inspection Time</th>
                        <th className="py-3 px-4 font-bold">Call Number</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((inspection, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-4 whitespace-nowrap">
                                    {inspection.name}
                                </td>

                                <td className="py-4 px-4">{inspection.property}</td>

                                <td className="py-4 px-4">{inspection.inspectionDate}</td>

                                <td className="py-4 px-4">{inspection.inspectionTime}</td>

                                <td className="py-4 px-4">{inspection.callNumber}</td>

                                {/* Status */}
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            inspection.status === "Inspected"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {inspection.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-8 text-gray-500 text-center">
                                No inspections found for the selected filter.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
