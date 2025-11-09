import React, { useState, useCallback, useMemo, useEffect } from "react";
// Assuming React Redux and local components/utilities are available in the runtime environment
// import { useDispatch, useSelector } from "react-redux"; // REMOVED to resolve compilation error
// import { useNavigate, useParams } from "react-router-dom"; // REMOVED to resolve compilation error
import { MoreVertical, Edit, Trash2, DoorOpen, CalendarCheck, X, DollarSign, Bed, CalendarArrowUpIcon } from "lucide-react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ReadCurrentBookin, ReadRoom } from "../../utils/types/hotelTypes";
import { getHotelWithRoomsById } from "../../store/slice/hotelSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/breadCrumb";
import { uiRoute } from "../../utils/utils";










// --- MOCK COMPONENTS AND UTILITIES ---

// Utility for status colors
const getStatusClasses = (status?: string) => {
    const s = status?.toLowerCase();
    switch (s) {
        case 'available': return 'bg-green-100 text-green-700 ring-green-500/10';
        case 'occupied': return 'bg-red-100 text-red-700 ring-red-500/10';
        case 'booked':
        case 'reserved': return 'bg-yellow-100 text-yellow-700 ring-yellow-500/10';
        default: return 'bg-gray-100 text-gray-700 ring-gray-500/10';
    }
};

