import React, { useEffect } from 'react'
import DashboardCard from "../../components/dashboardCard"
import InspectionBookingTable from "../../components/properties/inspectionBookingTable"
import { useNavigate } from "react-router-dom"
import FloatingAddButton from "../../components/AddFloatingButton"
import PropertyListTable from "../../components/properties/propertyListTable"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { fetchInspections, fetchProperties } from "../../store/slice/propertySlice"

function PropertyScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const {properties,inspectionData} = useSelector((state: RootState) => state.property)


    useEffect(() => {
        dispatch(fetchProperties({
            page: String(1),
            size: String(8),
        }))
        dispatch(fetchInspections({
            page: String(1),
            size: String(4)
        }))
    }, [])


    // once properties is fetch 

    return (
        <div className="space-y-6 p-5">
            <DashboardCard title="Properties Listed" showDropDown={false} extraView={properties.length > 3 ? true : false} className="px-5">
                <PropertyListTable data={properties} />
            </DashboardCard>


            <DashboardCard title="Booked Inspection" showDropDown={false} extraView>
                <InspectionBookingTable data={inspectionData} />
            </DashboardCard>

            <FloatingAddButton className="   bg-transparent border-[#7f7a06] border rounded-full text-[#7f7a06] active:scale-95 transition-all" onClick={() => {
                navigate("/properties/new-property")
            }} />

        </div >
    )
}

export default PropertyScreen