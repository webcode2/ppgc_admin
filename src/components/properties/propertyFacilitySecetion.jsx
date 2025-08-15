import React from 'react';

const facilities = [
    'Air Conditioning',
    'Wi-Fi',
    'BBQ Area',
    'Sauna',
    'Parking',
    'Gym',
    'Spa',
    'Swimming Pool',
    'Lobby',
    'Garden',
    'Laundry',
    'Playground',
    'Non-smoking rooms',
    'Family Rooms',
];

export default function FacilitiesSelect({ selected, onChange }) {
    const handleCheck = (facility) => {
        if (selected.includes(facility)) {
            onChange(selected.filter((item) => item !== facility));
        } else {
            onChange([...selected, facility]);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Main Facilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {facilities.map((facility) => (
                    <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selected.includes(facility)}
                            onChange={() => handleCheck(facility)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
