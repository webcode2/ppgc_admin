import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MoreVertical, Edit, Trash2, DoorOpen, CalendarCheck, X, Bed } from "lucide-react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ReadCurrentBookin, ReadRoom } from "../../utils/types/hotelTypes";
import { getHotelWithRoomsById } from "../../store/slice/hotelSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/breadCrumb";
import { uiRoute } from "../../utils/utils";
import { twMerge } from "tailwind-merge";

// --- TYPE DEFINITION ---
type RoomStatus = 'all' | 'available' | 'booked' | 'occupied';

// --- MODULES IMPORTED BELOW ---

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

// --- MOCK DATA ---
const mockRooms: ReadRoom[] = [
    { id: 'r1', number: '101', room_type: 'Deluxe', price_per_night: 250, status: 'occupied', current_bookins: { email: "john@smith.com", notes: "", phone: "123456789", guest_name: 'John Smith', check_in: new Date(2025, 10, 1), check_out: new Date(2025, 10, 5), paid_amount: 1000 } },
    { id: 'r2', number: '102', room_type: 'Standard', price_per_night: 150, status: 'available', current_bookins: null },
    { id: 'r3', number: '103', room_type: 'Suite', price_per_night: 400, status: 'booked', current_bookins: { email: "alice@johnson.com", notes: "", phone: "534567856789", guest_name: 'Alice Johnson', check_in: new Date(2025, 10, 8), check_out: new Date(2025, 10, 12), paid_amount: 50 } },
    { id: 'r4', number: '104', room_type: 'Standard', price_per_night: 150, status: 'occupied', current_bookins: { phone: "896456789", email: "brown@mn.com", notes: "", guest_name: 'Bob Brown', check_in: new Date(2025, 10, 3), check_out: new Date(2025, 10, 6), paid_amount: 450 } },
    { id: 'r5', number: '105', room_type: 'Deluxe', price_per_night: 250, status: 'available', current_bookins: null },
    { id: 'r6', number: '201', room_type: 'Executive', price_per_night: 350, status: 'available', current_bookins: null },
    { id: 'r7', number: '202', room_type: 'Standard', price_per_night: 150, status: 'occupied', current_bookins: { email: "carl@xyz.com", notes: "", phone: "123456789", guest_name: 'Carl Davis', check_in: new Date(2025, 10, 15), check_out: new Date(2025, 10, 20), paid_amount: 1750 } },
    { id: 'r8', number: '203', room_type: 'Deluxe', price_per_night: 250, status: 'available', current_bookins: null },
    { id: 'r9', number: '204', room_type: 'Suite', price_per_night: 400, status: 'booked', current_bookins: { email: "eve@pqr.com", notes: "", phone: "534567856789", guest_name: 'Eve Green', check_in: new Date(2025, 11, 1), check_out: new Date(2025, 11, 5), paid_amount: 400 } },
    { id: 'r10', number: '205', room_type: 'Standard', price_per_night: 150, status: 'available', current_bookins: null },
    { id: 'r11', number: '301', room_type: 'Standard', price_per_night: 150, status: 'available', current_bookins: null },
    { id: 'r12', number: '302', room_type: 'Deluxe', price_per_night: 250, status: 'occupied', current_bookins: { email: "frank@abc.com", notes: "", phone: "123456789", guest_name: 'Frank Hall', check_in: new Date(2025, 10, 2), check_out: new Date(2025, 10, 7), paid_amount: 1250 } },
    { id: 'r13', number: '303', room_type: 'Executive', price_per_night: 350, status: 'available', current_bookins: null },
    { id: 'r14', number: '304', room_type: 'Suite', price_per_night: 400, status: 'booked', current_bookins: { email: "grace@def.com", notes: "", phone: "534567856789", guest_name: 'Grace Ivey', check_in: new Date(2025, 12, 10), check_out: new Date(2025, 12, 15), paid_amount: 200 } },
    { id: 'r15', number: '305', room_type: 'Standard', price_per_night: 150, status: 'available', current_bookins: null },
];


