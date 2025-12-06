import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiClient from "../../utils/axiosConfig";
import { ApiError, Property, PropertyList, PropertyPayload, UpdatePropertyPayload } from "../../utils/types/propertiesType";
import { InspectionItem } from '../../utils/types/propertyInspection';







// Define the complete slice state
interface PropertyState {
    properties: PropertyList[];
    newProperty: Property;
    inspectionData: InspectionItem[]

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
    inspectionData: [],

    newProperty: {
        other_images: [],
        id: "",
        price: 0,
        features: [],
        cover_image: { secure_url: "", public_id: "" },
        title: "",
        type: "",
        description: "",
        area: { building_name_or_suite: "", city_or_town: "", country: "", state_or_province: "", street: "", zip_or_postal_code: "" },
        availability: "available"

    },
    selectedProperty: {
        "id": "prop-54321",
        "title": "Modern Loft with Skyline Views",
        "type": "Condo / Loft",
        "price": 1850000,
        "sold_price": null,
        "beds": 2,
        "baths": 2.5,
        "sqft": 1450,
        "year_built": 2018,
        "days_on_market": 42,
        "last_assessed_value": 1500000,
        "is_sold": false,
        "is_in_negotiation": false,

        "availability": "Immediate",
        "description": "Welcome to the pinnacle of urban living. This stunning two-bedroom loft offers floor-to-ceiling windows with panoramic city views, an open-concept living space, and state-of-the-art smart home integration. The gourmet kitchen features Miele appliances and quartz countertops. Building amenities include a 24-hour concierge, rooftop terrace, and fitness center. Located steps from downtown's best dining and entertainment districts.",
        "client_name": null,
        "client_contact": null,

        "area": {
            "street": "123 Urban Blvd, Unit 2802",
            "building_name_or_suite": "The Pinnacle Residences",
            "city_or_town": "Willow Creek",
            "state_or_province": "CA",
            "zip_or_postal_code": "90210",
            "country": "USA",

        },
        "features": [
            "Floor-to-ceiling windows",
            "Gourmet kitchen (Miele appliances)",
            "Smart home integration",
            "In-unit laundry",
            "Private balcony",
            "24/7 Concierge",
            "Heated underground parking",
            "Rooftop terrace access",
            "Pet-friendly building"
        ],
        "cover_image": {
            "secure_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        "other_images": [
            {
                "secure_url": "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                "secure_url": "https://images.unsplash.com/photo-1541123356213-bc0605658097?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                "secure_url": "https://images.unsplash.com/photo-1563299796-cf9b0714b149?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                "secure_url": "https://images.unsplash.com/photo-1522080879683-1763a1523f66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
        ]
    },
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
            .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<PropertyList[]>) => {
                state.properties = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch properties';
            });

        builder.addCase(fetchInspections.pending, (state) => {

        }).addCase(fetchInspections.fulfilled, (state, action) => {
            state.inspectionData = action.payload

        }).addCase(fetchInspections.rejected, (state, action) => {
            state.error = action.payload
        });

        builder.addCase(createProperty.pending, (state) => {
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
export const fetchInspections = createAsyncThunk<
    InspectionItem[],
    Record<string, string> | string | null,
    { rejectValue: ApiError }
>(
    "properties/fetchInspections",

    async (filters, { rejectWithValue }) => {
        try {
            const qs = filters && typeof filters === "object"
                ? "?" + new URLSearchParams(filters).toString()
                : "";

            const response = await apiClient.get<InspectionItem[]>(`/inspections/all/${qs}`);

            if (response.status === 200) {
                return response.data;
            }

            return rejectWithValue({
                message: "Failed to fetch inspections",
                status: response.status,
            });
        } catch (err: any) {
            return rejectWithValue({
                message: err.response?.data || err.message || "oops! something went wrong",
                status: err.response?.status || 500,
            });
        }
    }
);




/**
 * Thunk to fetch all properties ( /pGETroperties/)
 * @param {object} [filters] - Optional query parameters for filtering/pagination.
 */
export const fetchProperties = createAsyncThunk<PropertyList[], object | string, { rejectValue: ApiError }>(
    'properties/fetchProperties', async (filters, { rejectWithValue }) => {
        try {
            // Construct query string if filters are provided
            const queryString = filters ? '?' + new URLSearchParams(filters as Record<string, string>).toString() : '';
            console.log(`Fetching properties with filters: ${queryString}`);
            const response = await apiClient.get<PropertyList[]>(`/properties/${queryString}`);
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
