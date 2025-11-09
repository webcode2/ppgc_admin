import { Bed, CalendarArrowUpIcon, CalendarCheck, DoorOpen, X } from "lucide-react";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../../store";
import {  ReadCurrentBookin, ReadRoom, Room } from "../../utils/types/hotelTypes";
import { getHotelWithRoomsById } from "../../store/slice/hotelSlice";
import ReceptionHeader from "../../components/hotel/receptionHeader";
import Breadcrumb from "../../components/breadCrumb";
import Loading from "../../components/loading";
import { useReceptionActions } from "../../utils/actions";
import { BookingForm } from "../../utils/types/bookingTypes";

// Utility function to format date to YYYY-MM-DD string
const dateToISOString = (d: Date | string | undefined) => {
    if (!d) return new Date().toISOString().slice(0, 10);
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
};

/* Mock FacilitiesSelect — replace with your real component */
const FacilitiesSelect = ({ selected, onChange }: { selected: string[]; onChange: (values: string[]) => void }) => (
    <select
        multiple
        value={selected}
        onChange={(e) =>
            onChange(Array.from(e.target.selectedOptions, (o) => o.value))
        }
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
    >
        <option value="wifi">Wi-Fi</option>
        <option value="ac">Air Conditioning</option>
        <option value="tv">TV</option>
        <option value="balcony">Balcony</option>
    </select>
);

// Define limits based on the grid (3 columns wide)
const ROOM_LIMITS = {
    '1': 3, // 1 row * 3 columns
    '2': 6, // 2 rows * 3 columns
    '3': 9, // 3 rows * 3 columns
};

