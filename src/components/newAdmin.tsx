import { motion, AnimatePresence } from 'framer-motion';
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
    icons,
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './sideBar';



export default function UserDashboard() {

    return (
        <div className="flex  bg-[#e8edf3]">

            {/* Desktop Sidebar */}
            <div className="hidden sticky   md:flex flex-col  border-r border-gray-200 bg-white shadow-lg">
                <div className="flex-1 overflow-y-auto">
                </div>
            </div>

            {/* Main Content Wrapper */}
            <main className="flex-1  ">
                <div className="p-3 md:p-5 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
