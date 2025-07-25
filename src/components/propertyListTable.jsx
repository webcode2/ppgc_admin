import React from 'react'

function PropertyListTable({ data }) {
    return (
        <div className="overflow-x-auto w-full mt-10">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4  font-bold">Name</th>
                        <th className="py-3 px-4  font-bold">description</th>
                        <th className="py-3 px-4  font-bold">Price</th>
                        <th className="py-3 px-4  font-bold">Pictures</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((property, idx) => (
                        <tr
                            key={idx}
                            className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-4 px-4 whitespace-nowrap">
                                <span>{property.name}</span>
                            </td>
                            <td className="py-4 px-4">
                                <span className="line-clamp-2">{property.description}</span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                                <span>{property.price}</span>
                            </td>
                            <td className="py-4 px-4  space-x-2 ">
                                <span className="line-clamp-2">{property.pictures}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PropertyListTable