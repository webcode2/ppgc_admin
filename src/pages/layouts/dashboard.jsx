import React, { useState } from "react";
import { CheckCircle, Sun, Wifi, Shield, Cloud, Cpu } from "lucide-react";
import Header from "../../components/Header";
import UserDashboard from "../../components/newAdmin";

export default function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white text-gray-900 font-sans">
            <div className="md:block hidden">
                <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />

            <UserDashboard />
            {/* Footer */}
            </div>
            <div className="md:hidden justify-center flex items-center h-screen">
                <p className="text-center font-bold  text-lg  "> Switch to desktop to view</p>
            </div>
            {/* Mobile Responsive Header */}

        </div>
    );
}
