import { useState } from "react";



export default function ChoiceDropdown({ data = ["This Week", "This Month", "Last six Month", "This Year"] }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(data[0]);

    const handleSelect = (choice) => {
        setSelected(choice);
        setOpen(false);
    };

    return (
        <div className="relative inline-block text-left ">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex justify-between w-40 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
                {selected}
                <svg
                    className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-y-auto">
                        {data.map((choice) => (
                            <li key={choice}>
                                <button
                                    onClick={() => handleSelect(choice)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    {choice}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
