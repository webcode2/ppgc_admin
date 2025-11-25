import { useCallback, useState } from "react";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import { useDispatch } from "react-redux";
import { OutlineButton, SolidButton } from "../../components/buttons";
import { addHotel } from "../../store/slice/hotelSlice";
import { AddHotelPayload, Hotel } from "../../utils/types/hotelTypes"
import { AppDispatch } from "../../store";
import { uploadSignedImageTest } from "../../../signing";
import { uploadUnsignedImage, useCloudinaryUploadHandler } from "../../utils/cloudinaryUpload"


function NewHotel() {
    const dispatch = useDispatch<AppDispatch>();


    const [hotel, setHotel] = useState<AddHotelPayload>({
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
        cover_image: {
            public_id: "",
            secure_url: "",
        },
        other_images: [],
        facilities: []
    });


    // 💡 NEW: State hook to track progress for multiple files locally
    const [uploadProgressMap, setUploadProgressMap] = useState<Map<string, number>>(new Map());

    // 💡 Helper to update progress state safely and efficiently
    const updateProgress = useCallback((fileId: string, percent: number) => {
        setUploadProgressMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(fileId, percent);
            return newMap;
        });
    }, []);


    const handleSave = () => {
        // disable the save buton
        // update the state to be loading 
        dispatch(addHotel(hotel))
    }


    const handleChange = (e) => {
        setHotel({ ...hotel, [e.target.name]: e.target.value });
    };

    const handleAreaChange = (e) => {
        setHotel({
            ...hotel,
            area: { ...hotel.area, [e.target.name]: e.target.value },
        });
    };



    return (
        <div className="space-y-6 p-6 font-[Inter]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotel Details */}
                <div className="md:row-span-2 h-full">
                    <DashboardCard title="Add New Hotel" showDropDown={false}>
                        <div className="space-y-6 mt-10">
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
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>

                            {/* Area Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Country
                                    </label>
                                    <input
                                        name="country"
                                        type="text"
                                        value={hotel.area.country}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        State / Province
                                    </label>
                                    <input
                                        name="state_or_province"
                                        type="text"
                                        value={hotel.area.state_or_province}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        City / Town
                                    </label>
                                    <input
                                        name="city_or_town"
                                        type="text"
                                        value={hotel.area.city_or_town}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        County
                                    </label>
                                    <input
                                        name="county"
                                        type="text"
                                        value={hotel.area.county}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Street
                                    </label>
                                    <input
                                        name="street"
                                        type="text"
                                        value={hotel.area.street}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Zip / Postal Code
                                    </label>
                                    <input
                                        name="zip_or_postal_code"
                                        type="text"
                                        value={hotel.area.zip_or_postal_code}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Building / Suite
                                    </label>
                                    <input
                                        name="building_name_or_suite"
                                        type="text"
                                        value={hotel.area.building_name_or_suite}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    value={hotel.description}
                                    onChange={handleChange}
                                    placeholder="Write a brief description of the hotel"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                ></textarea>
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* Cover Image Upload */}
                <div className="h-full">
                    <DashboardCard title="Cover Image" showDropDown={false}>
                        <div className="mt-2">
                            <FileUpload
                                onDropFile={useCloudinaryUploadHandler(
                                    uploadUnsignedImage, // The specific upload utility function
                                    "ppgc_properties",     // Destination folder
                                    updateProgress,        // Your helper state setter for progress
                                    setHotel,              // Your main hotel state setter
                                    "cover_image"         // Specify the field to update
                                )}
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                This image will be used as the main display for the hotel.
                            </p>
                        </div>
                    </DashboardCard>
                </div>

                {/* Other Images Upload */}
                <div className="h-full">
                    <DashboardCard title="Other Images" showDropDown={false}>
                        <div className="mt-2">
                            <FileUpload
                                multiple
                                // onDropFile={async (files) => {
                                //     console.log("Other images received:", files.length);

                                //     // 1. Create an array of Promises, one for each upload.
                                //     const uploadPromises = files.map(async (file) => {
                                //         // Create a unique ID for this file's progress tracker
                                //         const fileId = `${file.name}-${file.size}`;

                                //         // Define the progress callback for this specific file
                                //         const onProgressCallback = (percent: number) => {
                                //             updateProgress(fileId, percent);
                                //         };

                                //         try {
                                //             // Execute the UNSIGNED upload function, passing the progress callback
                                //             const response = await uploadUnsignedImage(
                                //                 file,
                                //                 onProgressCallback, // 💡 Passing the callback here
                                //                 null // No existing publicId to overwrite (it's a new upload)
                                //             );

                                //             // Once complete, set progress to 100% and return the structured data
                                //             updateProgress(fileId, 100);


                                //             console.log(uploadProgressMap)
                                //             return {
                                //                 public_id: response.public_id,
                                //                 secure_url: response.secure_url,
                                //             };
                                //         } catch (error) {
                                //             console.error(`Upload failed for ${file.name}:`, error);
                                //             updateProgress(fileId, -1); // Indicate error state (e.g., -1)
                                //             throw error; // Re-throw to stop Promise.all if a failure is critical
                                //         }
                                //     });

                                //     // 2. Wait for ALL uploads to finish concurrently.
                                //     try {
                                //         const newUploadedImages = await Promise.all(uploadPromises);
                                //         console.log("All uploads completed:", newUploadedImages);

                                //         //

                                //         // 3. Update the main hotel state with the new images.

                                //         setHotel((prevHotel) => ({
                                //             ...prevHotel,
                                //             // Append the new images to the existing list
                                //             other_images: [...(prevHotel.other_images || []), ...newUploadedImages],
                                //         }));

                                //         // 4. Clear the progress map after successful state update
                                //         setUploadProgressMap(new Map());

                                //     } catch (error) {
                                //         // Handle global failure (e.g., show toast notification)
                                //         console.error("One or more uploads failed.");
                                //     }
                                // }}

                                onDropFile={useCloudinaryUploadHandler(
                                    uploadUnsignedImage, // The specific upload utility function
                                    "ppgc_properties",     // Destination folder
                                    updateProgress,        // Your helper state setter for progress
                                    setHotel,              // Your main hotel state setter
                                    'other_images'         // Specify the field to update
                                )}
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                These images will be displayed in the hotel gallery.
                            </p>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="actionbtn gap-x-5 flex justify-end items-center w-full pb-5">
                <OutlineButton className="active:scale-95 transition-all ease-in-out">
                    Cancel
                </OutlineButton>
                <SolidButton
                    onClick={handleSave}
                    className="active:scale-95 transition-all ease-in-out border border-[#938E07]"
                >
                    Save
                </SolidButton>
            </div>
        </div>
    );
}

export default NewHotel