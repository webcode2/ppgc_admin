import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from "react-router-dom";


function DashboardCard({ children, title = "", sub_title = "" }) {
    return (
        <div className="h-full">
            {/* Stats */}
            <div className=" bg-white h-full rounded-2xl w-full px-10 py-10 border border-gray-200 shadow-sm">
                <div className="">

                    <p className="text-xl font-bold ">{title}</p>
                    <p>{sub_title}</p>
                </div>

                {children}
            </div>


        </div>
    )
}

export default DashboardCard