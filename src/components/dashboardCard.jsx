import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ChoiceDropdown from "./chart/chartDropDown";


function DashboardCard({ children, title = "", sub_title = "", className = "", dropDownData = [], showDropDown = true, showHeader = true, extraView = false, viewAllAction = () => { } }) {
    return (
        <div className="h-full">
            {/* Stats */}
            <div className={twMerge(
                "bg-white h-full rounded-2xl w-full px-10 py-8 border border-gray-200 shadow-sm",
                className
            )}>
                {showHeader && (

                    <div className="header flex justify-between">

                        <div className="title min-w-4/12"> <p className="text-lg font-bold ">{title}</p>
                            <p>{sub_title}</p></div>
                        <div className="legend  flex gap-x-4 w-7/12 justify-end items-center ">

                            {showDropDown && (<ChoiceDropdown data={dropDownData.length ? dropDownData : undefined} />)}
                            {extraView && (<button onClick={viewAllAction} className="text-[#938E07] cursor-pointer">View All</button>)}

                        </div>
                    </div>

                )}

                {children}
            </div>


        </div>
    )
}

export default DashboardCard