import React, { useState, useCallback, useEffect } from 'react';
import { Search, Calendar, Loader2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SolidButton } from "../../components/buttons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getAllHotel } from "../../store/slice/hotelSlice";
import { Hotel } from "../../utils/types/hotelTypes";

// --- Static Data ---
const rooms = [
    {
        id: 1,
        roomNumber: "Room 074",
        type: "Suit",
        price: 70000,
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        roomNumber: "Room 075",
        type: "Double Bed",
        price: 55000,
        imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        roomNumber: "Room 076",
        type: "Single Bed",
        price: 40000,
        imageUrl: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
];

// --- Utility Functions ---
const dateToISOString = (d: string | Date): string => {
    try {
        const date = typeof d === 'string' ? new Date(d) : d;
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

const defaultCheckIn = dateToISOString(new Date());
const defaultCheckOut = dateToISOString(new Date(new Date().setDate(new Date().getDate() + 1)));

// --- Interface ---
interface SearchForm {
    checkIn: string;
    checkOut: string;
    hotelId: string;
}

const initialSearchState: SearchForm = {
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    hotelId: '',
};

// --- Custom Colors ---
const COLOR_PRIMARY = '#f3eb0b';
const COLOR_BOOKING = '#6366f1';

function BookingSearchForm(): React.ReactElement {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Local State
    const [searchForm, setSearchForm] = useState<SearchForm>(initialSearchState);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Redux State - FIXED: Added 'status' to destructuring
    // Note: Ensure your hotelSlice actually has a 'status' field (idle/loading/etc.)
    const { hotels, status="" } = useSelector((state: RootState) => state.hotel);

    // Fetch data when component mounts
    useEffect(() => {
        dispatch(getAllHotel());
        // FIXED: Removed the invalid leading comma in the dependency array
    }, [dispatch]);

    // --- HANDLERS ---

    // Handle Input Changes (Text/Date)
    const updateSearchForm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Handle Select Changes - FIXED SYNTAX ERROR
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: value // FIXED: Added brackets for computed property name
        }));
    }; // FIXED: Added missing closing brace and parenthesis

    const validateSearch = (form: SearchForm): boolean => {
        const checkInDate = new Date(form.checkIn).getTime();
        const checkOutDate = new Date(form.checkOut).getTime();

        if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
            toast.error("Check-out date must be after check-in date.");
            return false;
        }
        return true;
    };

    const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateSearch(searchForm)) return;

        setIsSearching(true);
        toast.info("Checking room availability...");

        // --- SIMULATED BACKEND AVAILABILITY CHECK ---
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSearching(false);

        // --- SUCCESS & NAVIGATION ---
        const queryParams = new URLSearchParams({
            checkIn: searchForm.checkIn,
            checkOut: searchForm.checkOut,
            adults: '1',
            children: '0',
        }).toString();

        navigate(`/hotel/${searchForm.hotelId}/rooms/available?${queryParams}`);

    }, [searchForm, navigate]); // removed searchForm.hotelId as it is inside searchForm

