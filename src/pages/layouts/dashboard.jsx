import React, { useState, useEffect } from "react";
import { CheckCircle, Sun, Wifi, Shield, Cloud, Cpu } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import UserDashboard from "../../components/newAdmin";

export default function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        // Small delay to ensure Redux state is properly initialized
        const checkAuth = setTimeout(() => {
            if (!isLoggedIn) {
                navigate("/auth/login", { replace: true });
            } else {
                setIsLoading(false);
            }
        }, 100);

        return () => clearTimeout(checkAuth);
    }, [isLoggedIn, navigate]);



    
    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="bg-white text-gray-900 font-sans min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Only render the dashboard if user is authenticated
    if (!isLoggedIn) {
        return null; // This prevents any flash while redirecting
    }

    return (
        <div className="bg-white text-gray-900 font-sans">
            <div className="md:block hidden">
                <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
                <UserDashboard />
                {/* Footer */}
            </div>
            <div className="md:hidden justify-center flex items-center h-screen">
                <p className="text-center font-bold text-lg">Switch to desktop to view</p>
            </div>
        </div>
    );
}