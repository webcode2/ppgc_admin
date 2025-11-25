import { createAsyncThunk, createSlice, PayloadAction, isRejectedWithValue } from '@reduxjs/toolkit';
import { API_SERVER_BASE_URL } from "../../utils/utils";
import apiClient from "../../utils/axiosConfig";
import { RejectedPayload } from "../../utils/types/globalTypes"; // Assuming this defines { message: string, details?: any }
import { AddHotelPayload, GetRoomArgs, Hotel, HotelState, ReadHotelWithRooms, ReadRoom, ReadRoomFull, Room, UpdateHotelPayload } from "../../utils/types/hotelTypes";
import { toast } from "react-toastify";


interface CreateRoomArgs {
    data: Room;
    hotel_id: string;
}

interface UpdateRoomArgs extends CreateRoomArgs {
    room_id: string
}


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
    CreateRoomArgs, // Argument type (the ID)
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/createRoom',
    async ({ data, hotel_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/hotel/${hotel_id}/create-room/`, data);
            // Return an object containing the ID so we can filter it out of the state easily

            if (response.status === 200 || response.status === 201) {
                toast.success("Room created successfully")
                return response.data
            } else { handleApiError(response, "Failed to delete hotel.", rejectWithValue) };
        } catch (err) {
            return handleApiError(err, "An unknown error occurred while deleting hotel.", rejectWithValue);
        }
    }
);



// 2. UPDATE ROOM
export const updateRoom = createAsyncThunk<
    { room: ReadRoom }, // Success payload type (returning the updated room object)
    UpdateRoomArgs, // Argument type (data and room ID)
    { rejectValue: RejectedPayload } // Rejected payload type
>(
    'hotel/updateRoom',
    async ({ data, room_id }, { rejectWithValue }) => {

        console.log(data, room_id);
        try {
            // Use PUT/PATCH for updates, targeting the specific room ID
            const response = await apiClient.patch(`hotel/rooms/${room_id}/`, data);

            if (response.status === 200) {
                toast.success("Room updated successfully");
                return { room: response.data }; // Return the updated room object
            } else {
                return handleApiError(response, "Failed to update room.", rejectWithValue);
            }
        } catch (err) {
            return handleApiError(err, "An unknown error occurred while updating room.", rejectWithValue);
        }
    }
);


// 3 GET ROOM


// 3. GET ROOM (New Thunk)
export const getRoom = createAsyncThunk<
    { room: ReadRoom }, // Success payload is the fetched room object
    GetRoomArgs, // Argument is the room ID
    { rejectValue: RejectedPayload }
>(
    'hotel/getRoom',
    async ({ room_id }, { rejectWithValue }) => {
        try {
            // Use GET, targeting the specific room ID
            const response = await apiClient.get(`hotel/rooms/${room_id}/`);

            if (response.status === 200) {
                // The API response data likely contains the room object directly
                return { room: response.data };
            } else {
                return handleApiError(response, "Failed to fetch room details.", rejectWithValue);
            }
        } catch (err) {
            return handleApiError(err, "An unknown error occurred while fetching room.", rejectWithValue);
        }
    }
);



// thunnk to get hotel with rooms for receiptionist

export const getHotelWithRoomsById = createAsyncThunk<ReadHotelWithRooms, string | number, { rejectValue: RejectedPayload }>(
    'hotel/getHotelById',
    async (hotel_id, { rejectWithValue }) => {

        const transformRoomResponse = (raw: ReadRoomFull): ReadRoom => ({
            id: raw.id,
            room_type: raw.room_type,
            number: raw.room_number,
            status: raw.status,
            price_per_night: raw.price_per_night,
            current_bookins: null, // no booking data in the payload
        });

        const transformRoomList = (data: ReadRoomFull[]): ReadRoom[] => data.map(transformRoomResponse);


        try {
            const [hotelResult, roomsResult] = await Promise.allSettled([
                apiClient.get<Hotel>(`/hotel/${hotel_id}/`),
                apiClient.get<ReadRoomFull[]>(`/hotel/${hotel_id}/rooms/`),
            ]);

            // const transformList = transformRoomList(roomsResult);

            const hotelData: Hotel = hotelResult.status === 'fulfilled' ? hotelResult.value.data : {
                area: {
                    building_name_or_suite: "", city_or_town: "", country: "",
                    county: "", state_or_province: "", street: "", zip_or_postal_code: ""
                },
                cover_image: { public_id: "", secure_url: "" },
                description: "", id: 0, name: "", other_images: [], facilities: []
            };
            const roomsData = roomsResult.status === 'fulfilled' ? transformRoomList(roomsResult.value.data) : []
            console.log({
                ...hotelData,
                rooms: roomsData,
            })

            return {
                ...hotelData,
                rooms: roomsData,
            };


            // return transformRoomList.length > 0 ? transformList : handleApiError(transformList, "Failed to fetch hotel.", rejectWithValue);
        } catch (err) {
            console.log("error while fetching data", err);
            return handleApiError(err, "An unknown error occurred while fetching hotels.", rejectWithValue);
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
    selectedHotel: null, // for editing/  updating
    viewHotelWithRooms: null,


    selectedRoom: null,
    newRoom: {
        "room_type": "",
        "description": "",
        "price_per_night": 0,
        "max_occupancy": 0,
        "amenities": [],
        bed_count: 0,
        cover_image: { public_id: "", secure_url: "" },
        other_images: [],
        room_number: "",
    },

    rooms: [
        {
            id: 1,
            number: "101",
            room_type: "Single",
            status: "Available",
            price_per_night: 4000,
            current_bookins: null,
        },
        {
            id: 2,
            number: "102",
            room_type: "Suite",
            status: "Booked",
            price_per_night: 12000,
            current_bookins: null,
        },
        {
            id: 3,
            number: "103",
            room_type: "Single",
            status: "Available",
            price_per_night: 4000,
            current_bookins: null,
        },
        {
            id: 4,
            number: "104",
            room_type: "Deluxe",
            status: "Occupied",
            price_per_night: 8000,
            current_bookins: {
                guest_name: "Jane Doe",
                phone: "08001234567",
                email: "jane@example.com",
                check_in: new Date("2025-10-30"),
                check_out: new Date("2025-11-03"),
                paid_amount: 24000,
                notes: "VIP guest",
            },
        },
    ],


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
        const handlePending = (state: HotelState) => {
            state.isLoading = true;
            state.error = null;
        };
        const handleFulfilled = (state: HotelState) => {
            state.isLoading = false;
        };
        const handleRejected = (state: HotelState, action: PayloadAction<RejectedPayload | undefined>) => {
            state.isLoading = false;
            state.error = action.payload?.details || { message: "Unknown error occurred" };
        };
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

        builder
            .addCase(getRoom.pending, handlePending)
            .addCase(getRoom.fulfilled, (state, action: PayloadAction<{ room: ReadRoom }>) => {
                handleFulfilled(state);
                state.selectedRoom = action.payload.room; // Store the fetched single room
            })
            .addCase(getRoom.rejected, handleRejected);

            // GET SINGLE HOTEL
        builder.addCase(getSingleHotelById.pending, (state) => { state.isLoading = true; state.error = null; })
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




            // Rooms reducer functions
            .addCase(
                getHotelWithRoomsById.pending,
                (state) => { state.isLoading = true; state.error = null; }
            )
            .addCase(getHotelWithRoomsById.fulfilled, (state, action: PayloadAction<ReadHotelWithRooms>) => {
                state.isLoading = false;
                state.viewHotelWithRooms = action.payload;
            }

            ).addCase(getHotelWithRoomsById.rejected, (state, action) => {
                state.isLoading = false;
                // trigger a reload/ errror handling
            })



    }
});

export const { clearSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
