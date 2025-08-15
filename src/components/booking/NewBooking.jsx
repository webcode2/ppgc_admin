import { useState } from "react";
import DashboardCard from "../dashboardCard";
import FileUpload from "../fileUpload";
import FacilitiesSelect from "../properties/propertyFacilitySecetion";


function NewBooking() {
  const [selectedFacilities, setSelectedFacilities] = useState([]);

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
                    type="text"
                    placeholder="property name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Prie
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-600 mb-1 text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows="6"
                  placeholder="add description"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                ></textarea>
              </div>

              {/* Grid for floor & bedrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Floor */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Review
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      defaultValue="0"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <span className="ml-2 text-gray-500 text-sm">floor(s)</span>
                  </div>
                </div>

                {/* Total Bedrooms */}
                <div>
                  <label className="block text-gray-600 mb-1 text-sm font-medium">
                    Total Bedrooms
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      defaultValue="0"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <span className="ml-2 text-gray-500 text-sm">room(s)</span>
                  </div>
                </div>
              </div></div>
          </DashboardCard >
        </div>

        {/* Cell 2 */}
        <div className=" h-full">
          <DashboardCard title="Add Photos" showHeader className="p-5" showDropDown={false}>
            <div className="mt-2">
              <FileUpload
                onDropFile={(files) => {
                  console.log('Uploaded files:', files);
                  // TODO: handle upload to server / cloud storage
                }}
              />
            </div>
          </DashboardCard >
        </div>


        {/* Cell 3 */}
        <div className="    h-full ">
          <DashboardCard title="Main Facilities" className="" showDropDown={false}>
            <div className="mt-10">
              <FacilitiesSelect selected={selectedFacilities} onChange={setSelectedFacilities} />
            </div>
          </DashboardCard >
        </div>

      </div>
      <div className="w-full">
      </div>
    </div >
  )
}

export default NewBooking