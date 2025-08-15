import React, { useState } from 'react'
import DashboardCard from "../../components/dashboardCard"
import { inspectionData, propertyList } from "../../store/dummy"
import InspectionBookingTable from "../../components/properties/inspectionBookingTable"
import { useNavigate } from "react-router-dom"
import FloatingAddButton from "../../components/AddFloatingButton"
import PropertyListTable from "../../components/properties/propertyListTable"

function PropertyScreen() {
    const navigate = useNavigate()


    return (
        <div className="space-y-6 ">
            <DashboardCard title="Properties Listed" showDropDown={false}>
                <PropertyListTable data={propertyList} />
            </DashboardCard>
            <DashboardCard title="Booked Inspection" showDropDown={false}>
                <InspectionBookingTable data={inspectionData} />
            </DashboardCard>

            <FloatingAddButton className="   bg-transparent border-[#7f7a06] border rounded-lg text-[#7f7a06] active:scale-95 transition-all" onClick={() => {
                navigate("/properties/new-property")
            }} />

        </div >
    )
}

export default PropertyScreen