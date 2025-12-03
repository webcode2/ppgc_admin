import React, { useState, useMemo } from 'react';

// Assuming your data structure now looks something like this:
// [
//   { name: 'John Doe', property: '123 Main St', inspectionDate: '2025-12-10', inspectionTime: '10:00 AM', callNumber: '555-1234', status: 'Inspected' },
//   { name: 'Jane Smith', property: '456 Oak Ave', inspectionDate: '2025-12-15', inspectionTime: '02:00 PM', callNumber: '555-5678', status: 'Upcoming' },
//   // ... more data
// ]

function InspectionBookingTable({ data }) {
    // 1. State to track the active filter: 'All', 'Inspected', or 'Upcoming'
    const [filter, setFilter] = useState('All');

    // 2. Filter the data based on the current filter state
    const filteredData = useMemo(() => {
        if (filter === 'All') {
            return data;
        }
        return data.filter(inspection => inspection.status === filter);
    }, [data, filter]);

    // Helper function for button styling
    const getButtonClass = (buttonFilter) => {
        return `py-2 px-4 rounded-lg text-sm font-medium transition-colors ${filter === buttonFilter
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`;
    };

    return (
        <div className="overflow-x-auto w-full mt-10">
            {/* Filter Controls */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilter('All')}
                    className={getButtonClass('All')}
                >
                    All Bookings
                </button>
                <button
                    onClick={() => setFilter('Inspected')}
                    className={getButtonClass('Inspected')}
                >
                    Inspected
                </button>
                <button
                    onClick={() => setFilter('Upcoming')}
                    className={getButtonClass('Upcoming')}
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
                        {/* New Status Column */}
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
                                <td className="py-4 px-4 space-x-2 whitespace-nowrap">
                                    <span>{inspection.name}</span>
                                </td>
                                <td className="py-4 px-4 space-x-2">
                                    <span>{inspection.property}</span>
                                </td>
                                <td className="py-4 px-4 space-x-2">
                                    <span>{inspection.inspectionDate}</span>
                                </td>
                                <td className="py-4 px-4 space-x-2 ">
                                    <span>{inspection.inspectionTime}</span>
                                </td>
                                <td className="py-4 px-4 space-x-2 ">
                                    <span>{inspection.callNumber}</span>
                                </td>
                                {/* Status Data Cell */}
                                <td className="py-4 px-4 space-x-2 ">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inspection.status === 'Inspected'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {inspection.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="text-center">
                            <td colSpan={6} className="py-8 text-gray-500">
                                No inspections found for the selected filter.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default InspectionBookingTable;