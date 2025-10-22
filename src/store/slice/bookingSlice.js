import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from "../../utils/axiosConfig";



// Thunk to fetch data from API
export const addBooking = createAsyncThunk(
    'booking/addBook',
    async (data, { rejectWithValue }) => {
        console.log(data)
        try {
            const booking = await apiClient.post(`/bookings/`, data)
            console.log(booking)
            return booking.status === 200 ? booking.data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateBooking = createAsyncThunk(
    'booking/updateBook',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const booking = await apiClient.patch(`/bookings/${id}/`, data)
            console.log(booking)
            return booking.status === 200 ? booking.data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data);
        }
    }
);


export const deleteBooking = createAsyncThunk(
    'booking/deleteBook',
    async (id, { rejectWithValue }) => {
        try {
            const booking = await apiClient.delete(`/bookings/${id}/`)
            console.log(booking)
            return booking.status === 200 ? booking.data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data);
        }
    }
);


export const fetchBookings = createAsyncThunk(
    'booking/fetchBooks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/bookings/`)
            return response.status === 200 ? response.data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data);
        }
    }
);






// ASYNC THUNK ENDs HERE

const initialState = {
    newBooking: {
        price: 0,
        name: "",
        description: "",
        review: "",
        bedrooms: 0,
        photos: [],
        facilities: [],
    },
    isLoading: false,
    error: null,

}

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null
            state.isLoading = false
        },


    },

    extraReducers: (builder) => {
        builder.addCase(addBooking.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        }).addCase(addBooking.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newBooking = action.payload;
        }).addCase(addBooking.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

    }
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
