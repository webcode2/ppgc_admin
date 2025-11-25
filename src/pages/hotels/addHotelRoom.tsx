import { useCallback, useEffect, useState } from "react";
import { OutlineButton, SolidButton } from "../../components/buttons";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import { AppDispatch } from "../../store";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Room } from "../../utils/types/hotelTypes";
import { createRoom, updateRoom } from "../../store/slice/hotelSlice";


const initialRoomState: Room = {
    room_type: "",
    description: "",
    price_per_night: 0,
    max_occupancy: 0,
    amenities: [],
    bed_count: 0,
    cover_image: { public_id: "", secure_url: "" },
    other_images: [],
    room_number: "",
};

function RoomForm() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams<{ hotel_id: string, room_id: string }>(); // Destructure correctly
    const { hotel_id, room_id } = params;

    // Determine mode based on URL parameters
    const isEditMode = !!room_id;

    const [newRoom, setNewRoom] = useState<Room>(initialRoomState);

    // --- EFFECT 1: Load Room Data on Edit Mode ---
    useEffect(() => {
        if (isEditMode && room_id) {
            console.log(`[EDIT MODE] Attempting to fetch room details for ID: ${room_id}`);
        // In a real app: dispatch(getRoomDetailsById(room_id));
        // fetch the room details and set state



        } else if (hotel_id) {
            // Ensure hotel_id is set for creation mode
            setNewRoom((prev) => ({ ...prev, hotel_id }));
            console.log(`[CREATE MODE] Initializing new room for hotel ${hotel_id}.`);
        }
    }, [hotel_id, room_id, isEditMode, dispatch]);


    const setSelectedFacilities = useCallback((e: any) => {
        setNewRoom(prev => ({ ...prev, amenities: e }));
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setNewRoom(prev => ({
            ...prev,
            // Handle number conversion for number inputs
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    }, []);

    const handleOtherImagesDrop = useCallback((files: File[]) => {
        const newImages = files.map((f) => ({
            public_id: f.name,
            secure_url: URL.createObjectURL(f),
        }));

        setNewRoom((prev) => ({
            ...prev,
            other_images: [...prev.other_images, ...newImages],
        }));
    }, []);


    const handleSave = useCallback(async () => {
        if (!hotel_id) return
        if (isEditMode && room_id) {
            // UPDATE LOGIC
            console.log(`[UPDATE ACTION] Updating Room ${newRoom.room_number} for Hotel ${hotel_id}. Data:`, newRoom);
            dispatch(updateRoom({ data: newRoom, room_id: room_id, hotel_id: hotel_id }));
            alert(`Updated room ${newRoom.room_number} successfully! (Mock)`);

        } else if (!isEditMode && hotel_id) {
            // CREATE LOGIC
            console.log(`[CREATE ACTION] Creating new Room for Hotel ${hotel_id}. Data:`, newRoom);
            dispatch(createRoom({ data: newRoom, hotel_id: hotel_id! }));
        } else {
            console.error("Missing hotel_id or room_id for action.");
        }
    }, [newRoom, isEditMode, hotel_id, dispatch]);




    const title = isEditMode ? `Update Room ${newRoom.room_number || room_id}` : 'Add New Room';
    const saveButtonText = isEditMode ? 'Update Room' : 'Save New Room';

    return (
        <div className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className=" md:row-span-2 col-span-4 h-full" >
                    <DashboardCard title={title} showDropDown={false} >
                        <div className="space-y-6 mt-10 bord">

                            {/* Grid for top fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Room Name/No */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Room Name/No
                                    </label>
                                    <input
                                        name="room_number"
                                        type="text"
                                        placeholder="Room name/No."
                                        value={newRoom.room_number}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>

                                {/* Room Type */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Room type
                                    </label>
                                    <select
                                        name="room_type"
                                        value={newRoom.room_type}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300 bg-white"
                                    >
                                        <option value="" disabled>Select room type</option>
                                        <option value="suite">Suite</option>
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="deluxe">Deluxe</option>
                                        <option value="family">Family</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grid for prices & occupancy */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Price per Night
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="number"
                                        name="price_per_night"
                                        placeholder="$400"
                                        value={newRoom.price_per_night || ''}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Max occupancy
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            name="max_occupancy"
                                            value={newRoom.max_occupancy || ''}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="1"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </div>
                                </div>

                                {/* Total Bedrooms */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">
                                        Number of Beds
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={newRoom.bed_count || ''}
                                            name="bed_count"
                                            onChange={handleChange}
                                            placeholder="1"
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
                                    placeholder="Add description"
                                    value={newRoom.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                ></textarea>
                            </div>

                        </div>
                    </DashboardCard >
                </div>

                {/* Cell 2: Add Photos */}
                <div className=" col-span-3 h-full">
                    <DashboardCard title="Add Photos" showHeader className="p-5" showDropDown={false}>
                        <div className="mt-2">
                            <FileUpload
                                multiple={true}
                                initialImages={newRoom.other_images.map((img: any) => img.secure_url)}
                                onDropFile={handleOtherImagesDrop}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                                {newRoom.other_images.length} image(s) uploaded.
                            </div>
                        </div>
                    </DashboardCard >
                </div>

                {/* Cell 3: Amenities */}
                <div className="col-span-3 h-full ">
                    <FacilitiesSelect
                        selected={newRoom.amenities}
                        onChange={setSelectedFacilities}
                        property_type="room"
                    />
                </div>

            </div>
            <div className="actionbtn gap-x-5 flex justify-end items-center w-full pb-5">
                <OutlineButton className="active:scale-95 transition-all ease-in-out">Cancel</OutlineButton>
                <SolidButton onClick={handleSave} className="active:scale-95 transition-all ease-in-out border border-[#938E07]">
                    {saveButtonText}
                </SolidButton>
            </div>
        </div >
    );
}

export default RoomForm;