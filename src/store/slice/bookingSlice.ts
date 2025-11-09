import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// Assuming apiClient is correctly configured for API calls
import apiClient from "../../utils/axiosConfig";
import { AddBookingArgs, Booking, BookingState, DeleteBookingArgs, FetchBookingByIdArgs, UpdateBookingArgs } from "../../utils/types/bookingTypes";
import { apiRoute } from "../../utils/utils";

// --- 2. ASYNC THUNKS (Data Operations) ---

// Helper for standardized API response handling
const handleBookingResponse = (response: any, rejectWithValue: any, successMessage: string) => {
    if (response.status === 200 || response.status === 201) {
        console.log(successMessage, response.data);
        return response.data;
    } else {
        return rejectWithValue(response.statusText || "Something went wrong.");
    }
};

const handleApiError = (err: any, rejectWithValue: any) => {
    const errorMsg = err.response?.data || err.message || "An unknown error occurred.";
    console.error("API Error:", errorMsg);
    return rejectWithValue(errorMsg);
};


export const addBooking = createAsyncThunk<
    Booking, // Success payload is the created booking object
    AddBookingArgs, // Argument includes data needed for booking
    { rejectValue: any }
>(
    'booking/addBooking',
    async ({ data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(apiRoute.createBookings.route, data);
            return handleBookingResponse(response, rejectWithValue, "Booking created successfully.");
        } catch (err) {
            return handleApiError(err, rejectWithValue);
        }
    }
);

export const updateBooking = createAsyncThunk<
    Booking, // Success payload is the updated booking object
    UpdateBookingArgs, // Argument includes booking ID and partial data
    { rejectValue: any }
>(
    'booking/updateBooking',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/bookings/${id}/`, data);
            return handleBookingResponse(response, rejectWithValue, "Booking updated successfully.");
        } catch (err) {
            return handleApiError(err, rejectWithValue);
        }
    }
);


export const deleteBooking = createAsyncThunk<
    { id: string }, // Success payload only needs the ID to remove from state
    DeleteBookingArgs, // Argument is the booking ID
    { rejectValue: any }
>(
    'booking/deleteBooking',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/bookings/${id}/`);
            // We return the ID so the reducer knows which item to remove
            if (response.status === 204 || response.status === 200) {
                console.log("Booking deleted successfully.");
                return { id };
            } else {
                return rejectWithValue("Failed to delete booking.");
            }
        } catch (err) {
            return handleApiError(err, rejectWithValue);
        }
    }
);


export const fetchBookings = createAsyncThunk<
    Booking[], // Success payload is an array of bookings
    void, // No arguments needed
    { rejectValue: any }
>(
    'booking/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/bookings/all/`);
            return handleBookingResponse(response, rejectWithValue, "Bookings fetched successfully.");
        } catch (err) {
            return handleApiError(err, rejectWithValue);
        }
    }
);



// --- NEW THUNK TO FETCH SINGLE BOOKING ---
export const fetchBookingById = createAsyncThunk<
    Booking,
    FetchBookingByIdArgs,
    { rejectValue: any }
>(
    'booking/fetchBookingById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/bookings/${id}/`);
            return handleBookingResponse(response, rejectWithValue, "Booking fetched successfully.");
        } catch (err) {
            return handleApiError(err, rejectWithValue);
        }
    }
);

// --- 3. INITIAL STATE & SLICE ---

const initialState: BookingState = {
    bookings: [],
    viewBooking: null,
    isLoading: false,
    error: null,
    isSubmitting: false,

};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null;
            state.isLoading = false;
        },
        setViewBooking: (state, action: PayloadAction<Booking | null>) => {
            state.viewBooking = action.payload;
        },
    },
    extraReducers: (builder) => {
        // --- Shared Pending Logic ---
        const handlePending = (state: BookingState) => {
            state.isLoading = true;
            state.error = null;
        };
        const handleRejected = (state: BookingState, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
        };
        const handleFulfilled = (state: BookingState) => {
            state.isLoading = false;
            state.isSubmitting = false;
        }

        // --- Add Booking ---
        builder.addCase(addBooking.pending, handlePending)
            .addCase(addBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                state.isLoading = false;
                state.bookings.push(action.payload); // Add new booking to the array
            })
            .addCase(addBooking.rejected, handleRejected);

        // --- Update Booking ---
        builder.addCase(updateBooking.pending, handlePending)
            .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                state.isLoading = false;
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload; // Replace the old booking with the updated one
                }
            })
            .addCase(updateBooking.rejected, handleRejected);

        // --- Delete Booking ---
        builder.addCase(deleteBooking.pending, handlePending)
            .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
                state.isLoading = false;
                state.bookings = state.bookings.filter(b => b.id !== action.payload.id); // Remove the deleted booking
            })
            .addCase(deleteBooking.rejected, handleRejected);

        // --- Fetch Bookings ---
        builder.addCase(fetchBookings.pending, handlePending)
            .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
                state.isLoading = false;
                state.bookings = action.payload; // Replace the entire list
            })
            .addCase(fetchBookings.rejected, handleRejected);

        builder.addCase(fetchBookingById.pending, handlePending)
            .addCase(fetchBookingById.fulfilled, (state, action: PayloadAction<Booking>) => {
                handleFulfilled(state);
                state.viewBooking = action.payload;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                handleRejected(state, action);
                state.viewBooking = null;
            });


    }
});

export const { clearBookingError, setViewBooking } = bookingSlice.actions;
export default bookingSlice.reducer;