import React from 'react'

function InspectionBookingTable({ data }) {
    return (
        <div className="overflow-x-auto w-full mt-10">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4  font-bold">Name</th>
                        <th className="py-3 px-4  font-bold">Property</th>
                        <th className="py-3 px-4  font-bold">Inspection Date</th>
                        <th className="py-3 px-4  font-bold">Inspection Time</th>
                        <th className="py-3 px-4  font-bold">Call Number</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((inspection, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-4 px-4   space-x-2 whitespace-nowrap">
                                <span>{inspection.name}</span>
                            </td>
                            <td className="py-4 px-4   space-x-2">
                                <span>{inspection.property}</span>
                            </td>
                            <td className="py-4 px-4   space-x-2">
                                <span>{inspection.inspectionDate}</span>
                            </td>
                            <td className="py-4 px-4  space-x-2 ">
                                <span>{inspection.inspectionTime}</span>
                            </td>
                            <td className="py-4 px-4  space-x-2 ">
                                <span>{inspection.callNumber}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default InspectionBookingTable