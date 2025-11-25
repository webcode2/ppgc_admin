export type BookingStatus = 'booked' | 'checked_in' | 'checked_out' | 'cancelled';
export interface Booking {
    id: string;
    guest_name: string;
    phone: string;
    email: string;
    check_in: string; // ISO date string
    check_out: string; // ISO date string
    price_per_night: number;
    paid_amount: number;
    notes: string;
    room_id: string | number;
    hotel_id: string | number;
    total_number_of_days: number;
    total_amount: number;
    balance_payment: number;
    status: BookingStatus
}

// Arguments for asynchronous operations
export interface AddBookingArgs { data: Omit<Booking, 'id'> }
export interface UpdateBookingArgs { id: string; data: Partial<Omit<Booking, 'id'>> }
export interface DeleteBookingArgs { id: string }
export interface FetchBookingByIdArgs { id: string }


// State structure based on requirements
export interface BookingState {
    bookings: Booking[];
    viewBooking: Booking | null;
    error: any;
    isDeleting: boolean
    isLoading: boolean;
    isSubmitting: boolean,

}

export interface FormBase {
    guest_name: string;
    phone: string;
    email: string;
    check_in: string;
    check_out: string;
    paid_amount: number;
    price_per_night: number,
    notes?: string;
    status: BookingStatus
}
export interface BookingForm extends FormBase {

    total_number_of_days: number | null;
    total_amount: number
    balance_payment: number

}