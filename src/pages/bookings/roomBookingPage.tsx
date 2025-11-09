import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, CalendarCheck, DoorOpen, BookOpen, Clock, User, DollarSign, Loader2 } from 'lucide-react';
import { BookingForm, UpdateBookingArgs } from "../../utils/types/bookingTypes";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { addBooking, fetchBookingById, updateBooking } from "../../store/slice/bookingSlice";
import { getRoom } from "../../store/slice/hotelSlice";

// --- ASSUMED/MOCKED TYPES ---
type PageMode = 'create_booking' | 'edit_booking' | 'checkin' | 'checkout';

// Utility function to format date to YYYY-MM-DD string (for date input value)
const dateToISOString = (d: string | Date): string => {
    try {
        const date = typeof d === 'string' ? new Date(d) : d;
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

// Utility function to calculate nights
const nightsBetween = (start: string | Date, end: string | Date): number => {
    try {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        if (isNaN(s) || isNaN(e) || e < s) return 0;
        const diff = e - s;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    } catch (error) {
        return 0;
    }
};


// --- CUSTOM COLORS (Aliased for clarity) ---
const COLOR_PRIMARY = '#f3eb0b'; // Bright Yellow/Gold
const COLOR_SECONDARY = '#9f9a08'; // Darker Gold/Olive
const COLOR_ACTION = '#1e90ff'; // Blue for Check-in
const COLOR_SUCCESS = '#22c55e'; // Green for Check-out
const COLOR_BOOKING = '#6366f1'; // Indigo for Booking


const initialFormState: BookingForm = {
    guest_name: "", phone: "", email: "", notes: "", paid_amount: 0, price_per_night: 0,
    check_in: dateToISOString(new Date()),
    check_out: dateToISOString(new Date(new Date().setDate(new Date().getDate() + 1))),
    ballance_payment: 0, status: "booked", total_amount: 0, total_number_of_days: 0
};

export default function RoomBookingPage() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams<{ hotel_id: string, room_id: string, booking_id: string }>();
    const { hotel_id, room_id, booking_id } = params;
    const navigate = useNavigate();





    // --- REDUX STATE ---
    const { viewBooking, isLoading, isSubmitting, error, bookings } = useSelector((state: RootState) => state.booking);
    const { selectedRoom, } = useSelector((state: RootState) => state.hotel);

    // --- LOCAL STATE ---
    const isEditingExistingBooking = !!booking_id;
    const initialMode: PageMode = isEditingExistingBooking ? 'edit_booking' : 'create_booking';

    const [pageMode, setPageMode] = useState<PageMode>(initialMode);
    const [bookingForm, setBookingForm] = useState<BookingForm>(initialFormState);


    // --- EFFECTS ---
    // fetch current room if it is a new booking 


    // 1. Fetch existing booking data on load if in edit mode

    useEffect(() => {
        if (room_id) {
            dispatch(getRoom({ room_id: room_id }));
        }
        else if (isEditingExistingBooking && booking_id) {
            dispatch(fetchBookingById({ id: booking_id }));
        } else {
            // Clear viewBooking state if creating a new one
            dispatch({ type: 'booking/setViewBooking', payload: null });
        }
    }, [booking_id, isEditingExistingBooking, room_id, dispatch]);

    // 2. Sync local form state with fetched Redux data (viewBooking)
    useEffect(() => {
        if (isEditingExistingBooking && viewBooking && viewBooking.id === booking_id) {
            setBookingForm({
                ballance_payment: viewBooking.ballance_payment, status: "booked"
                , total_amount: viewBooking.total_amount,
                total_number_of_days: viewBooking.total_number_of_days,
                guest_name: viewBooking.guest_name,
                phone: viewBooking.phone,
                email: viewBooking.email,
                check_in: dateToISOString(viewBooking.check_in),
                check_out: dateToISOString(viewBooking.check_out),
                price_per_night: viewBooking.price_per_night,
                paid_amount: viewBooking.paid_amount,
                notes: viewBooking.notes,
            });
            // Auto-set mode based on status if needed, or keep to 'edit'
            if (viewBooking.status === 'checked_in') setPageMode('checkout');
        } else if (!isEditingExistingBooking && room_id&&selectedRoom) {
            setBookingForm(
                {...initailFormState,}
            );


        } else if (!isEditingExistingBooking) {
            setBookingForm(initialFormState);
        }
    }, [viewBooking, isEditingExistingBooking, booking_id]);


    // --- CALCULATED VALUES ---
    const isReadOnly = pageMode === 'checkout' || pageMode === 'checkin';
    const nights = useMemo(() => nightsBetween(bookingForm.check_in, bookingForm.check_out), [bookingForm.check_in, bookingForm.check_out]);
    const estimatedTotal = useMemo(() => nights * (Number(bookingForm.price_per_night) || 0), [nights, bookingForm.price_per_night]);

    const balanceDue = estimatedTotal - Number(bookingForm.paid_amount);

    // --- HANDLERS ---

    const updateBookingForm = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = (type === 'number' && e.target instanceof HTMLInputElement) ? Number(value) : value;
        setBookingForm((prev) => ({ ...prev, [name]: newValue }));
    }, []);

    const validateForm = (form: BookingForm) => {
        if (!form.guest_name || nights <= 0) {
            toast.error("Guest name and valid check-in/out dates are required.");
            return false;
        }
        return true;
    }

    const handleSubmit = useCallback((mode: PageMode) => async () => {
        if (!validateForm(bookingForm) || isSubmitting) return;

        let payload: any = { ...bookingForm, room_id, hotel_id };
        let action;
        let successMessage = "";

        switch (mode) {
            case 'create_booking':
                payload.status = 'booked';
                action = addBooking({ data: payload });
                successMessage = "Booking created successfully!";
                break;
            case 'edit_booking':
                if (!booking_id) return;

                // 1. Construct the inner 'data' payload (Partial<Omit<Booking, "id">>)
                const dataPayload = {
                    ...bookingForm,
                    // Calculate derived fields and explicitly include them
                    total_number_of_days: nights,
                    total_amount: estimatedTotal,
                    ballance_payment: estimatedTotal - bookingForm.paid_amount,
                    status: viewBooking?.status || "booked", // Preserve current status unless explicitly changing it
                };

                // 2. Dispatch the action with the correct signature: { id, data }
                action = updateBooking({
                    id: booking_id,
                    data: dataPayload // Pass the constructed data object here
                });
                successMessage = "Booking updated successfully.";
                break;
            case 'checkin':
                if (!booking_id) return;
                action = updateBooking({ id: booking_id, data: { status: 'checked_in' } });
                successMessage = "Guest checked in successfully!";
                break;
            case 'checkout':
                if (!booking_id) return;
                // Final payment calculation/status update on checkout
                action = updateBooking({ id: booking_id, data: { status: 'checked_out', paid_amount: estimatedTotal } });
                successMessage = `Guest checked out! Total charged: ₦${estimatedTotal.toLocaleString()}`;
                break;
        }

        const result = await dispatch(action);

        if (result.type.endsWith('/fulfilled')) {
            toast.success(successMessage);
            // Navigate back to the room list or reception after action
            navigate(`/hotel/${hotel_id}/rooms`);
        } else if (result.type.endsWith('/rejected')) {
            toast.error(`Action Failed: ${result.payload?.message || "An unknown error occurred."}`);
        }
    }, [bookingForm, isSubmitting, dispatch, hotel_id, room_id, booking_id, estimatedTotal, viewBooking, navigate, nights]);


    // --- RENDER HELPERS ---

    const pageTitle = useMemo(() => {
        const roomRef = `Room ${room_id} @ Hotel ${hotel_id}`;
        if (viewBooking) {
            switch (pageMode) {
                case 'create_booking': return `Create New Booking for ${roomRef}`;
                case 'edit_booking': return `Edit Booking ${booking_id} for ${roomRef}`;
                case 'checkin': return `Check-In Guest: ${viewBooking.guest_name}`;
                case 'checkout': return `Process Check-Out: ${viewBooking.guest_name}`;
                default: return `Manage Booking`;
            }
        }
        return isEditingExistingBooking ? 'Loading Booking Details...' : `Create Booking for ${roomRef}`;
    }, [pageMode, room_id, hotel_id, booking_id, viewBooking, isEditingExistingBooking]);

    const getPrimaryActionButton = () => {
        const baseClass = `w-full text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 flex items-center justify-center`;
        const action = handleSubmit(pageMode);

        if (isSubmitting) {
            return (
                <button disabled className={baseClass} style={{ backgroundColor: COLOR_SECONDARY }}>
                    <Loader2 size={18} className='mr-2 animate-spin' /> Processing...
                </button>
            );
        }

        switch (pageMode) {
            case 'create_booking':
                return (
                    <button onClick={action} className={baseClass} style={{ backgroundColor: COLOR_BOOKING }}>
                        <CalendarCheck size={18} className='mr-2' /> Save New Booking
                    </button>
                );
            case 'edit_booking':
                return (
                    <button onClick={action} className={baseClass} style={{ backgroundColor: COLOR_SECONDARY }}>
                        <User size={18} className='mr-2' /> Update Booking
                    </button>
                );
            case 'checkin':
                return (
                    <button onClick={action} className={baseClass} style={{ backgroundColor: COLOR_ACTION }}>
                        <DoorOpen size={18} className='mr-2' /> Confirm Check In
                    </button>
                );
            case 'checkout':
                return (
                    <button onClick={action} className={baseClass} style={{ backgroundColor: COLOR_SUCCESS }}>
                        <DollarSign size={18} className='mr-2' /> Confirm Check Out
                    </button>
                );
            default: return null;
        }
    };

    const renderModeToggles = () => {
        if (!isEditingExistingBooking || !viewBooking) {
            // Only show creation button if not editing
            return (
                <button
                    onClick={() => setPageMode('create_booking')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${pageMode === 'create_booking' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <CalendarCheck size={14} className='inline mr-1' /> Create
                </button>
            );
        }

        const currentStatus = viewBooking.status;

        return (
            <>
                {/* Edit Mode (Available if not checked out/cancelled) */}
                {currentStatus !== 'checked_out' && currentStatus !== 'cancelled' && (
                    <button
                        onClick={() => setPageMode('edit_booking')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${pageMode === 'edit_booking' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <User size={14} className='inline mr-1' /> Edit Details
                    </button>
                )}

                {/* Check-In Mode (Only if booked) */}
                {currentStatus === 'booked' && (
                    <button
                        onClick={() => setPageMode('checkin')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${pageMode === 'checkin' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <DoorOpen size={14} className='inline mr-1' /> Check-In
                    </button>
                )}

                {/* Check-Out Mode (Only if checked_in) */}
                {currentStatus === 'checked_in' && (
                    <button
                        onClick={() => setPageMode('checkout')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${pageMode === 'checkout' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <X size={14} className='inline mr-1' /> Check-Out
                    </button>
                )}
            </>
        );
    };

    if (isLoading) {
        return <div className="p-10 text-center text-gray-500 flex items-center justify-center min-h-screen">Loading Booking...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 min-h-screen">Error: {error.message || "Failed to load booking details."}</div>;
    }


    return (
        <div className="p-5 pt-2">
            <div className=" mx-auto bg-white rounded-2xl shadow-xl p-6">

                {/* Header */}
                <header className="mb-8 border-b pb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{pageTitle}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {viewBooking?.status ? `Status: ${viewBooking.status.toUpperCase()} | ` : ''}
                            Hotel ID: {hotel_id} | Room ID: {room_id}
                        </p>
                    </div>

                    {/* Mode Toggles */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {renderModeToggles()}
                    </div>
                </header>

                {/* Form Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Column 1 & 2: Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700 border-l-4 pl-3 border-gray-400">Guest Details</h2>

                        <label className="block text-sm text-gray-600 font-medium">Guest Name <span className="text-red-500">*</span></label>
                        <input
                            name="guest_name"
                            value={bookingForm.guest_name}
                            onChange={updateBookingForm}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                            placeholder="Full name"
                            readOnly={isReadOnly}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Phone</label>
                                <input
                                    name="phone"
                                    value={bookingForm.phone}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    placeholder="e.g. 0800..."
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={bookingForm.email}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    placeholder="guest@example.com"
                                    readOnly={isReadOnly}
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700 border-l-4 pl-3 border-gray-400 pt-4">Stay & Pricing Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Check In <span className="text-red-500">*</span></label>
                                <input
                                    name="check_in"
                                    type="date"
                                    value={dateToISOString(bookingForm.check_in)}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    readOnly={isReadOnly && pageMode !== 'checkin'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Check Out <span className="text-red-500">*</span></label>
                                <input
                                    name="check_out"
                                    type="date"
                                    value={dateToISOString(bookingForm.check_out)}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    readOnly={isReadOnly && pageMode !== 'checkin'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Price / night</label>
                                <input
                                    name="price_per_night"
                                    type="number"
                                    value={bookingForm.price_per_night}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    readOnly={pageMode === 'checkin' || pageMode === 'checkout'} />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 font-medium">Paid amount</label>
                                <input
                                    name="paid_amount"
                                    type="number"
                                    value={bookingForm.paid_amount}
                                    onChange={updateBookingForm}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                                    readOnly={pageMode === 'checkin' || pageMode === 'checkout'} />
                            </div>
                        </div>

                        <label className="block text-sm text-gray-600 font-medium pt-4">Notes</label>
                        <textarea
                            name="notes"
                            value={bookingForm.notes}
                            onChange={updateBookingForm}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-opacity-50 focus:ring-yellow-500"
                            rows={3}
                            readOnly={pageMode === 'checkin' || pageMode === 'checkout'} />
                    </div>

                    {/* Column 3: Summary and Actions */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Summary Card */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-inner">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                                <BookOpen size={20} className='mr-2' style={{ color: COLOR_SECONDARY }} />
                                Booking Summary
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-1 text-gray-600">
                                    <span className="flex items-center"><Clock size={16} className='mr-2 text-gray-400' /> Nights:</span>
                                    <strong className="text-base text-gray-800">{nights}</strong>
                                </div>
                                <div className="flex justify-between border-b pb-1 text-gray-600">
                                    <span className="flex items-center"><DollarSign size={16} className='mr-2 text-gray-400' /> Price/Night:</span>
                                    <strong className="text-base text-gray-800">₦{Number(bookingForm.price_per_night).toLocaleString()}</strong>
                                </div>
                            </div>

                            <div className="flex justify-between font-bold text-gray-800 border-t pt-3 mt-3">
                                <span>TOTAL ESTIMATED:</span>
                                <strong className="text-2xl" style={{ color: COLOR_SECONDARY }}>₦{estimatedTotal.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 pt-2">
                                <span>Amount Paid:</span>
                                <strong className="text-xl text-green-600">₦{Number(bookingForm.paid_amount).toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t mt-2">
                                <span>BALANCE DUE:</span>
                                <strong className={`text-xl ${balanceDue > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ₦{Math.abs(balanceDue).toLocaleString()}
                                </strong>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 space-y-3">
                            {getPrimaryActionButton()}

                            <button
                                onClick={() => navigate(`/hotel/${hotel_id}/rooms`)}
                                className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel / Back to Room List
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}