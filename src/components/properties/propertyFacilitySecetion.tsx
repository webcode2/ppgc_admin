

// Consolidate all facility lists into a single object for automatic lookup

const ALL_FACILITIES: Record<string, string[]> = {
    'hotel': [
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
    ],
    'apartment': ['Kitchen', 'Gym', 'Wi-Fi'],
    'landed_property': ['Fence'],
    'room': ["Ac", "Wi-Fi", "TV",],
    // Add other property types and their facilities here as needed
};


export default function FacilitiesSelect({
    selected,
    onChange,
    property_type,
}: {
    selected: string[];
    onChange: (value: string[]) => void;
    property_type: string;
}) {
    const handleCheck = (facility: string) => {
        if (selected.includes(facility)) {
            onChange(selected.filter((item) => item !== facility));
        } else {
            onChange([...selected, facility]);
        }
    };

    // ✅ FIX: Use direct object lookup instead of switch statement.
    // Use the property_type string as the key to get the corresponding array.
    // Fallback to an empty array if the property_type is not found (using || []).
    const facilities: string[] = ALL_FACILITIES[property_type.toLowerCase().replace(" ", "_")] || [];

    // Helper to format the display name (e.g., 'landed_property' -> 'Landed Property')
    const formatPropertyType = (value: string): string => {
        return value
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                Facilities for: {formatPropertyType(property_type)}
            </h3>

            {facilities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {facilities.map((facility) => (
                        <label
                            key={facility}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-150"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(facility)}
                                onChange={() => handleCheck(facility)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{facility}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">No specific facilities defined for this property type.</p>
            )}

            <p className="mt-4 pt-4 border-t text-sm text-green-700 font-medium">
                {selected.length} facility/facilities selected.
            </p>
        </div>
    );
}
