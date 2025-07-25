import React, { useState } from "react";
import { CheckCircle, Sun, Wifi, Shield, Cloud, Cpu } from "lucide-react";
import Header from "../components/Header";
import UserDashboard from "../components/newAdmin";

export default function IoTNoticeBoardLanding() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* Mobile Responsive Header */}
            <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />

            home
            {/* Footer */}
            <footer className="bg-gray-900 text-white px-6 md:px-10 py-8 text-center">

                <p className="text-xs" >&copy; 2025 All rights reserved.</p>
            </footer>
        </div>
    );
}