export default function HotelReceptionPage() {
    // Hooks and Selectors
    const { hotel_id } = useParams<{ hotel_id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Redux state
    const hotel_details = useSelector((state: RootState) => state.hotel.viewHotelWithRooms);
    const isLoading = useSelector((state: RootState) => state.hotel.isLoading)
    const rooms = hotel_details?.rooms || [];

    // --- NEW STATE FOR ROOM LIMIT ---
    const [roomRowLimit, setRoomRowLimit] = useState<'1' | '2' | '3'>('1'); // Default to 1 row
    const maxRoomsToShow = ROOM_LIMITS[roomRowLimit];


    // Local states
    const [search, setSearch] = useState("");
    const [newRoom, setNewRoom] = useState<Room>({
        number: "",
        description: "",
        max_occupancy: 1,
        other_images: [],
        room_type: "",
        amenities: [],
        price_per_night: 0,
        bed_count: 1,
        cover_image: { secure_url: "", public_id: "" },
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'checkin' | 'checkout' | 'bookin' | 'reserve'>('checkin');
    const [selectedRoom, setSelectedRoom] = useState<ReadRoom | null>(null);

    // Initial state for booking form (using string dates for HTML date input compatibility)
    const initialBookingFormState: BookingForm = useMemo(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return {
            guest_name: "",
            phone: "",
            email: "",
            check_in: dateToISOString(today),
            check_out: dateToISOString(tomorrow),
            price_per_night: 0,
            paid_amount: 0,
            notes: "",
        } as BookingForm
    }, []);

    const [bookingForm, setBookingForm] = useState<BookingForm>(initialBookingFormState);

    // Close Drawer function (needed for dependency in useReceptionActions)
    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setSelectedRoom(null);
        setBookingForm(initialBookingFormState);
    }, [initialBookingFormState]);


    // Import submission functions from the custom hook
    const {
        handleSubmitCheckIn,
        handleSubmitCheckOut,
        handleSubmitReservation,
        handleSubmitBooking,
        nightsBetween
    } = useReceptionActions({
        bookingForm,
        selectedRoom,
        hotel_id,
        rooms,
        closeDrawer,
    });


    // Fetch hotel data on mount
    useEffect(() => {
        if (hotel_id) {
            dispatch(getHotelWithRoomsById(hotel_id));
        }
    }, [dispatch, hotel_id]);

    /* ---------- Quick Add Room handlers ---------- */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRoom((prev) => ({ ...prev, [name]: value }));
    }, []);

    const setSelectedFacilities = useCallback((values: string[]) => {
        setNewRoom((prev) => ({ ...prev, amenities: values }));
    }, []);

    const handleAddRoom = () => {
        if (!newRoom.number || !newRoom.room_type) {
            toast.error("Room number and type are required");
            return;
        }

        // Implementation of dispatch for adding new room goes here (currently commented out/demo)
        toast.info("Room addition functionality is currently a mock.");
        setNewRoom((p) => ({ ...p, number: "", room_type: "", amenities: [], price_per_night: 0 }));
    };

    /* ---------- Derived room list for reception focus ---------- */
    const visibleRooms = useMemo(() => {
        const allRooms = rooms || [];
        if (search.trim() === "") {
            const isActionNeeded = (status: string) => ["occupied", "booked"].includes(status?.toLowerCase());
            return [...allRooms].sort((a, b) => {
                const aNeedsAction = isActionNeeded(a.status || "");
                const bNeedsAction = isActionNeeded(b.status || "");
                if (aNeedsAction && !bNeedsAction) return -1;
                if (!aNeedsAction && bNeedsAction) return 1;
                return (a.number || "").localeCompare(b.number || "");
            });
        } else {
            return allRooms.filter(
                (room) =>
                    (room.number || "").includes(search) ||
                    (room.room_type || "").toLowerCase().includes(search.toLowerCase())
            );
        }
    }, [rooms, search]);

    /* ---------- Drawer handlers & utilities ---------- */
    const openDrawer = (room: ReadRoom, mode: 'checkin' | 'checkout' | 'bookin' | 'reserve') => {
        setSelectedRoom(room);
        setDrawerMode(mode);

        let formState = initialBookingFormState;
        const currentBooking = room.current_bookins as ReadCurrentBookin | undefined;

        if (mode === 'checkin') {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            formState = {
                ...initialBookingFormState,
                price_per_night: room.price_per_night || 0,
                check_in: dateToISOString(today),
                check_out: dateToISOString(tomorrow),
            };
        } else if (mode === 'checkout' || mode === 'bookin' || mode === 'reserve') {
            if (currentBooking) {
                formState = {
                    guest_name: currentBooking.guest_name || "",
                    phone: currentBooking.phone || "",
                    email: currentBooking.email || "",
                    check_in: dateToISOString(currentBooking.check_in),
                    check_out: dateToISOString(currentBooking.check_out),
                    price_per_night: room.price_per_night || 0,
                    paid_amount: currentBooking.paid_amount || 0,
                    notes: currentBooking.notes || "",
                } as BookingForm;
            } else {
                formState = {
                    ...initialBookingFormState,
                    price_per_night: room.price_per_night || 0,
                };
            }
        }

        setBookingForm(formState);
        setIsDrawerOpen(true);
    };

    const openDrawerForCheckIn = (room: ReadRoom) => openDrawer(room, 'checkin');
    const openDrawerForBooking = (room: ReadRoom) => openDrawer(room, 'bookin');
    const openDrawerForCheckOut = (room: ReadRoom) => openDrawer(room, 'checkout');
    const openDrawerForReservation = (room: ReadRoom) => openDrawer(room, 'reserve');

    const updateBookingForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? Number(value) : value;

        setBookingForm((prev) => ({ ...prev, [name]: newValue }));
    };

    /* ---------- Render Helpers & Derived State ---------- */
    // Adjusted hasMore check to use the new maxRoomsToShow
    const hasMore = visibleRooms.length > maxRoomsToShow;
    const currentRoomDetails = selectedRoom ? rooms.find(r => r.id === selectedRoom.id) : null;
    const currentBookingDates = nightsBetween(bookingForm.check_in, bookingForm.check_out);
    const estimatedTotal = currentBookingDates * (Number(bookingForm.price_per_night) || 0);

    const drawerTitle = useMemo(() => {
        const roomNumber = currentRoomDetails?.number || "N/A";
        switch (drawerMode) {
            case "checkin":
                return `Check In Guest to Room ${roomNumber}`;
            case "reserve":
                return `Reserve Room ${roomNumber}`
            case "bookin":
                return `Book Room ${roomNumber}`;
            case "checkout":
                return `Check Out Guest from Room ${roomNumber}`;
            default:
                return "Room Action";
        }
    }, [drawerMode, currentRoomDetails]);

    // Dynamic Breadcrumb Items
    const breadcrumbItems = useMemo(() => [
        { label: "Dashboard", href: "/" },
        { label: "Hotels", href: "/hotels" },
        { label: hotel_details?.name || "Hotel", href: `/hotels/${hotel_id}` },
        { label: "Reception Desk" },
    ], [hotel_details?.name, hotel_id]);

    // Loading State Gate
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-5 pt-2 grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Header */}
            <div className="col-span-12">
                <ReceptionHeader hotel_details={hotel_details} rooms={rooms} />
            </div>

            {/* Quick Add Room */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow p-5 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-gray-700">Quick Add Room</h2>
                <div className="space-y-3">
                    <input
                        name="number"
                        type="text"
                        placeholder="Room Number"
                        value={newRoom.number}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:border-blue-300"
                    />

                    <select
                        name="room_type"
                        value={newRoom.room_type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:border-blue-300"
                    >
                        <option value="">Select Room Type</option>
                        <option value="Single">Single</option>
                        <option value="Suite">Suite</option>
                        <option value="Deluxe">Deluxe</option>
                    </select>

                    <input
                        name="price_per_night"
                        type="number"
                        placeholder="Price per night"
                        value={newRoom.price_per_night === 0 ? "" : newRoom.price_per_night}
                        onChange={(e) =>
                            setNewRoom((p) => ({ ...p, price_per_night: Number(e.target.value) }))
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:border-blue-300"
                    />

                    <FacilitiesSelect
                        selected={newRoom.amenities}
                        onChange={setSelectedFacilities}
                    />

                    <button
                        onClick={handleAddRoom}
                        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
                    >
                        Add Room
                    </button>
                </div>
            </div>

            {/* Room Management */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Room Management</h2>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search rooms (number or type)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-80"
                        />
                        {/* --- NEW ROOM LIMIT SELECTOR --- */}
                        <select
                            value={roomRowLimit}
                            onChange={(e) => setRoomRowLimit(e.target.value as '1' | '2' | '3')}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="1">1 Row (Default)</option>
                            <option value="2">2 Rows</option>
                            <option value="3">3 Rows</option>
                        </select>
                    </div>

                </div>
                <div className="text-sm text-end text-gray-500 mb-4">Showing up to {maxRoomsToShow} rooms.</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {visibleRooms.length > 0 ? (
                        // Apply the dynamic slice limit here
                        visibleRooms.slice(0, maxRoomsToShow).map((room) => {
                            const status = room.status?.toLowerCase();
                            const isBooked = status === "booked";
                            const isOccupied = status === "occupied";
                            const isAvailable = status === "available";
                            const currentBooking = room.current_bookins as ReadCurrentBookin | undefined;

                            return (
                                <div
                                    key={room.id}
                                    className={`border rounded-xl p-4 flex flex-col justify-between shadow-sm transition hover:shadow-md ${isBooked
                                        ? "bg-yellow-50 border-yellow-200"
                                        : isAvailable
                                            ? "bg-green-50 border-green-200"
                                            : "bg-red-50 border-red-200"
                                        }`}
                                >
                                    <div>
                                        <p className="font-semibold text-gray-700">Room {room.number}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">{room.room_type}</p>
                                            <p className="text-sm font-bold mt-1 text-gray-700">₦{room.price_per_night?.toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs mt-1 text-gray-400">Status: <span className="font-medium text-gray-600">{room.status}</span></p>

                                        {currentBooking && (
                                            <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                                                <div className="font-semibold">Guest: {currentBooking.guest_name}</div>
                                                <div>
                                                    <span className="text-blue-500">{new Date(currentBooking.check_in).toLocaleDateString()}</span> → <span className="text-red-500">{new Date(currentBooking.check_out).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {isBooked && (
                                            <button
                                                onClick={() => openDrawerForCheckIn(room)}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer hover:bg-blue-700 flex items-center gap-1"
                                            >
                                                <DoorOpen size={14} /> Check In
                                            </button>
                                        )}

                                        {isOccupied && (
                                            <button
                                                onClick={() => openDrawerForCheckOut(room)}
                                                className="px-3 py-1 bg-red-600 text-white text-xs rounded cursor-pointer hover:bg-red-700 flex items-center gap-1"
                                            >
                                                <X size={14} /> Check Out
                                            </button>
                                        )}

                                        {isAvailable && (
                                            <div className=" flex justify-between items-center w-full">

                                                <button
                                                    onClick={() => openDrawerForBooking(room)}
                                                    className="px-3 py-1 bg-[#979207] text-white text-xs rounded cursor-pointer hover:bg-[#b5af0a] flex items-center gap-1"
                                                >
                                                    <CalendarCheck size={14} /> Book
                                                </button>
                                                <button
                                                    onClick={() => openDrawerForReservation(room)}
                                                    className="px-3 py-1 bg-[#549707] text-white text-xs rounded cursor-pointer hover:bg-[#0ab513] flex items-center gap-1"
                                                >
                                                    <CalendarArrowUpIcon size={14} /> Reserve
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-500 text-sm col-span-3 text-center italic">
                            {search.trim() !== "" ? "No matching rooms found." : "No rooms found for this hotel."}
                        </p>
                    )}
                </div>

                {/* Use hasMore to display the link */}
                {hasMore && (
                    <p className="text-center mt-4 text-blue-600 cursor-pointer hover:underline text-sm" onClick={() => navigate(`/hotels/${hotel_id}/rooms/all`)}>
                        View all rooms ({visibleRooms.length - maxRoomsToShow} more) →
                    </p>
                )}
            </div>

            {/* Drawer / Slide-over for Check-in / Check-out / Booking */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl transform transition-transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    } z-50`}
                role="dialog"
                aria-modal={isDrawerOpen}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            {drawerTitle}
                        </h3>
                        <button
                            onClick={closeDrawer}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-full"
                        >
                            <X />
                        </button>
                    </div>

                    <div className="mt-4 overflow-auto flex-grow space-y-3">
                        <label className="block text-sm text-gray-600">Guest Name <span className="text-red-500">*</span></label>
                        <input
                            name="guest_name"
                            value={bookingForm.guest_name}
                            onChange={updateBookingForm}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                            placeholder="Full name"
                            readOnly={drawerMode === 'checkout'}
                        />

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-sm text-gray-600">Phone</label>
                                <input
                                    name="phone"
                                    value={bookingForm.phone}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                    placeholder="e.g. 0800..."
                                    readOnly={drawerMode === 'checkout'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={bookingForm.email}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                    placeholder="guest@example.com"
                                    readOnly={drawerMode === 'checkout'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-sm text-gray-600">Check In <span className="text-red-500">*</span></label>
                                <input
                                    name="check_in"
                                    type="date"
                                    value={dateToISOString(bookingForm.check_in)}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                    readOnly={drawerMode === 'checkout'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Check Out <span className="text-red-500">*</span></label>
                                <input
                                    name="check_out"
                                    type="date"
                                    value={dateToISOString(bookingForm.check_out)}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                    readOnly={drawerMode === 'checkout'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-sm text-gray-600">Price / night</label>
                                <input
                                    name="price_per_night"
                                    type="number"
                                    value={bookingForm.price_per_night}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Paid amount</label>
                                <input
                                    name="paid_amount"
                                    type="number"
                                    value={bookingForm.paid_amount}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                                    readOnly={drawerMode === 'checkout'}
                                />
                            </div>
                        </div>

                        <label className="block text-sm text-gray-600 mt-3">Notes</label>
                        <textarea
                            name="notes"
                            value={bookingForm.notes}
                            onChange={updateBookingForm}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                            rows={3}
                            readOnly={drawerMode === 'checkout'}
                        />

                        {/* Price calc summary */}
                        <div className="mt-4 bg-gray-50 border rounded p-3 text-sm">
                            <div className="flex justify-between">
                                <span>Nights:</span>
                                <strong className="text-lg">{currentBookingDates}</strong>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 border-t mt-2 pt-2">
                                <span>Estimated Total:</span>
                                <strong className="text-xl">₦{estimatedTotal.toLocaleString()}</strong>
                            </div>
                            {drawerMode === 'checkout' && (
                                <div className="flex justify-between font-bold text-green-700 border-t mt-2 pt-2">
                                    <span>Amount Paid:</span>
                                    <strong className="text-xl">₦{Number(bookingForm.paid_amount).toLocaleString()}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3 flex-shrink-0">
                        {drawerMode === "checkin" && (
                            <button
                                onClick={handleSubmitCheckIn}
                                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
                            >
                                Confirm Check In
                            </button>
                        )}
                        {drawerMode === "bookin" && (
                            <button
                                onClick={handleSubmitBooking}
                                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
                            >
                                Confirm Booking
                            </button>
                        )}
                        {drawerMode === "checkout" && (
                            <button
                                onClick={handleSubmitCheckOut}
                                className="w-full bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition"
                            >
                                Confirm Check Out
                            </button>
                        )}
                        {drawerMode === "reserve" && (
                            <button
                                onClick={handleSubmitReservation}
                                className="w-full bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition"
                            >
                                Make Reservation
                            </button>
                        )}

                        <button
                            onClick={closeDrawer}
                            className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
        </div>
    );
}