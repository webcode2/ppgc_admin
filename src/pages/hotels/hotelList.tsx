import React, { useEffect } from 'react'
import DashboardCard from "../../components/dashboardCard"
import FloatingAddButton from "../../components/AddFloatingButton";
import { useNavigate } from "react-router-dom";
// Removed MoreVertical as it's now in HotelRow
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, type RootState } from "../../store";
import { deleteHotel, getAllHotel } from "../../store/slice/hotelSlice";
import Loading from "../../components/loading";
import HotelRow from "./RowComponent";

function Hotel() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { hotels, isLoading } = useSelector((state: RootState) => state.hotel)

    useEffect(() => {
        dispatch(getAllHotel())
    }, [dispatch]) // Added dispatch to dependency array for best practice

    const schema = {
        name: "string",
        area: {
            country: "string",
            state_or_province: "string",
            city_or_town: "string",
            county: "string",
            street: "string",
            zip_or_postal_code: "string",
            building_name_or_suite: "string"
        },
        description: "string",
        cover_image: {
            public_id: "string",
            secure_url: "string"
        },
        other_images: ["string"]
    };

    // Removed openMenu and handleToggle, as this logic is now in HotelRow.tsx

    if (isLoading) return <Loading  text='Loading Registered Hotels'/>

    if (!hotels || hotels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-6">
                <h2 className="text-lg font-semibold">No Hotels Found</h2>
                <p className="text-gray-500">It seems there are no hotels available at the moment.</p>
                <FloatingAddButton onClick={() => navigate("/hotels/new")} className="border-[#938E07] border" />
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <DashboardCard
                title="Hotels"
                extraView={hotels.length > 5}
                dropDownData={["This Week", "This Month", "Last six Month", "This Year"]}
            >
                <table className="min-w-full text-sm text-left mt-10 ">
                    <thead className="pb-5">
                        <tr className="border-b border-gray-200 ">
                            <th className="p-2 ">Cover</th>
                            <th className="p-2 ">Name</th>
                            <th className="p-2 ">City</th>
                            <th className="p-2 ">Country</th>
                            <th className="p-2 ">Street</th>
                            <th className="p-2 ">Zip</th>
                            <th className="p-2 ">Description</th>
                            <th className="p-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map((hotel) => (
                            <HotelRow
                                key={hotel.id} // Ensure you use a unique key, preferably hotel.id
                                hotel={hotel}
                                dispatch={dispatch}
                            />
                        ))}
                    </tbody>
                </table>
            </DashboardCard>

            <FloatingAddButton onClick={() => navigate("/hotels/new")} className="border-[#938E07] border" />
        </div>
    )
}

export default Hotel