// --- RENDER ---
    return (
        <div className="p-5 pt-10 min-h-[85vh]">
            <div className="mx-auto p-8 md:p-10">

                <form onSubmit={handleSearch} className="space-y-6 justify-center items-center flex">
                    <div className="flex border items-center p-5 gap-3 rounded-3xl border-gray-400 min-w-3xl">

                        {/* Check-in Date */}
                        <div className='flex flex-col flex-auto '>
                            <label htmlFor="checkIn" className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                                <Calendar size={16} className='mr-2' style={{ color: COLOR_PRIMARY }} /> Check-in Date
                            </label>
                            <input
                                id="checkIn"
                                name="checkIn"
                                type="date"
                                value={searchForm.checkIn}
                                onChange={updateSearchForm}
                                min={dateToISOString(new Date())}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
                                required
                            />
                        </div>

                        {/* Check-out Date */}
                        <div className='flex flex-col flex-auto '>
                            <label htmlFor="checkOut" className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                                <Calendar size={16} className='mr-2' style={{ color: COLOR_PRIMARY }} /> Check-out Date
                            </label>
                            <input
                                id="checkOut"
                                name="checkOut"
                                type="date"
                                value={searchForm.checkOut}
                                onChange={updateSearchForm}
                                min={searchForm.checkIn}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
                                required
                            />
                        </div>

                        {/* Select Hotel */}
                        <div className='flex flex-col flex-auto'>
                            <label htmlFor="hotel" className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                                <Building2 size={16} className='mr-2 text-indigo-600' />
                                Select Hotel
                            </label>

                            <div className="relative">
                                <select
                                    id="hotel"
                                    name="hotelId" // FIXED: Changed from "hotel" to "hotelId" to match interface
                                    value={searchForm.hotelId}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                                    required
                                >
                                    <option value="" disabled>
                                        {status === 'loading' ? 'Loading hotels...' : 'Choose a property...'}
                                    </option>

                                    {/* Render the list from Redux */}
                                    {hotels && hotels.map((hotel: Hotel) => (
                                        <option key={hotel.id} value={hotel.id}>
                                            {hotel.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Icon Logic: Show Spinner if loading, Chevron if ready */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                    {/* FIXED: Removed hardcoded "loading" string check */}
                                    {status === 'loading' ? (
                                        <Loader2 className="animate-spin h-4 w-4 text-indigo-600" />
                                    ) : (
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <SolidButton
                            type="submit"
                            disabled={isSearching}
                            className={` text-white px-6 py-4 rounded-xl font-bold text-lg transition-all  ${isSearching ? '' : ''}`}
                            style={{ backgroundColor: isSearching ? undefined : COLOR_BOOKING }}
                        >
                            {isSearching ? (
                                <span className='flex items-center justify-center'>
                                    <Loader2 size={20} className='mr-2 animate-spin' /> Searching...
                                </span>
                            ) : (
                                <span className='flex items-center justify-center'>
                                    <Search size={20} className='mr-2' /> Search
                                </span>
                            )}
                        </SolidButton>
                    </div>
                </form>
            </div>

            <div className="">
                <p className="text font-semibold ">
                    Available Rooms
                </p>
                {/* FIXED: Changed t-12 to mt-12 (margin top) */}
                <div className="room_card grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            roomNumber={room.roomNumber}
                            type={room.type}
                            price={room.price}
                            imageUrl={room.imageUrl}
                            onBook={() => console.log(`Booking ${room.roomNumber}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookingSearchForm;

// --- Room Card Component ---
interface RoomCardProps {
    roomNumber: string;
    type: string;
    price: number;
    imageUrl: string;
    onBook?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
    roomNumber,
    type,
    price,
    imageUrl,
    onBook
}) => {
    const formattedPrice = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(price);

    return (
        <div className="flex w-full max-w-[340px] bg-white rounded-[24px] p-4 shadow-lg items-center justify-between transform transition-transform hover:scale-105">
            <div className="flex flex-col justify-between h-full gap-4 pr-2">
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                        <span className="text-lg font-bold text-gray-900 leading-tight">{type}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</span>
                        <span className="text-lg font-bold text-gray-900 leading-tight">{formattedPrice}</span>
                    </div>
                </div>
                <SolidButton
                    onClick={onBook}
                    className="cursor-pointer text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm active:scale-95 transition-all duration-200 w-fit"
                >
                    Book Now
                </SolidButton>
            </div>
            <div className="relative w-[110px] h-[140px] rounded-[18px] overflow-hidden shrink-0 group">
                <img
                    src={imageUrl}
                    alt={`Room ${roomNumber}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 top-0 w-8 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <span className="text-white font-bold text-sm tracking-widest -rotate-90 whitespace-nowrap uppercase">
                        {roomNumber}
                    </span>
                </div>
            </div>
        </div>
    );
};