// Simple Modal for actions
const ActionModal = ({ isOpen, title, children, onClose, onSubmit, submitText, isSubmitting }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  z-50 bg-gray-900  flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform">
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
                <div className="p-5 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={onSubmit} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                        {isSubmitting ? 'Processing...' : submitText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Dropdown Popover Menu (Vertical Ellipsis) ---
const DropdownMenu = ({ menuItems }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    const closeMenu = () => setIsOpen(false);

    // Close menu when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = () => closeMenu();
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" onClick={e => e.stopPropagation()}>
            <button
                onClick={toggleMenu}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-0 border border-gray-300 mb-6 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuItems.map((item: any, index: number) => {
                            if (item.label === '---') return <div key={index} className="border-t border-gray-300 my-1"></div>;

                            // FIX 2: Ensure item.icon (which is a component/function) is called correctly inside JSX
                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.action(e);
                                        closeMenu();
                                    }}
                                    disabled={item.disabled}
                                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${item.className || ''}`}
                                    role="menuitem"
                                >
                                    {IconComponent && <IconComponent size={16} className="mr-3" />}
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function HotelRoomManagementPage() {
    const { hotel_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Mock Redux state usage
    const hotel_details = useSelector((state: RootState) => state.hotel.viewHotelWithRooms) || { name: 'Ocean View Resort', rooms: [] };
    const isLoading = useSelector((state: RootState) => state.hotel.isLoading);

    // Using mock data since real data fetch likely fails in this isolated env
    const mockRooms: ReadRoom[] = [
        {
            id: 'r1', number: '101', room_type: 'Deluxe', price_per_night: 250, status: 'occupied', current_bookins: {
                email: "john@smith.com", notes: "", phone: "123456789",
                guest_name: 'John Smith', check_in: new Date(2025, 10, 1), check_out: new Date(2025, 10, 5), paid_amount: 1000
            }
        },
        { id: 'r2', number: '102', room_type: 'Standard', price_per_night: 150, status: 'available', current_bookins: null },
        {
            id: 'r3', number: '103', room_type: 'Suite', price_per_night: 400, status: 'booked', current_bookins: {
                email: "alice@johnson.com", notes: "", phone: "534567856789",
                guest_name: 'Alice Johnson', check_in: new Date(2025, 10, 8), check_out: new Date(2025, 10, 12), paid_amount: 50
            }
        },
        {
            id: 'r4', number: '104', room_type: 'Standard', price_per_night: 150, status: 'occupied', current_bookins: {

                phone: "896456789", email: "brown@mn.com", notes: "",
                guest_name: 'Bob Brown', check_in: new Date(2025, 10, 3), check_out: new Date(2025, 10, 6), paid_amount: 450
            }
        },
        { id: 'r5', number: '105', room_type: 'Deluxe', price_per_night: 250, status: 'available', current_bookins: null },
    ];


    const rooms = hotel_details?.rooms?.length > 0 ? hotel_details.rooms : mockRooms;


    // --- State for Action Modal ---
    const [actionModal, setActionModal] = useState<{
        isOpen: boolean;
        mode: 'edit' | 'delete' | 'book' | 'checkout' | 'cancel';
        room: ReadRoom | null;
        isSubmitting?: boolean;
    }>({
        isOpen: false,
        mode: 'edit',
        room: null,
    });

    // Mock form state for Edit/Book actions
    const [formData, setFormData] = useState({
        room_number: '',
        room_type: '',
        price_per_night: 0,
        guest_name: '',
    });

    // Fetch data on mount
    useEffect(() => {
        if (hotel_id) {
            dispatch(getHotelWithRoomsById(hotel_id));
        }
    }, [dispatch, hotel_id]);

    // --- Action Handlers (MOCK IMPLEMENTATIONS) ---

    const openActionModal = useCallback((mode: typeof actionModal['mode'], room: ReadRoom) => {
        setActionModal({ isOpen: true, mode, room, isSubmitting: false });

        // Pre-fill form for editing or booking
        if (mode === 'edit') {
            setFormData({
                room_number: room.number || room.number || '', // Handles slight variation in mock prop naming
                room_type: room.room_type || '',
                price_per_night: room.price_per_night || 0,
                guest_name: room.current_bookins?.guest_name || '',
            });
        } else if (mode === 'book') {
            setFormData(prev => ({
                ...prev,
                room_number: room.number || room.number || '',
                price_per_night: room.price_per_night || 0,
                guest_name: room.current_bookins?.guest_name || '',
            }));
        }
    }, []);

    const closeActionModal = useCallback(() => {
        setActionModal({ isOpen: false, mode: 'edit', room: null, isSubmitting: false });
        setFormData({ room_number: '', room_type: '', price_per_night: 0, guest_name: '' });
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price_per_night' ? Number(value) : value,
        }));
    };

    const handleConfirmAction = () => {
        if (!actionModal.room) return;

        // Mock submission process
        setActionModal(p => ({ ...p, isSubmitting: true }));

        setTimeout(() => {
            let message = '';
            const roomNumber = actionModal.room?.number || actionModal.room?.number;

            switch (actionModal.mode) {
                case 'edit':
                    message = `Room ${formData.room_number || roomNumber} updated successfully!`;
                    break;
                case 'delete':
                    message = `Room ${roomNumber} deleted.`;
                    break;
                case 'book':
                    message = `Room ${roomNumber} booked for ${formData.guest_name}.`;
                    break;
                case 'checkout':
                    message = `Guest checked out from Room ${roomNumber}.`;
                    break;
                case 'cancel':
                    message = `Booking cancelled for Room ${roomNumber}.`;
                    break;
                default:
                    message = 'Action confirmed.';
            }

            toast.success(message);
            closeActionModal();
        }, 800);
    };

    // --- UI/Data Helpers ---
    const breadcrumbItems = useMemo(() => [
        { label: "Dashboard", href: "/" },
        { label: hotel_details?.name || "Hotel", href: `/hotels/${hotel_id}` },
        { label: "Room Management" },
    ], [hotel_details?.name, hotel_id]);

    const roomsForTable = useMemo(() => {
        return rooms.map(room => {
            const number = room.number || 'N/A'; // Handle possible prop name differences
            const status = room.status?.toLowerCase();
            const currentBooking = room.current_bookins as ReadCurrentBookin | undefined;
            const checkIn = currentBooking?.check_in ? new Date(currentBooking.check_in).toLocaleDateString() : 'N/A';
            const checkOut = currentBooking?.check_out ? new Date(currentBooking.check_out).toLocaleDateString() : 'N/A';

            return {
                ...room,
                number,
                status,
                checkIn,
                checkOut,
                guest: currentBooking?.guest_name || 'N/A',
                isActionable: status === 'booked' || status === 'occupied',
                isAvailable: status === 'available',
                isBooked: status === 'booked',
                isOccupied: status === 'occupied',
                isReserved: status === 'reserved',
                isDirty: status === 'dirty' || status === 'maintenance', // Added dirty/maintenance status logic
            };
        });
    }, [rooms]);

    // --- Render Logic for Action Modal Content ---
    const renderModalContent = () => {
        const room = actionModal.room;
        if (!room) return <p>Room data missing.</p>;
        const roomNumber = room.number;

        switch (actionModal.mode) {
            case 'edit':
                return (
                    <>
                        <p className="text-gray-500">Edit core details for Room **{roomNumber}**.</p>
                        <label className="block text-sm font-medium text-gray-700">Room Number</label>
                        <input
                            type="text"
                            name="room_number"
                            value={formData.room_number}
                            onChange={handleFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <label className="block text-sm font-medium text-gray-700">Price Per Night (₦)</label>
                        <input
                            type="number"
                            name="price_per_night"
                            value={formData.price_per_night}
                            onChange={handleFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </>
                );
            case 'delete':
                return (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="font-semibold text-red-700 text-lg">Are you sure you want to delete Room **{roomNumber}**?</p>
                        <p className="text-sm text-red-600">This action cannot be undone.</p>
                    </div>
                );
            case 'book':
                return (
                    <>
                        <p className="text-gray-500">Quick Book Room **{roomNumber}**. Enter the primary guest name.</p>
                        <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                        <input
                            type="text"
                            name="guest_name"
                            value={formData.guest_name}
                            onChange={handleFormChange}
                            placeholder="e.g., Jane Doe"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <div className="text-xs text-gray-500 mt-2 p-2 border rounded">
                            <p>Note: Full booking details (dates, payment) should be managed via the Reception Desk screen.</p>
                        </div>
                    </>
                );
            case 'checkout':
                // Assuming 1 night for simplification if dates are missing, or calculate based on mock data
                const nights = room.current_bookins?.check_in && room.current_bookins.check_out
                    ? Math.ceil((new Date(room.current_bookins.check_out).getTime() - new Date(room.current_bookins.check_in).getTime()) / (1000 * 60 * 60 * 24))
                    : 1;
                const total = (room.price_per_night || 0) * nights;

                return (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="font-semibold text-green-700 text-lg">Confirm Check Out for **{roomNumber}**</p>
                        <p className="text-sm text-gray-600 mt-2">Current Guest: {room.current_bookins?.guest_name || 'N/A'}</p>
                        <p className="text-xl font-bold mt-2 text-gray-800">Estimated Final Bill: ₦{total.toLocaleString()}</p>
                    </div>
                );
            case 'cancel':
                return (
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="font-semibold text-yellow-700 text-lg">Are you sure you want to cancel the booking/reservation for **{roomNumber}**?</p>
                        <p className="text-sm text-yellow-600">The room will revert to **Available** status.</p>
                    </div>
                );
        }
    };

    const getModalTitle = (mode: typeof actionModal['mode']) => {
        switch (mode) {
            case 'edit': return 'Edit Room Details';
            case 'delete': return 'Confirm Deletion';
            case 'book': return 'Quick Book Room';
            case 'checkout': return 'Process Check Out';
            case 'cancel': return 'Cancel Booking/Reservation';
            default: return 'Room Action';
        }
    };

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    <Bed className="inline-block mr-3 text-blue-600" size={28} />
                    All Room Management
                </h1>
                <button
                    onClick={() => hotel_id ? navigate(uiRoute.createHotelRooms.route(hotel_id)) : null} // Mock 'Add' action with 'Edit' modal logic
                    disabled={!hotel_id}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold`}
                >
                    + Add New Room
                </button>
            </div>


            <div className="bg-white rounded-lg shadow-xl " >
                {roomsForTable.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No rooms found for this hotel.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₦)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Guest</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates (In/Out)</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roomsForTable.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {room.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {room.room_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            ₦{room.price_per_night?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(room.status)}`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {room.guest}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {room.checkIn} - {room.checkOut}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <DropdownMenu
                                                menuItems={[
                                                    { label: "Edit Room Details", icon: Edit, action: () => navigate(uiRoute.updateHotelRoom.route(room.id)) },
                                                    { label: "---", icon: () => null, action: () => { } },

                                                    // Dynamic Operational Actions
                                                    ...(room.isAvailable || room.isBooked || room.isReserved ? [
                                                        { label: "Check-in Guest", icon: DoorOpen, action: () => openActionModal('book', room), disabled: room.isOccupied, className: room.isBooked ? 'text-blue-600 font-semibold' : '' },
                                                        { label: "Book/Reserve Now", icon: CalendarCheck, action: () => navigate(uiRoute.newBooking.route(room.id)), disabled: room.isOccupied },
                                                    ] : []),

                                                    ...(room.isOccupied ? [
                                                        { label: "Process Check-out", icon: X, action: () => openActionModal('checkout', room), className: 'text-green-600 font-semibold' },
                                                    ] : []),

                                                    ...(room.isBooked || room.isReserved ? [
                                                        { label: "Cancel Booking", icon: Trash2, action: () => openActionModal('cancel', room), className: 'text-yellow-600' },
                                                    ] : []),

                                                    { label: "---", icon: () => null, action: () => { } },
                                                    { label: "Delete Room", icon: Trash2, action: () => openActionModal('delete', room), className: 'text-red-600' },
                                                ]}
                                            />

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Global Action Modal */}
            <ActionModal
                isOpen={actionModal.isOpen}
                title={getModalTitle(actionModal.mode)}
                onClose={closeActionModal}
                onSubmit={handleConfirmAction}
                submitText={actionModal.mode === 'delete' ? 'Confirm Deletion' : 'Confirm Action'}
                isSubmitting={actionModal.isSubmitting}
            >
                {renderModalContent()}
            </ActionModal>
        </div>
    );
}