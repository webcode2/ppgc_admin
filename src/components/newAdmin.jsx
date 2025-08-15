import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import {
    Home,
    PencilLine,
    ClipboardList,
    Settings,
    LogOut,
    X,
    CreditCard,
    UserCog,
    Bell,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './sideBar';

const navItems = [
    {
        title: 'General',
        list: [
            { label: 'Dashboard', to: '/', icon: <Home size={26} /> },
            { label: 'Bookings', to: '/bookings', icon: <PencilLine size={26} /> },
            { label: 'Properties', to: '/properties', icon: <ClipboardList size={26} /> },
            { label: 'Savings', to: '/savings', icon: <Wallet size={26} /> },
            { label: 'Investment', to: '/investments', icon: <Settings size={26} /> },
        ],
    },
    {
        title: 'Preferences',
        list: [
            { label: 'Account Settings', to: 'profile', icon: <UserCog size={26} /> },
            // { label: 'Account Settings', to: 'account-settings', icon: <UserCog size={26} /> },
            { label: 'Notifications', to: 'notifications', icon: <Bell size={26} /> },
            { label: 'Security', to: 'security', icon: <ShieldCheck size={26} /> },
        ],
    },
];

export default function UserDashboard() {

    return (
        <div className="flex h-screen overflow-hidden bg-[#e8edf3]">


            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col  border-r border-gray-200 bg-white shadow-lg">
                <div className="flex-1 overflow-y-auto">
                    <Sidebar navlist={navItems} />
                </div>
            </div>

            {/* Main Content Wrapper */}
            <main className="flex-1 h-screen overflow-y-scroll no-scrollbar relative">
                <div className="p-3 md:p-5 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
