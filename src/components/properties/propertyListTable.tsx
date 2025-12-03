import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Trash2, Edit, Info, X } from "lucide-react";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { deleteProperty } from "../../store/slice/propertySlice";
import { uiRoute } from "../../utils/utils";
import { PropertyList } from "../../utils/types/propertiesType";



interface PropertyListTableProps {
    data: PropertyList[];
}

// --- Component for the Action Popover ---
const ActionPopover = ({ property, onUpdate, onDelete, onViewClient, onClose }: {
    property: PropertyList;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onViewClient: (id: string) => void;
    onClose: () => void;
}) => (
    <div className="absolute right-0 top-0 mt-8 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">

        <button
            onClick={(e) => { e.stopPropagation(); onUpdate(property.id); onClose(); }}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
            <Edit size={16} className="mr-2 text-blue-500" /> Update Property
        </button>

        {property.is_sold && (
            <button
                onClick={(e) => { e.stopPropagation(); onViewClient(property.id); onClose(); }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 transition border-t border-gray-100"
            >
                <Info size={16} className="mr-2 text-green-600" /> View Sales Details
            </button>
        )}

        <button
            onClick={(e) => { e.stopPropagation(); onDelete(property.id); onClose(); }}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 transition border-t border-gray-100"
        >
            <Trash2 size={16} className="mr-2 text-red-500" /> Delete Property
        </button>
    </div>
);


export default function PropertyListTable({ data = [] }: PropertyListTableProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenPopoverId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleRowClick = (propertyId: string) => {
        navigate(`/properties/${propertyId}/detail/`); // Navigate to a dedicated detail screen
    };

    const handleUpdate = (id: string) => navigate(uiRoute.editProperty.route(id));


    const handleDelete = (id: string) => dispatch(deleteProperty(id));


    const handleViewClientDetails = (id: string) => {
        console.log(`Navigating to client details for sold property ID: ${id}`);
        // In a real app, you would navigate to a dedicated sales/client screen
        navigate(`/properties/${id}/sales-report`);
    };
    const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"

    return (
        <div className="overflow-x-auto  mt-10 " ref={popoverRef}>
            <table className=" border-collapse">
                <thead>
                    <tr className="text-left text-gray-700 bg-gray-50 uppercase text-xs border-b border-gray-300">
                        <th className="py-3 px-4 font-bold"></th>
                        <th className="py-3 px-4 font-bold">Name & ID</th>
                        <th className="py-3 px-4 font-bold">Type</th>
                        <th className="py-3 px-4 font-bold w-1/4">Description</th>
                        <th className="py-3 px-4 font-bold text-right">Price</th>
                        <th className="py-3 px-4 font-bold text-center">Status</th>
                        <th className="py-3 px-4 font-bold s text-center">Options</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((property, idx) => (
                        <tr
                            key={property.id || idx}
                            className="hover:bg-yellow-50/50 transition-colors"
                        >
                            {/* COVER IMAGE - Prevents row click on this cell for safety */}
                            {/* COVER IMAGE - Prevents row click on this cell for safety */}
                            <td
                                className="py-2 pr-2 space-x-2 w-16"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={property.cover_image.secure_url || FALLBACK_IMAGE_URL}
                                    alt={property.title}
                                    // Use onError to swap to fallback if the primary URL fails to load
                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
                                    className="w-12 h-12 object-cover rounded-md"
                                />
                            </td>

                            {/* NAME (Title) - Navigates on click */}
                            <td
                                className="py-4 px-4 whitespace-nowrap cursor-pointer"
                                onClick={() => handleRowClick(property.id)}
                            >
                                <span className="font-semibold text-gray-900">{property.title}</span>
                                <div className="text-xs text-gray-500">ID: {property.id}</div>
                            </td>

                            {/* TYPE */}
                            <td
                                className="py-4 px-4 whitespace-nowrap cursor-pointer text-sm text-gray-600"
                                onClick={() => handleRowClick(property.id)}
                            >
                                {property.type}
                            </td>

                            {/* DESCRIPTION */}
                            <td
                                className="py-4 px-4 text-sm text-gray-500 cursor-pointer"
                                onClick={() => handleRowClick(property.id)}
                            >
                                <span className="line-clamp-2">{property.description}</span>
                            </td>

                            {/* PRICE */}
                            <td
                                className="py-4 px-4 whitespace-nowrap text-right font-bold text-gray-800 cursor-pointer"
                                onClick={() => handleRowClick(property.id)}
                            >
                                $ {new Intl.NumberFormat().format(property.price)}
                            </td>

                            {/* STATUS FLAGS */}
                            <td
                                className="py-4 px-4 text-center cursor-pointer"
                                onClick={() => handleRowClick(property.id)}
                            >
                                <div className="flex flex-col gap-1 items-center">
                                    {property.is_sold && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">SOLD</span>
                                    )}
                                    {property.is_in_negotiation && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Negotiation</span>
                                    )}
                                </div>
                            </td>

                            {/* ACTIONS (Ellipsis) */}
                            <td className="py-4 px-4 text-center w-10 relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents row click navigation
                                        setOpenPopoverId(openPopoverId === property.id ? null : property.id);
                                    }}
                                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition focus:outline-none"
                                    aria-label="Options"
                                    aria-expanded={openPopoverId === property.id}
                                >
                                    <EllipsisVertical className="w-5 h-5" />
                                </button>
                                {openPopoverId === property.id && (
                                    <ActionPopover
                                        property={property}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onViewClient={handleViewClientDetails}
                                        onClose={() => setOpenPopoverId(null)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}