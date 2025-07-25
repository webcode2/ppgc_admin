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
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './sideBar';

const navItems = [
    {
        title: 'General',
        list: [
            { label: 'Dashboard', to: '/dashboard', icon: <Home size={26} /> },
            { label: 'Bookings', to: '/dashboard/bookings', icon: <PencilLine size={26} /> },
            { label: 'Properties', to: '/dashboard/properties', icon: <ClipboardList size={26} /> },
            { label: 'Savings', to: '/dashboard/savings', icon: <CreditCard size={26} /> },
            { label: 'Investment', to: 'dashboard/investment', icon: <Settings size={26} /> },
        ],
    },
    {
        title: 'Preferences',
        list: [
            { label: 'Account Settings', to: 'account-settings', icon: <UserCog size={26} /> },
            { label: 'Notifications', to: 'notifications', icon: <Bell size={26} /> },
            { label: 'Security', to: 'security', icon: <ShieldCheck size={26} /> },
        ],
    },
];

export default function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#e8edf3]">
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 p-6 flex flex-col justify-between"
                    >
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-blue-600">IoT Admin</h2>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="text-gray-500 hover:text-red-500" />
                                </button>
                            </div>
                            {navItems.map((group) => (
                                <div key={group.title} className="mb-6">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                                        {group.title}
                                    </h3>
                                    <nav className="space-y-2">
                                        {group.list.map(({ label, icon, to }) => (
                                            <Link
                                                key={label}
                                                to={to}
                                                className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md transition-all"
                                            >
                                                <span className="text-blue-500">{icon}</span>
                                                <span className="text-sm font-medium">{label}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            ))}
                        </div>
                        <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 text-sm">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </motion.aside>
                )}
            </AnimatePresence>

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
