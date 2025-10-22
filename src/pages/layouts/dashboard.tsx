import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserDashboard from "../../components/newAdmin";
import Loading from "../../components/loading";
import Header from "../../components/Header"
import type { RootState, AppDispatch } from "../../store";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { checkIfAuthenticated } from "../../store/slice/authSlice";

export default function Dashboard() {
    // const location = useLocation()
    // const dispatch = useAppDispatch();
    // const navigate = useNavigate()
    // const isLoggedIn = useAppSelector((state: RootState) => state.auth.isAuthenticated);
    // const [isLoading, setIsLoading] = useState(false);


    return (
        <div className="bg-white text-gray-900 font-sans">
            <div className="md:block hidden">
               
                {/* Footer */}
            </div>
            <div className="md:hidden justify-center flex items-center h-screen">
                <p className="text-center font-bold text-lg">Switch to desktop to view</p>
            </div>
        </div>
    );
}
