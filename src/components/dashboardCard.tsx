import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ChoiceDropdown from "./chart/chartDropDown";

type DashboardCardProps = {
    children?: React.ReactNode;
    title?: string;
    sub_title?: string;
    className?: string;
    dropDownData?: string[];
    showDropDown?: boolean;
    showHeader?: boolean;
    extraView?: boolean;
    viewAllAction?: () => void;
};

// 1. Rename the component function to start with an uppercase letter if it wasn't already.
// 2. Export the memoized version of the component.
function DashboardCard({ children, title = "", sub_title = "", className = "", dropDownData = [], showDropDown = true, showHeader = true, extraView = false, viewAllAction = () => { } }: DashboardCardProps) {

    // NOTE: The inline function `viewAllAction = () => { }` is created on every render, 
    // but because we are using React.memo(), it will only cause a re-render 
    // if the NEW function reference is DIFFERENT from the OLD one, which is 
    // only the case if the parent (NewRoom) re-renders, BUT since DashboardCard 
    // doesn't use this prop when `extraView` is false, it's often okay. 
    // However, for maximum safety, the parent should pass a useCallback-wrapped function.

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

// FIX: Wrap the component export with React.memo()
export default React.memo(DashboardCard);