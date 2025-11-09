export interface GetRoomArgs { room_id: string; }

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


export interface ReadHotelWithRooms extends Hotel {
    rooms: ReadRoom[];
}


// _______________________________________________________________________
// ________________________________________bookings_______________________
// _______________________________________________________________________


export interface ReadCurrentBookin {
    guest_name: string;
    phone: string;
    email: string | null;
    check_in: Date;
    check_out: Date
    paid_amount: number;
    notes: string | null;
}


// Defining the structure for hotel creation/update payload
export interface Room {
    room_type: string;
    number: string;                 // added for room identification
    price_per_night: number;
    max_occupancy: number;
    bed_count: number;                   // renamed from number_of_beds
    description: string;
    amenities: string[];                 // renamed from facilities
    cover_image: Image;                  // replaces primary photo
    other_images: Image[];               // replaces remaining photos
}





export interface ReadRoom {
    id: string | number;
    room_type: string;
    number: string;
    status: string;
    price_per_night: number
    current_bookins: ReadCurrentBookin | null
}

export interface ReadRoomFull extends Room {
    id: string;
    status: string;
    current_bookins: ReadCurrentBookin | null;

}







// Defining the state structure
export interface HotelState {
    hotels: Hotel[];
    newHotel: AddHotelPayload;
    selectedHotel: Hotel | null;
    viewHotelWithRooms: ReadHotelWithRooms | null;

    rooms: ReadRoom[];
    newRoom: Room;
    selectedRoom: ReadRoom | null;
    isDeleting: boolean;
    isUpdaing: boolean;
    isCreating: boolean;
    isLoading: boolean;
    error: string | null;
}
export type AddHotelPayload = Omit<Hotel, 'id'>;
export type UpdateHotelPayload = Partial<AddHotelPayload>;
