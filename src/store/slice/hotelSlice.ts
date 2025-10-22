import { createAsyncThunk, createSlice, PayloadAction, isRejectedWithValue } from '@reduxjs/toolkit';
import { API_SERVER_BASE_URL } from "../../utils/utils";
import apiClient from "../../utils/axiosConfig";
import { RejectedPayload } from "../../utils/globalTypes"; // Assuming this defines { message: string, details?: any }
import { AddHotelPayload, Hotel, HotelState, Room, UpdateHotelPayload } from "../../utils/hotelTypes";



// Helper function to structure error for rejectWithValue consistency
const handleApiError = (err: any, defaultMsg: string, rejectWithValue: (value: RejectedPayload) => any): any => {
    const errorData = err.response?.data || {};
    // Try to extract a meaningful message from the error response
    const message = (errorData.detail || errorData.message || err.message || defaultMsg);

    // Ensure the rejected value is always the structured RejectedPayload
    return rejectWithValue({ message, details: errorData });
};


// Thunk to create a new hotel (POST /hotel/)
export const addHotel = createAsyncThunk<
    Hotel, // Success payload type
    AddHotelPayload, // Argument type
    { rejectValue: RejectedPayload } // Rejected payload type 
>
    (
        'hotel/addHotel',
        async (data, { rejectWithValue }) => {
            try {
                const hotel = await apiClient.post<Hotel>(`/hotel/`, data);
                return hotel.status === 200 || hotel.status === 201 ? hotel.data : handleApiError(hotel, "Failed to add hotel.", rejectWithValue);
            } catch (err) {
                return handleApiError(err, "An unknown error occurred while adding hotel.", rejectWithValue);
            }
        }
    );

// Thunk to fetch all hotels (GET /hotel/all)
export const getAllHotel = createAsyncThunk<
    Hotel[], // Success payload type
    void, // Argument type (void since it takes no args)
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/getAllHotel',
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching hotels from:", API_SERVER_BASE_URL);
            const hotel = await apiClient.get<Hotel[]>(`/hotel/all`);
            console.log("Fetched hotels:", hotel);
            return hotel.status === 200 ? hotel.data : handleApiError(hotel, "Failed to fetch hotels.", rejectWithValue);
        } catch (err) {
            console.log("error while fetching data", err);
            return handleApiError(err, "An unknown error occurred while fetching hotels.", rejectWithValue);
        }
    }
);



export const getSingleHotelById = createAsyncThunk<Hotel, string | number, { rejectValue: RejectedPayload }>(
    'hotel/getSingleHotelById',
    async (id, { rejectWithValue }) => {
        try {
            console.log("Fetching hotel from:", API_SERVER_BASE_URL);
            const hotel = await apiClient.get<Hotel>(`/hotel/${id}`);
            console.log("Fetched hotel:", hotel);
            return hotel.status === 200 ? hotel.data : handleApiError(hotel, "Failed to fetch hotel.", rejectWithValue);
        } catch (err) {
            console.log("error while fetching data", err);
            return handleApiError(err, "An unknown error occurred while fetching hotels.", rejectWithValue);
        }
    }
);


// Thunk to update a hotel (PATCH /hotel/{id}/)
export const updateHotel = createAsyncThunk<
    Hotel, // Success payload type (the updated hotel)
    { id: string | number, data: UpdateHotelPayload }, // Argument type
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/updateHotel',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            console.log(`Updating hotel ${id} with data:`, data);
            const hotel = await apiClient.patch<Hotel>(`/hotel/${id}/`, data);
            console.log("Updated hotel response:", hotel);
            return hotel.status === 200 ? hotel.data : handleApiError(hotel, "Failed to update hotel.", rejectWithValue);
        } catch (err) {
            console.log("error while updating", err)
            return handleApiError(err, "An unknown error occurred while updating hotel.", rejectWithValue);
        }
    }
);

// Thunk to delete a hotel (DELETE /hotel/{id}/)
export const deleteHotel = createAsyncThunk<
    { id: string | number }, // Success payload type (returning ID of deleted hotel)
    string | number, // Argument type (the ID)
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/deleteHotel',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/hotel/${id}/`);
            // Return an object containing the ID so we can filter it out of the state easily
            return response.status === 200 || response.status === 204 ? { id } : handleApiError(response, "Failed to delete hotel.", rejectWithValue);
        } catch (err) {
            return handleApiError(err, "An unknown error occurred while deleting hotel.", rejectWithValue);
        }
    }
);


