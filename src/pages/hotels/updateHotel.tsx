import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
    clearSelectedHotel,
    getSingleHotelById,
    updateHotel,
} from "../../store/slice/hotelSlice";
import { Hotel, AddHotelPayload, Image, } from "../../utils/types/hotelTypes";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import Loading from "../../components/loading";
import { OutlineButton, SolidButton } from "../../components/buttons";
// Assuming the utility functions and hook are imported correctly
import { uploadUnsignedImage, useCloudinaryUploadHandler } from "../../utils/cloudinaryUpload";
import { PropertyImage } from "../../utils/types/propertiesType";
// import { uploadSignedImageTest } from "../../../signing"; // Remove if not needed

// ------------------------------
// TYPES & INITIAL STATE
// ------------------------------
type UpdateHotelData = Partial<AddHotelPayload>;
interface HotelActionPayload {
    id: string | number;
    data: UpdateHotelData;
}

// Define PropertyImage type for clarity
const emptyImage: Image = { public_id: "", secure_url: "" };

const initialHotelState: Hotel = {
    id: "",
    name: "",
    area: {
        country: "", state_or_province: "", city_or_town: "", county: "",
        street: "", zip_or_postal_code: "", building_name_or_suite: "",
    },
    description: "",
    cover_image: emptyImage,
    other_images: [],
    facilities: [],
};

function EditHotel() {
    const { hotel_id } = useParams<{ hotel_id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedHotel, isLoading } = useSelector((state: RootState) => state.hotel);

    const [uploadProgressMap, setUploadProgressMap] = useState<Map<string, number>>(new Map());
    const [hotel, setHotel] = useState<Hotel>(initialHotelState);
    const [error, setError] = useState<string | null>(null);

    // ------------------------------
    // LOAD HOTEL DATA & SYNC STATE
    // ------------------------------
    useEffect(() => {
        if (hotel_id) dispatch(getSingleHotelById(hotel_id));
        return () => { dispatch(clearSelectedHotel()); }
    }, [hotel_id]);

    useEffect(() => {
        if (selectedHotel) {
            setHotel(selectedHotel);
        }
    }, [selectedHotel]);

    // ------------------------------
    // HANDLERS
    // ------------------------------

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setHotel((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }, []
    );

    const handleAreaChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setHotel((prev) => ({
                ...prev,
                area: { ...prev.area, [e.target.name]: e.target.value },
            }));
        }, []
    );

    // 💡 Helper to update progress state safely and efficiently
    const updateProgress = useCallback((fileId: string, percent: number) => {
        setUploadProgressMap(prevMap => {
            const newMap = new Map(prevMap);
            // If fileId is empty string, we treat it as a clear action
            if (fileId === '' && percent === 0) return new Map();
            newMap.set(fileId, percent);
            return newMap;
        });
    }, []);

    // ------------------------------
    // 🚀 REUSABLE UPLOAD HANDLERS DEFINED UNCONDITIONALLY (HOOKS)
    // ------------------------------

    // 1. Handler for Cover Image (Single File)
    const handleCoverImageDrop = useCloudinaryUploadHandler(
        uploadUnsignedImage,
        "ppgc_properties",
        updateProgress,
        setHotel,
        "cover_image" // Signal to update the single 'cover_image' property
    );

    // 2. Handler for Gallery Images (Multiple Files)
    const handleOtherImagesDrop = useCloudinaryUploadHandler(
        uploadUnsignedImage,
        "ppgc_properties",
        updateProgress,
        setHotel,
        "other_images" // Signal to append to the 'other_images' array
    );


    const handleUpdate = useCallback(() => {
        if (!hotel.id) return setError("Hotel ID missing.");
        if (!hotel.name.trim()) return setError("Hotel name is required.");

        const { id, ...hotelData } = hotel;
        const payload: HotelActionPayload = { id, data: hotelData };
        dispatch(updateHotel(payload));
        console.log("Update payload:", payload);
        navigate("/hotels");
    }, [dispatch, hotel, navigate]);

    if (isLoading) return <Loading />;

    // ------------------------------
    // UI LAYOUT
    // ------------------------------
    return (
        <div className="space-y-6 p-4 font-[Inter]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Hotel Management: Edit</h1>
            {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Section - Hotel Details */}
                <div className="md:col-span-2 h-full">
                    <DashboardCard title={`Editing: ${hotel.name || 'Loading...'}`} showDropDown={false}>
                        <div className="space-y-6 mt-4">
                            {/* Hotel Name, Area Information, Description, Facilities... */}
                            {/* ... (Input fields using handleChange and handleAreaChange) ... */}

                            {/* Hotel Name */}
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">Hotel Name</label>
                                <input name="name" type="text" placeholder="Hotel name" value={hotel.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition duration-150" />
                            </div>

                            {/* Area Information */}
                            <h3 className="text-gray-800 text-lg font-semibold pt-4 border-t">Address Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(hotel.area).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-gray-600 mb-1 text-sm font-medium capitalize">
                                            {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}
                                        </label>
                                        <input
                                            name={key}
                                            type="text"
                                            value={value}
                                            onChange={handleAreaChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition duration-150"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="pt-4 border-t">
                                <label className="block text-gray-600 mb-1 text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    value={hotel.description}
                                    onChange={handleChange}
                                    placeholder="Write a brief description of the hotel"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition duration-150"
                                ></textarea>
                            </div>


                        </div>
                    </DashboardCard>
                </div>

                {/* Right Section - Image Uploads */}
                <div className="md:col-span-1 space-y-6">
                    {/* Cover Image Upload */}
                    <div className="h-full">
                        <DashboardCard showDropDown={false}>
                            <div className="mt-2">
                                <p className="text-gray-600 text-sm font-medium mb-5">Cover Image</p>
                                <FileUpload
                                    initialImage={hotel.cover_image.secure_url}
                                    onDropFile={handleCoverImageDrop}
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    This image will be used as the main display for the hotel.
                                </p>
                            </div>

                            {/* Gallery Images Upload */}
                            <div className="mt-8">
                                <p className="text-gray-600 text-sm font-medium mb-5">Other Images</p>
                                <FileUpload
                                    multiple={true}
                                    initialImages={hotel.other_images.map(img => img.secure_url)}
                                    onDropFile={handleOtherImagesDrop} 
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    These images will be displayed in the hotel gallery (allows multiple files).
                                </p>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="actionbtn gap-x-5 flex justify-end items-center w-full pt-6 border-t mt-6">
                <OutlineButton
                    onClick={() => navigate("/hotels")}
                    className="active:scale-95 transition-all ease-in-out hover:border-red-500 hover:text-red-600"
                >
                    Cancel
                </OutlineButton>
                <SolidButton
                    onClick={handleUpdate}
                    className="active:scale-95 transition-all ease-in-out bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                >
                    Update Hotel
                </SolidButton>
            </div>
        </div>
    );
}

export default EditHotel;