import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "../store"; // Adjust path as necessary
import { ReadRoom } from "./types/hotelTypes"; // Adjust path as necessary
import { Book } from "lucide-react";
import { BookingForm } from "./types/bookingTypes";

// Utility function (moved from main file)
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

interface UseReceptionActionsProps {
    bookingForm: BookingForm;
    selectedRoom: ReadRoom | null;
    hotel_id: string | undefined;
    rooms: ReadRoom[];
    closeDrawer: () => void;
}

export const useReceptionActions = ({
    bookingForm,
    selectedRoom,
    hotel_id,
    rooms,
    closeDrawer,
}: UseReceptionActionsProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const validateBookingForm = (): boolean => {
        const { guest_name, check_in, check_out } = bookingForm;

        if (!guest_name || !check_in || !check_out) {
            toast.error("Guest name, check-in and check-out dates are required");
            return false;
        }
        if (new Date(check_out) <= new Date(check_in)) {
            toast.error("Check-out must be after check-in");
            return false;
        }
        return true;
    };

    const handleSubmitCheckIn = () => {
        if (!validateBookingForm() || !selectedRoom) return;

        // Construct booking data for dispatch
        const bookingData = {
            ...bookingForm,
            room_id: selectedRoom.id,
            hotel_id: hotel_id,
            // ... any other necessary data
        };

        // TODO: Dispatch action to perform Check-In (create booking and update room status)
        // dispatch(checkInGuest(bookingData));

        toast.success(`Checked In to Room ${selectedRoom.number}`);
        closeDrawer();
    };

    const handleSubmitCheckOut = () => {
        if (!selectedRoom) {
            toast.error("Room not selected");
            return;
        }

        const room = rooms.find((r) => r.id === selectedRoom.id);
        if (!room || !room.current_bookins) {
            toast.error("Room or current booking not found");
            return;
        }

        const nights = nightsBetween(room.current_bookins.check_in, room.current_bookins.check_out);
        const total = nights * (room.price_per_night || 0);

        // TODO: Dispatch action to perform Check-Out (clear booking and update room status)
        // dispatch(checkOutGuest(room.current_bookins.id));

        toast.success(`Checked out successfully from Room ${room.number} — total billed: ₦${total.toLocaleString()}`);
        closeDrawer();
    };

    const handleSubmitReservation = () => {
        if (!validateBookingForm() || !selectedRoom) return;

        // Construct booking data for dispatch
        const reservationData = {
            ...bookingForm,
            room_id: selectedRoom.id,
            hotel_id: hotel_id,
            // status: 'reserved'
            // ... any other necessary data
        };

        // TODO: Dispatch action to create a new Reservation (status: 'Reserved')
        // dispatch(createReservation(reservationData));

        const nights = nightsBetween(bookingForm.check_in, bookingForm.check_out);
        const total = nights * (Number(bookingForm.price_per_night) || 0);

        toast.success(`Room ${selectedRoom.number} successfully Reserved. Total: ₦${total.toLocaleString()}`);
        closeDrawer();
    };

    const handleSubmitBooking = () => {
        if (!validateBookingForm() || !selectedRoom) return;

        // Construct booking data for dispatch
        const bookingData = {
            ...bookingForm,
            room_id: selectedRoom.id,
            hotel_id: hotel_id,
        };

        // TODO: Dispatch action to create a new Booking (status: 'Booked')
        // dispatch(createBooking(bookingData));

        const nights = nightsBetween(bookingForm.check_in, bookingForm.check_out);
        const total = nights * (Number(bookingForm.price_per_night) || 0);
        bookingData.total_number_of_days = nights
        bookingData.total_amount = total
        bookingData.ballance_payment = Number(Math.max(total - bookingData.paid_amount, 0))
        bookingData.status = "booked"



        console.log(bookingData);
        toast.success(`Room ${selectedRoom.number} successfully booked. Total: ₦${total.toLocaleString()}`);
        closeDrawer();
    };

    return {
        handleSubmitCheckIn,
        handleSubmitCheckOut,
        handleSubmitReservation,
        handleSubmitBooking,
        nightsBetween // Exporting nightsBetween for Drawer summary calculation
    };
};