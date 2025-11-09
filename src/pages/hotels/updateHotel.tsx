import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
    clearSelectedHotel,
    getSingleHotelById,
    updateHotel,
} from "../../store/slice/hotelSlice";
import {
    Hotel,
    AddHotelPayload,
} from "../../utils/types/hotelTypes";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import Loading from "../../components/loading";
import { OutlineButton, SolidButton } from "../../components/buttons";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

// ------------------------------
// TYPES
// ------------------------------

type UpdateHotelData = Partial<AddHotelPayload>;
interface HotelActionPayload {
    id: string | number;
    data: UpdateHotelData;
}

// Default empty state
const initialHotelState: Hotel = {
    id: "",
    name: "",
    area: {
        country: "",
        state_or_province: "",
        city_or_town: "",
        county: "",
        street: "",
        zip_or_postal_code: "",
        building_name_or_suite: "",
    },
    description: "",
    cover_image: { public_id: "", secure_url: "" },
    other_images: [],
    facilities: [],
};

function EditHotel() {
    const { hotel_id } = useParams<{ hotel_id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedHotel, isLoading } = useSelector(
        (state: RootState) => state.hotel
    );

    const [hotel, setHotel] = useState<Hotel>(initialHotelState);
    const [error, setError] = useState<string | null>(null);

    // ------------------------------
    // LOAD HOTEL DATA
    // ------------------------------
    useEffect(() => {
        if (hotel_id) dispatch(getSingleHotelById(hotel_id));
        return () => { dispatch(clearSelectedHotel()); }
    }, [hotel_id]);

    // Sync state when selectedHotel changes
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
        },
        []
    );

    const handleAreaChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setHotel((prev) => ({
                ...prev,
                area: { ...prev.area, [e.target.name]: e.target.value },
            }));
        },
        []
    );

    // COVER IMAGE UPLOAD
    const handleCoverImageDrop = useCallback(async (files: File[]) => {
        try {
            const [url] = await uploadToCloudinary(files, "your_cloud_name", "your_preset");
            setHotel((prev) => ({
                ...prev,
                cover_image: { public_id: files[0].name, secure_url: url },
            }));
        } catch (err) {
            console.error(err);
            setError("Failed to upload cover image");
        }
    }, []);

    // MULTIPLE OTHER IMAGES UPLOAD
    const handleOtherImagesDrop = useCallback(async (files: File[]) => {
        try {
            const urls = await uploadToCloudinary(files, "your_cloud_name", "your_preset");
            const newImages = urls.map((url, idx) => ({
                public_id: files[idx].name,
                secure_url: url,
            }));
            setHotel((prev) => ({ ...prev, other_images: newImages }));
        } catch (err) {
            console.error(err);
            setError("Failed to upload gallery images");
        }
    }, []);

    const handleUpdate = useCallback(() => {
        if (!hotel.id) return setError("Hotel ID missing.");
        if (!hotel.name.trim()) return setError("Hotel name is required.");

        const { id, ...hotelData } = hotel;
        const payload: HotelActionPayload = { id, data: hotelData };
        dispatch(updateHotel(payload));
        console.log("Update payload:", payload);
        navigate("/hotels");
    }, [dispatch, hotel]);

    if (isLoading) return <Loading />;

    // ------------------------------
    // UI LAYOUT
    // ------------------------------

    return (
        // <div className="space-y-6 p-6 font-[Inter]">
        //     <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>

        //     {error && (
        //         <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
        //             {error}
        //         </div>
        //     )}

        //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        //         {/* Left Section - Hotel Details */}
        //         <div className="lg:col-span-2 space-y-6">
        //             <DashboardCard title="Basic Information" showDropDown={false}>
        //                 <div className="space-y-4 mt-4">
        //                     <label className="block text-sm text-gray-700 font-medium">Hotel Name</label>
        //                     <input
        //                         type="text"
        //                         name="name"
        //                         value={hotel.name}
        //                         onChange={handleChange}
        //                         className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
        //                         placeholder="Enter hotel name"
        //                     />

        //                     <label className="block text-sm text-gray-700 font-medium mt-4">
        //                         Description
        //                     </label>
        //                     <textarea
        //                         name="description"
        //                         value={hotel.description}
        //                         onChange={handleChange}
        //                         rows={6}
        //                         className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
        //                         placeholder="Write a brief description of the hotel"
        //                     />
        //                 </div>
        //             </DashboardCard>

        //             <DashboardCard title="Address Information" showDropDown={false}>
        //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        //                     {Object.entries(hotel.area).map(([key, value]) => (
        //                         <div key={key}>
        //                             <label className="block text-gray-600 mb-1 text-sm font-medium capitalize">
        //                                 {key.replace(/_/g, " ")}
        //                             </label>
        //                             <input
        //                                 name={key}
        //                                 value={value}
        //                                 onChange={handleAreaChange}
        //                                 type="text"
        //                                 className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
        //                             />
        //                         </div>
        //                     ))}
        //                 </div>
        //             </DashboardCard>

        //             <DashboardCard title="Facilities" showDropDown={false}>
        //                 {/* <FacilitiesSelect
        //                     property_type={{ type: "hotel" }}
        //                     selected={hotel.facilities}
        //                     onChange={(facilities: string[]) =>
        //                         setHotel((prev) => ({ ...prev, facilities }))
        //                     }
        //                 /> */}


        //                 {/* Facilities */}
        //                 <FacilitiesSelect
        //                     selected={hotel.facilities || []}
        //                     onChange={(newFacilities) =>
        //                         setHotel({ ...hotel, facilities: newFacilities })
        //                     }
        //                     property_type={{ type: "hotel" }}
        //                 />
        //             </DashboardCard>
        //         </div>

        //         {/* Right Section - Image Uploads */}
        //         <div className="space-y-6">
        //             <DashboardCard title="Cover Image" showDropDown={false}>
        //                 <FileUpload
        //                     initialImage={hotel.cover_image.secure_url}
        //                     onDropFile={handleCoverImageDrop}
        //                 />
        //                 <p className="text-xs text-gray-500 mt-2 text-center">
        //                     Used as the main hotel display image.
        //                 </p>
        //             </DashboardCard>

        //             <DashboardCard title="Gallery Images" showDropDown={false}>
        //                 <FileUpload
        //                     multiple
        //                     initialImages={hotel.other_images.map((img) => img.secure_url)}
        //                     onDropFile={handleOtherImagesDrop}
        //                 />
        //                 <p className="text-xs text-gray-500 mt-2 text-center">
        //                     Upload multiple images for the gallery.
        //                 </p>
        //             </DashboardCard>
        //         </div>
        //     </div>

        //     {/* Footer Buttons */}
        //     <div className="flex justify-end gap-4 border-t pt-6 mt-6">
        //         <OutlineButton
        //             onClick={() => navigate("/hotels")}
        //             className="hover:border-red-500 hover:text-red-600"
        //         >
        //             Cancel
        //         </OutlineButton>
        //         <SolidButton
        //             onClick={handleUpdate}
        //             className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-200"
        //         >
        //             Update Hotel
        //         </SolidButton>
        //     </div>
        // </div>

        <div className="space-y-6 p-4  font-[Inter]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Hotel Management: Edit</h1>
            {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hotel Details (Spans 2 columns on desktop) */}
                <div className="md:col-span-2 h-full">
                    <DashboardCard title={`Editing: ${hotel.name || 'Loading...'}`} showDropDown={false}>
                        <div className="space-y-6 mt-4">
                            {/* Hotel Name */}
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">
                                    Hotel Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Hotel name"
                                    value={hotel.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition duration-150"
                                />
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
                                <label className="block text-gray-600 mb-1 text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    value={hotel.description}
                                    onChange={handleChange}
                                    placeholder="Write a brief description of the hotel"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition duration-150"
                                ></textarea>
                            </div>

                            {/* Facilities Select */}
                            {/* <FacilitiesSelect
                                property_type={{ type: 'hotel' }}
                                selected={hotel.facilities}
                                onChange={(newFacilities: string[]) => setHotel(prev => ({ ...prev, facilities: newFacilities }))}
                            /> */}
                        </div>
                    </DashboardCard>
                </div>

                {/* Images Column (Spans 1 column on desktop) */}
                <div className="md:col-span-1 space-y-6">
                    {/* Cover Image Upload */}
                    <div className="h-full">
                        <DashboardCard showDropDown={false}>
                            <div className="mt-2">
                                <p className="text-gray-600 text-sm font-medium mb-5">Cover Image</p>
                                <FileUpload
                                    initialImage={hotel.cover_image.secure_url} // Display existing image
                                    onDropFile={handleCoverImageDrop}
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    This image will be used as the main display for the hotel.
                                </p>
                            </div>

                            <div className="mt-8">
                                <p className="text-gray-600  text-sm font-medium mb-5">Other Images</p>
                                <FileUpload
                                    multiple={true}
                                    initialImages={hotel.other_images.map(img => img.secure_url)} // Display existing gallery images
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
