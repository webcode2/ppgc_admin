import { useCallback, useEffect, useState } from "react";
import { OutlineButton, SolidButton } from "../../components/buttons";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import { AppDispatch } from "../../store";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Room } from "../../utils/hotelTypes";
import { Target } from "lucide-react";
import { createRoom } from "../../store/slice/hotelSlice";
// ... other imports

const initialRoomState: Room = {
    // ... initial state properties
    room_type: "",
    description: "",
    facilities: [],
    photos: [],
    status: "available",
    price_per_night: 0,
    max_occupancy: 0,
    hotel_id: "0",
    number_of_beds: 0,
};

function NewRoom() {
    const dispatch = useDispatch<AppDispatch>();
    const param = useParams()
    const hotel_id = param.hotel_id

    console.log(hotel_id)

    const [newRoom, setNewRoom] = useState(initialRoomState);

    // FIX 1: Memoize the facility selector handler
    const setSelectedFacilities = useCallback((e) => {
        setNewRoom(prev => ({ ...prev, facilities: e }))
    }, [])

    useEffect(() => {
        // dispatch(createProperty(newRoom))
        if (hotel_id) setNewRoom((prev) => ({ ...prev, hotel_id }))
    }, [hotel_id])

    // FIX 2: Create a single, memoized generic change handler for input fields
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;

        setNewRoom(prev => ({

            ...prev,
            // Handle number conversion for number inputs
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    }, []); // Empty dependency array ensures this function is created only once


    // Handler for multiple other images upload
    const handleOtherImagesDrop = useCallback((files: File[]) => {
        const newImages = files.map((f) => ({
            public_id: f.name, // Mock ID
            secure_url: URL.createObjectURL(f),
        }));

        setNewRoom((prev) => ({
            ...prev,
            photos: newImages, // Assuming photos holds the file objects
        }));
    }, []);

    // FIX 3: Memoize handleSave to prevent re-creation on every render
    const handleSave = useCallback(async () => {
        dispatch(createRoom(newRoom))
        console.log(newRoom)
    }, [newRoom]) // Dependency: newRoom state

    return (
        <div className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" md:row-span-2 h-full" >
                    <DashboardCard title="Add New Room" showDropDown={false} >
                        <div className="space-y-6 mt-10 bord">

                            {/* Grid for top fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Name */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Room Name/No
                                    </label>
                                    <input
                                        name="title" // Changed to room_type as per state
                                        type="text"
                                        placeholder="Room name/No."
                                        // Use the memoized handler
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>

                                {/* Property Type */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        price per Night
                                    </label>
                                    <input
                                        // Use the memoized handler
                                        onChange={handleChange}
                                        type="number"
                                        name="price_per_night"
                                        placeholder="$400"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                            </div>

                            {/* Grid for floor & bedrooms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Max occupancy
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            name="max_occupancy"
                                            // Use the memoized handler
                                            onChange={handleChange}
                                            type="number"
                                            defaultValue="1"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </div>
                                </div>

                                {/* Total Bedrooms */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Number of Bed
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            defaultValue="0"
                                            name="number_of_beds"
                                            // Use the memoized handler
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </div>
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
                                    placeholder="add description"
                                    // Use the memoized handler
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                ></textarea>
                            </div>

                        </div>
                    </DashboardCard >
                </div>

                {/* Cell 2 */}
                <div className=" h-full">
                    <DashboardCard title="Add Photos" showHeader className="p-5" showDropDown={false}>
                        <div className="mt-2">
                            <FileUpload
                                multiple={true}
                                initialImages={newRoom.photos.map(img => img.secure_url)} // Display existing gallery images
                                onDropFile={handleOtherImagesDrop}
                            />
                        </div>
                    </DashboardCard >
                </div>

                {/* Cell 3 */}
                <div className="h-full ">
                    <DashboardCard title="Main Facilities" className="" showDropDown={false}>
                        <div className="mt-10">
                            <FacilitiesSelect selected={newRoom.facilities} onChange={setSelectedFacilities} property_type={{ type: 'room' }} />
                        </div>
                    </DashboardCard >
                </div>

            </div>
            <div className="actionbtn gap-x-5 flex justify-end items-center w-full pb-5">
                <OutlineButton className="active:scale-95 transition-all ease-in-out">cancel</OutlineButton>
                <SolidButton onClick={handleSave} className="active:scale-95 transition-all ease-in-out border border-[#938E07]">Save</SolidButton>
            </div>
        </div >
    )
}

export default NewRoom