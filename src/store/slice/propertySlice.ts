import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiClient from "../../utils/axiosConfig";
import { ApiError, Property, PropertyPayload, UpdatePropertyPayload } from "../../utils/types/propertiesType";







// Define the complete slice state
interface PropertyState {
    properties: Property[];
    newProperty: Property;

    propertyTypes: string[]
    isDeleting: boolean;
    isLoading: boolean;
    isCreating: boolean;
    isUploading: boolean
    selectedProperty: Property | null
    error: string | null;
    is_sold?: boolean
    is_in_negotiation?: boolean

}


// INITIAL PROPERTY STATE

const initialState: PropertyState = {
    properties: [],
    newProperty: {
        other_images: [],
        id: "",
        price: 0,
        features: [],
        cover_image: { secure_url: "", public_id: "" },
        title: "",
        type: "",
        description: "",
        area: { building_name_or_suite: "", city_or_town: "", country: "", county: "", state_or_province: "", street: "", zip_or_postal_code: "" },
        availability: "available"
        
    },
    selectedProperty: null,
    isDeleting: false,
    isLoading: false,
    isUploading: false,
    isCreating: false,
    error: null,
    propertyTypes: ['Landed Property', 'Apartment', 'Hotel', 'Guest House', 'Hostel', 'Room'],
    is_in_negotiation: false,
    is_sold: false

}

const propertySlice = createSlice({
    name: 'property',
    initialState: initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
                state.properties = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch properties';
            })
            .addCase(createProperty.pending, (state) => {
                state.isLoading = true;

            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.isLoading = false

            })
            .addCase(createProperty.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload.message
            })
            // Fetch Property by ID
            .addCase(fetchPropertyById.pending, (state: PropertyState) => {
                state.isLoading = true;
                state.error = null;
            })
            // Handle the fulfilled state: clear loading flag, set the fetched property, clear error
            .addCase(fetchPropertyById.fulfilled, (state: PropertyState, action: PayloadAction<Property>) => {
                state.isLoading = false;
                state.selectedProperty = action.payload;
            })
            // Handle the rejected state: clear loading flag, store the error, clear the viewProperty (optional, but safe)
            .addCase(fetchPropertyById.rejected, (state: PropertyState, action: PayloadAction<ApiError | undefined>) => {
                state.isLoading = false;
                state.error = action.payload || { message: "Failed to load property details due to unknown error." };
                state.selectedProperty = null;
            })


    }
});




// --- Async Thunks for Property Management ---

/**
 * Thunk to create a new property (POST /properties/)
 * @param {PropertyPayload} data - The data for the new property.
 */
export const createProperty = createAsyncThunk<Property, // 1. Return type on success
    PropertyPayload, // 2. Argument type (data)
    { rejectValue: ApiError } // 3. Thunk API config (Error type on failure)
>(
    'properties/createProperty',
    async (data, { rejectWithValue }) => {
        try {
            // Using a simple object destructuring to simulate required properties
            if (!data.title || !data.area.state_or_province) {
                return rejectWithValue("Name and area are required fields.");
            }
            console.log('Sending creation request with data:', data);
            const response = await apiClient.post<Property>(`/properties/`, data);

            // Assuming 201 Created or 200 OK for successful creation
            if (response.status === 200 || response.status === 201) {
                const property = response.data;
                console.log('Property created:', property);
                return property;
            } else {
                console.error('Unexpected response status:', response);
                // If status is OK but logic indicates failure
                return rejectWithValue("Failed to create property.");
            }
        } catch (err: any) {
            console.log('Error creating property:', err);
            // Handling common error structure from Axios/API client
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
/**
 * Thunk to fetch all properties ( /pGETroperties/)
 * @param {object} [filters] - Optional query parameters for filtering/pagination.
 */
export const fetchProperties = createAsyncThunk<Property[], object | undefined, { rejectValue: ApiError }>(
    'properties/fetchProperties', async (filters, { rejectWithValue }) => {
        try {
            // Construct query string if filters are provided
            const queryString = filters ? '?' + new URLSearchParams(filters as Record<string, string>).toString() : '';
            console.log(`Fetching properties with filters: ${queryString}`);
            const response = await apiClient.get<Property[]>(`/properties/${queryString}`);
            console.log(response)

            if (response.status === 200) {
                const properties = response.data;
                return properties;
            } else {
                return rejectWithValue("Failed to fetch properties.");
            }
        } catch (err: any) {
            console.error('Error fetching properties:', err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const fetchPropertyById = createAsyncThunk<Property, string | number, { rejectValue: ApiError }>(
    'properties/fetchPropertyById', async (propertyId, { rejectWithValue }) => {
        try {
            console.log('Fetching property by ID:', propertyId);
            const response = await apiClient.get<Property>(`/properties/${propertyId}`);
            console.log(response)

            if (response.status === 200) {
                const property = response.data;
                return property;
            } else {
                return rejectWithValue(`Property with ID ${propertyId} not found.`);
            }
        } catch (err: any) {
            console.error('Error fetching property by ID:', err);
            return rejectWithValue(err.message || err.response?.data);
        }
    }
);


export const updateProperty = createAsyncThunk<
    Property,
    { id: number, data: UpdatePropertyPayload },
    { rejectValue: ApiError }
>(
    'properties/updateProperty',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            console.log(`Updating property ${id} with data:`, data);

            // Check if data is not empty for a meaningful update
            if (Object.keys(data).length === 0) {
                return rejectWithValue("Update payload cannot be empty.");
            }

            // Assuming the API uses PUT for full replacement or PATCH for partial update
            const response = await apiClient.put<Property>(`/properties/${id}`, data);

            if (response.status === 200) {
                const updatedProperty = response.data;
                console.log('Property updated:', updatedProperty);
                return updatedProperty;
            } else {
                return rejectWithValue(`Failed to update property ${id}.`);
            }
        } catch (err: any) {
            console.error('Error updating property:', err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteProperty = createAsyncThunk<
    number, // Success Payload Type: NUMBER (must be adhered to)
    string | number,
    { rejectValue: any } // Changed ApiError to 'any' for mock flexibility
>(
    'properties/deleteProperty',
    async (
        propertyId,
        { rejectWithValue }) => {
        try {
            console.log('Deleting property by ID:', propertyId);
            // In a real app, ensure the URL path is correct for deletion
            // const response = await apiClient.delete(`/properties/${propertyId}`); 

            // Mocking a successful response for demonstration
            const response = { status: 200 }; 

            // Assuming 204 No Content or 200 OK for successful deletion
            if (response.status === 204 || response.status === 200) {
                console.log(`Property ${propertyId} deleted successfully.`);

                // FIX: Convert propertyId to a number to match the defined success payload type (number)
                return Number(propertyId);
            } else {
                // This branch is now unreachable due to mock, but keep error handling structure
                return rejectWithValue(`Failed to delete property ${propertyId}.`);
            }
        } catch (err: any) {
            console.error('Error deleting property:', err);
            // FIX: Ensure you handle the case where err.response or err.response.data might be undefined
            return rejectWithValue(err.response?.data || err.message || "An unknown deletion error occurred.");
        }
    }
);






export const { } = propertySlice.actions;
export default propertySlice.reducer;
