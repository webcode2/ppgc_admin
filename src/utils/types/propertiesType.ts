

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
    county: string;
    street: string;
    zip_or_postal_code: string;
    building_name_or_suite: string;
}


export interface Property {
    id?: string;
    type: string;
    cover_image: PropertyImage;
    other_images: PropertyImage[];
    features: string[];
    area: Area;
    title: string;
    price: number;
    description: string;
    availability: "available" | "unavailable" | "";
    is_sold?: boolean;
    is_in_negotiation?: boolean;
    client_name?: string
    client_contact?: string
    sold_price?: number


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
