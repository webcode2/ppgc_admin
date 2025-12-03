

/** Interface for the data used to update an existing property (same structure as creation payload for simplicity here) */
export type UpdatePropertyPayload = Partial<PropertyPayload>;

/** Type for the error value when rejecting a thunk */
export type ApiError = any; // You might want to define a more specific error interface (e.g., { message: string, status: number })




/**
 * Types
*/


type Facility = string; // or { id: string; name: string } if more complex

export type PropertyImage = {
    secure_url: string;
    public_id?: string;
};

export type Errors = Record<string, string>;


export interface Area {
    country: string;
    state_or_province: string;
    city_or_town: string;
    street: string;
    zip_or_postal_code: string;
    building_name_or_suite: string;
}

export interface Property {
    // --- Core Identifiers & Data (Required for listing display) ---
    id?: string; // Made optional
    title: string;
    description: string;
    type: string;
    price: number;

    // --- Image Data ---
    cover_image: PropertyImage;
    other_images: PropertyImage[];

    // --- Metrics & Features (Used in the Stats Bar and Features Card) ---
    beds?: number; // Added & Made optional
    baths?: number; // Added & Made optional
    sqft?: number; // Added & Made optional
    year_built?: number; // Added & Made optional
    features: string[];

    // --- Location Data ---
    area: Area; // Assuming Area is fully defined elsewhere

    // --- Status & Availability ---
    availability: string; // Changed to string for flexibility, e.g., "Immediate", "30 days"
    is_sold?: boolean;
    is_in_negotiation?: boolean;

    // --- Financial & Market Data ---
    sold_price?: number | null; // Completed the incomplete 'sold' property from original input
    days_on_market?: number; // Added & Made optional
    last_assessed_value?: number; // Added & Made optional

    // --- Sales/Client Data (Only if sold) ---
    client_name?: string | null;
    client_contact?: string | null;
}




export type PropertyPayload = {
    title: string;
    price: number;
    description: string;
    availability: string;
    type: string;
    cover_image: PropertyImage;
    other_images: PropertyImage[];
    // use an array for selected feature keys so child component (FacilitiesSelect) can work with .includes
    features: string[];
    area: Area;
};



export interface PropertyList {
    id: string;
    title: string;
    type: string;
    description: string;
    price: number;
    cover_image: { secure_url: string; };
    is_sold: boolean;
    is_in_negotiation: boolean;
    sold_price?: number;
    client_name?: string;
    client_contact?: string;
}