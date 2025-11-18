import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logOut } from "../store/slice/authSlice";
import { useDispatch } from "react-redux";

export default function   Sidebar({ navlist }) {
  const dispatch = useDispatch()
  return (
    <div className="fixed inset-y-0 left-0 z-10 w-52 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 md:static lg:inset-0 flex flex-col h-screen bg-white shadow-md">
      {/* Logo */}
      <div className="logo h-16 flex-shrink-0 flex justify-center items-center sticky top-0 bg-[#3a0a0a]">
        <img src="/logo/logo.png" alt="logo" srcset="" />
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-grow overflow-y-auto">
        <div className="w-full mt-8">
          {navlist.map((navItems) => (
            <div key={navItems.title} className="mb-8">
              <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 px-6">
                {navItems.title}
              </h2>
              <nav className="space-y-2">
                {navItems.list.map(({ label, icon, to }) => (
                  <NavLink
                    key={label}
                    to={to.startsWith('/') ? to : `/${to}`}
                    end={to === '/' || to === '/savings'} // match exactly for dashboard & savings
                    className={({ isActive }) =>
                      `flex items-center space-x-4 px-4 py-2 transition-all ${isActive
                        ? 'bg-gradient-to-r to-[#938E07] from-[#F9F10C] text-black'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-[#938E07]'
                      }`
                    }
                  >
                    <span className="text-black">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
          {/* Logout Button */}
          <div className="p-6 mt-auto border-t border-gray-200">
            <button onClick={() => { dispatch(logOut()) }} className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-red-600 text-sm">
              <LogOut size={28} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
