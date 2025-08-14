import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";


function DashboardCard({ children, title = "", sub_title = "", className = "" }) {
    return (
        <div className="h-full">
            {/* Stats */}
            <div className={twMerge(
                "bg-white h-full rounded-2xl w-full px-10 py-10 border border-gray-200 shadow-sm",
                className
            )}>
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