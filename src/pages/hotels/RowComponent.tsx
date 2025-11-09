import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { AppDispatch } from "../../store";
// Assuming Hotel type and deleteHotel thunk are correctly typed in hotelSlice
import { deleteHotel, } from "../../store/slice/hotelSlice";
import { Hotel } from "../../utils/types/hotelTypes";
import { useNavigate } from "react-router-dom";
import { uiRoute } from "../../utils/utils";


interface HotelRowProps {
    hotel: Hotel;
    dispatch: AppDispatch;
}


/**
 * Reusable hook to handle clicks outside of a specific element.
 * @param {React.RefObject<T | null>} ref - A ref attached to the target element (must extend HTMLElement).
 * @param {() => void} handler - The function to call when a click occurs outside the ref.
 *
 * FIX: Using generics <T extends HTMLElement> and explicitly allowing the ref type to be | null
 * ensures compatibility with useRef, which always returns a RefObject containing T | null.
 */
const useClickOutside = <T extends HTMLElement>(ref: React.RefObject<T | null>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            // Do nothing if clicking ref's element or descendent elements
            // The check for !ref.current handles the null case safely.
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        // Use 'mousedown'/'touchstart' for responsiveness on closing menus
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};




const HotelRow: React.FC<HotelRowProps> = ({ hotel, dispatch }) => {
    // State to track if this specific row's menu is open
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Ref for the row's action cell (the clickable area)
    const actionCellRef = useRef<HTMLTableCellElement>(null);

    // Attach the click outside listener to the action cell ref
    useClickOutside(actionCellRef, () => {
        if (isOpen) {
            setIsOpen(false);
        }
    });

    const handleToggle = (e: React.MouseEvent) => {
        // Stop event propagation so the click doesn't immediately close the menu via the document listener
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleDelete = (id: string | number) => {
        dispatch(deleteHotel(id));
        setIsOpen(false);
    };

    const handleEdit = (id: string | number) => {
        console.log("Edit", id);
        navigate(`/hotels/${id}/edit`)
        setIsOpen(false);
    };

    const handleRowClick = () => {
        navigate(`/hotels/${hotel.id}`);
    };
    return (
        <tr
            className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 cursor-pointer"
            onClick={handleRowClick}
        >            <td className="p-2 ">
                <img
                    src={hotel.cover_image.secure_url}
                    alt={hotel.name}
                    // Added image fallback
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/64x64/3b82f6/ffffff?text=${hotel.name.charAt(0)}`
                    }}
                    className="w-16 h-16 object-cover rounded"
                />
            </td>
            <td className="p-2 ">{hotel.name}</td>
            <td className="p-2 ">{hotel.area.city_or_town}</td>
            <td className="p-2 ">{hotel.area.country}</td>
            <td className="p-2 ">{hotel.area.street}</td>
            <td className="p-2 ">{hotel.area.zip_or_postal_code}</td>
            <td className="p-2 ">{hotel.description.slice(0, 40)}...</td>

            {/* Actions menu container, ref attached here */}
            <td className="p-2 text-right relative" ref={actionCellRef}>
                <button
                    onClick={handleToggle}
                    className="p-2 rounded hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={isOpen}
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden transform origin-top-right"
                        role="menu"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(uiRoute.createHotelRooms.route(hotel.id)) }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                            role="menuitem"
                        >
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </span>Create Room
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(hotel.id) }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                            role="menuitem"
                        >
                            <span className="mr-2">✏️</span> Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(hotel.id) }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                            role="menuitem"
                        >
                            <span className="mr-2">🗑</span> Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default HotelRow;
