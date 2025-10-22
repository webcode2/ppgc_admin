
export interface Image {
    public_id: string;
    secure_url: string;
}

export interface Area {
    country: string;
    state_or_province: string;
    city_or_town: string;
    county: string;
    street: string;
    zip_or_postal_code: string;
    building_name_or_suite: string;
}



// Defining the structure of a successful Hotel response
export interface Hotel {
    id: string | number; // ID can be string or number based on backend implementation
    name: string;
    area: Area;
    description: string;
    cover_image: Image;
    other_images: Image[];
    facilities: string[];

}

// Defining the structure for hotel creation/update payload
export interface Room {
    room_type: string;
    price_per_night: number;
    max_occupancy: number;
    status: string;
    hotel_id: string;
    description: string;
    facilities: string[];
    photos: Image[];
    number_of_beds: number;
}

// Defining the state structure
export interface HotelState {
    hotels: Hotel[];
    selectedHotel: Hotel | null;
    newHotel: AddHotelPayload;
    newRoom: Room;
    isDeleting: boolean;
    isUpdaing: boolean;
    isCreating: boolean;
    isLoading: boolean;
    error: string | null;
}
export type AddHotelPayload = Omit<Hotel, 'id'>;
export type UpdateHotelPayload = Partial<AddHotelPayload>;