// Filter Button Component
const FilterButton = ({ status, count, currentFilter, onClick }: {
    status: RoomStatus,
    count: number,
    currentFilter: RoomStatus,
    onClick: (status: RoomStatus) => void
}) => {
    const isActive = currentFilter === status;
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200";

    let colorClasses = '';
    switch (status) {
        case 'available':
            colorClasses = isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100';
            break;
        case 'occupied':
            colorClasses = isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100';
            break;
        case 'booked':
            colorClasses = isActive ? 'bg-yellow-600 text-gray-900' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
            break;
        case 'all':
        default:
            colorClasses = isActive ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
            break;
    }

    return (
        <button
            onClick={() => onClick(status)}
            className={`${baseClasses} ${colorClasses}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
        </button>
    );
};

// Simple Modal for actions
const ActionModal = ({ isOpen, title, children, onClose, onSubmit, submitText, isSubmitting }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform">
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={20} />
                    </button>
                </div>
                {/* Max height and overflow ensures modal content is scrollable if long */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
                <div className="p-5 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={onSubmit} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition">
                        {isSubmitting ? 'Processing...' : submitText}
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- MAIN PAGE COMPONENT ---

export default function HotelRoomManagementPage() {
    const { hotel_id } = useParams() 
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<RoomStatus>('all');

    // --- Redux & Data State ---
    const hotel_details = useSelector((state: RootState) => state.hotel.viewHotelWithRooms) || { name: 'Ocean View Resort', rooms: [] };
    const rooms = hotel_details?.rooms?.length > 0 ? hotel_details.rooms : mockRooms;

    const [actionModal, setActionModal] = useState<{
        isOpen: boolean;
        mode: 'edit' | 'delete' | 'book' | 'checkout' | 'cancel';
        room: ReadRoom | null;
        isSubmitting?: boolean;
    }>({ isOpen: false, mode: 'edit', room: null });

    const [formData, setFormData] = useState({ /* ... form data ... */ });

    // --- Action Handlers ---
    const openActionModal = useCallback((mode: typeof actionModal['mode'], room: ReadRoom) => {
        setOpenMenuId(null); 
        setActionModal({ isOpen: true, mode, room, isSubmitting: false });
    }, []);

    const closeActionModal = useCallback(() => {
        setActionModal({ isOpen: false, mode: 'edit', room: null, isSubmitting: false });
    }, []);

    const handleConfirmAction = () => {
        if (!actionModal.room) return;
        setActionModal(p => ({ ...p, isSubmitting: true }));
        setTimeout(() => { toast.success(`Action for ${actionModal.room?.number} confirmed.`); closeActionModal(); }, 800);
    };

    // --- Memoized Data ---
    const { roomsForTable, statusCounts } = useMemo(() => {
        let filteredRooms = rooms;

        if (filterStatus !== 'all') {
            if (filterStatus === 'booked') {
                filteredRooms = rooms.filter(room => room.status?.toLowerCase() === 'booked' || room.status?.toLowerCase() === 'reserved');
            } else {
                filteredRooms = rooms.filter(room => room.status?.toLowerCase() === filterStatus);
            }
        }

        const counts = { all: rooms.length, available: 0, booked: 0, occupied: 0 };

        const processedRooms = filteredRooms.map(room => {
            const status = room.status?.toLowerCase();
            if (status === 'available') counts.available++;
            if (status === 'booked' || status === 'reserved') counts.booked++;
            if (status === 'occupied') counts.occupied++;

            const currentBooking = room.current_bookins as ReadCurrentBookin | undefined;
            return {
                ...room,
                id: room.id,
                number: room.number || 'N/A',
                status,
                checkIn: currentBooking?.check_in ? new Date(currentBooking.check_in).toLocaleDateString() : 'N/A',
                checkOut: currentBooking?.check_out ? new Date(currentBooking.check_out).toLocaleDateString() : 'N/A',
                guest: currentBooking?.guest_name || 'N/A',
                isAvailable: status === 'available',
                isBooked: status === 'booked' || status === 'reserved',
                isOccupied: status === 'occupied',
            };
        });
        return { roomsForTable: processedRooms, statusCounts: counts };
    }, [rooms, filterStatus]);

    const breadcrumbItems = useMemo(() => [
        { label: "Dashboard", href: "/" },
        { label: hotel_details?.name || "Hotel", href: `/hotels/${hotel_id}` },
        { label: "Room Management" },
    ], [hotel_details?.name, hotel_id]);

    // --- Render Logic (omitted for brevity) ---
    const renderModalContent = () => { /* ... implementation omitted ... */ return null; };
    const getModalTitle = (mode: typeof actionModal['mode']) => { /* ... implementation omitted ... */ return 'Action'; };


    // --- RETURN ---
    return (
        <div className="bg-gray-50 p-4 md:p-6 flex flex-col h-screen">
            <Breadcrumb items={breadcrumbItems} />

            {/* Title and Controls Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4 md:my-6 gap-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex-shrink-0 mr-4">
                    <Bed className="inline-block mr-3 text-blue-600" size={28} />
                    All Room Management
                </h1>

                <RoomFilterControls
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    statusCounts={statusCounts}
                    hotel_id={hotel_id}
                    navigate={navigate}
                />
            </div>

            {/* Table Area */}
            <RoomsTable
                roomsForTable={roomsForTable}
                filterStatus={filterStatus}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                openActionModal={openActionModal}
                getStatusClasses={getStatusClasses}
                hotel_id={hotel_id}
                navigate={navigate}
            />

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

// =========================================================================
// --- MODULES ---
// =========================================================================

// --- RoomFilterControls Module ---
const RoomFilterControls = ({ filterStatus, setFilterStatus, statusCounts, hotel_id, navigate }: any) => (
    <div className="flex items-center space-x-4 md:ml-auto">
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg flex-shrink-0">
            <FilterButton status="all" count={statusCounts.all} currentFilter={filterStatus} onClick={setFilterStatus} />
            <FilterButton status="available" count={statusCounts.available} currentFilter={filterStatus} onClick={setFilterStatus} />
            <FilterButton status="booked" count={statusCounts.booked} currentFilter={filterStatus} onClick={setFilterStatus} />
            <FilterButton status="occupied" count={statusCounts.occupied} currentFilter={filterStatus} onClick={setFilterStatus} />
        </div>

        <button
            onClick={() => hotel_id ? navigate(uiRoute.createHotelRooms.route(hotel_id)) : null}
            disabled={!hotel_id}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold flex-shrink-0`}
        >
            + Add New Room
        </button>
    </div>
);

// --- RoomsTable Module ---
const RoomsTable = ({ roomsForTable, filterStatus, openMenuId, setOpenMenuId, openActionModal, getStatusClasses, hotel_id, navigate }: any) => (
    <div className="bg-white rounded-lg shadow-xl flex-grow overflow-hidden">
        {roomsForTable.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
                {filterStatus === 'all'
                    ? 'No rooms found for this hotel.'
                    : `No ${filterStatus} rooms match the filter.`
                }
            </div>
        ) : (
                <div className="h-full flex flex-col">

                    {/* Table Header (Static) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
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
                        </table>
                    </div>

                    {/* Table Body (Scrolling) */}
                    <div className="overflow-y-auto overflow-x-auto flex-grow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roomsForTable.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.room_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₦{room.price_per_night?.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(room.status)}`}>{room.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.guest}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{room.checkIn} - {room.checkOut}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <DropdownMenu
                                                roomId={room.id}
                                                openMenuId={openMenuId}
                                                setOpenMenuId={setOpenMenuId}
                                                menuItems={[
                                                    { label: "Edit Room Details", icon: Edit, action: () => navigate(uiRoute.updateHotelRoom.route(room.id)) },
                                                    { label: "---", icon: () => null, action: () => { } },

                                                    // Check-in / Booking Options
                                                    ... (!room.isOccupied ? [
                                                        { label: "Check-in Guest", icon: DoorOpen, action: () => navigate(uiRoute.newBooking.route(room.id, hotel_id ?? "default-hotel-id")), className: room.isBooked ? 'text-blue-600 font-semibold' : '' },


                                                        { label: "Book/Reserve Now", icon: CalendarCheck, action: () => navigate(uiRoute.newBooking.route(room.id, hotel_id ?? "default-hotel-id")) },
                                                    ] : []),

                                                    // Check-out Option
                                                    ...(room.isOccupied ? [
                                                        { label: "Process Check-out", icon: X, action: () => openActionModal('checkout', room), className: 'text-green-600 font-semibold' },
                                                    ] : []),

                                                    // Cancel Booking Option
                                                    ...(room.isBooked ? [
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
                </div>
        )}
    </div>
);

// --- DropdownMenu Module (Fixed Action Logic) ---
const DropdownMenu = ({ menuItems, roomId, openMenuId, setOpenMenuId }: any) => {

    const isOpen = openMenuId === roomId;

    const toggleMenu = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(prevId => (prevId === roomId ? null : roomId));
    }, [roomId, setOpenMenuId]);

    const closeMenu = useCallback(() => setOpenMenuId(null), [setOpenMenuId]);

    // Global listener for outside clicks (using capture phase)


    return (
        <div className="relative inline-block text-left" onClick={e => e.stopPropagation()}>
            <button
                onClick={toggleMenu}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-0 border border-gray-300 mb-6 focus:outline-none"
                // Clicks inside this container will be stopped from propagating to the window by the outer div onClick handler
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuItems.map((item: any, index: number) => {
                            if (item.label === '---') return <div key={index} className="border-t border-gray-300 my-1"></div>;

                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        // 1. Run the action synchronously
                                        console.log("nenenennenenen")
                                        item.action();

                                        // 2. Schedule the closure after a micro-delay. This is the **CRITICAL FIX** // to ensure the action runs fully before the global capture phase listener 
                                        // interferes with React's state update.
                                        setTimeout(() => closeMenu(), 50);
                                    }}
                                    disabled={item.disabled}
                                    className={twMerge(`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer ${item.className || ''}`)}
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