// __________________ROOM THUNK DEFINITION_____________________

export const createRoom = createAsyncThunk<
    { data: Room }, // Success payload type (returning data object of the just save room)
    Room, // Argument type (the ID)
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/createRoom',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/hotel/${data.hotel_id}/create-room/`, data);
            // Return an object containing the ID so we can filter it out of the state easily

            return response.status === 200 || response.status === 201 ? response.data : handleApiError(response, "Failed to delete hotel.", rejectWithValue);
        } catch (err) {
            return handleApiError(err, "An unknown error occurred while deleting hotel.", rejectWithValue);
        }
    }
);





// --- 3. Slice Initialization ---

const initialState: HotelState = {
    hotels: [],
    newHotel: {
        "name": "",
        "area": {
            "country": "",
            "state_or_province": "",
            "city_or_town": "",
            "county": "",
            "street": "",
            "zip_or_postal_code": "",
            "building_name_or_suite": ""
        },
        "description": "",
        "cover_image": {
            "public_id": "",
            "secure_url": ""
        },
        "other_images": [
            {
                "public_id": "",
                "secure_url": ""
            }
        ],
        "facilities": []
    },
    selectedHotel: null,

    newRoom: {
        "room_type": "",
        "description": "",
        "facilities": [],
        "photos": [],
        "number_of_beds": 0,
        "status": "available",
        "price_per_night": 0,
        "max_occupancy": 0,
        "hotel_id": 0
    },

    isDeleting: false,
    isLoading: false,
    isUpdaing: false,
    isCreating: false,
    error: null,
};

const hotelSlice = createSlice({
    name: 'hotel',
    initialState: initialState,
    reducers: {

        clearSelectedHotel: (state) => {
            state.selectedHotel = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // --- addHotel ---
            .addCase(addHotel.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(addHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
                state.isCreating = false;
                // Since the return type is Hotel, ensure newHotel in state can handle it, 
                // or ensure you push it to hotels array if that's the intent.
                // Assuming you meant to push it to the main list:
                state.hotels.push(action.payload);
            })
            // FIX: Removed manual type annotation on 'action'
            .addCase(addHotel.rejected, (state, action) => {
                state.isCreating = false;
                // Using the safe logic to check for the structured payload
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "Oops! something went wrong";
                }
            })

            // --- getAllHotel ---
            .addCase(getAllHotel.pending, (state) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(getAllHotel.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
                state.hotels = action.payload
                state.isLoading = false
            })
            // FIX: Removed manual type annotation on 'action'
            .addCase(getAllHotel.rejected, (state, action) => {
                state.isLoading = false
                // Using the safe logic to check for the structured payload
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "Oops! something went wrong";
                }
            })

            // --- FOR DELETION (deleteHotel) ---
            .addCase(
                deleteHotel.pending, (state) => { state.isDeleting = true }
            )
            .addCase(deleteHotel.fulfilled, (state, action: PayloadAction<{ id: string | number }>) => {
                state.isDeleting = false;
                // FIX: Correctly filtering the hotels array
                state.hotels = state.hotels.filter(hotel => hotel.id !== action.payload.id);
                state.error = null; // Clear any previous error on success
            })
            .addCase(deleteHotel.rejected, (state, action) => {
                state.isDeleting = false;
                // Using the safe logic to check for the structured payload
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "Oops! something went wrong";
                }
            })

            // --- UPDATE (updateHotel) ---
            .addCase(updateHotel.pending, (state) => { state.isUpdaing = true; state.error = null; })
            .addCase(updateHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
                state.isUpdaing = false;
                // Find and replace the updated hotel in the array
                const index = state.hotels.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.hotels[index] = action.payload;
                }
            })
            .addCase(updateHotel.rejected, (state, action) => {
                state.isUpdaing = false;
                // Using the safe logic to check for the structured payload
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "Oops! failed to update hotel";
                }
            })

            // GET SINGLE HOTEL
            .addCase(getSingleHotelById.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(getSingleHotelById.fulfilled, (state, action: PayloadAction<Hotel>) => {
                state.isLoading = false;
                state.selectedHotel = action.payload;
            })
            .addCase(getSingleHotelById.rejected, (state, action) => {
                state.isLoading = false;
                // Using the safe logic to check for the structured payload
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "Oops! failed to fetch hotel";
                }
            })
    }
});

export const { clearSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
