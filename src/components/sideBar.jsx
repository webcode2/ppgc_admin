import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Sidebar({ navlist }) {
  return (
    <aside className="w-56 hidden md:flex flex-col justify-between  items-center py-8 border-r border-gray-200">
      <div className="w-full ">
        {navlist.map((navItems) => (
          <div key={navItems.title} className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 px-6">
              {navItems.title}
            </h2>
            <nav className="space-y-2">
              {navItems.list.map(({ label, icon, to }) => (
                <NavLink
                  key={label}
                  to={to.startsWith('/') ? to : `/${to}`} // Ensure leading slash
                  end={to.split('/').length <= 2}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4  py-2 transition-all 
                      ${isActive
                      ? 'bg-gradient-to-r to-[#938E07] from-[#F9F10C] text-black'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-[#938E07]'}`
                  }
                >
                  <span className="text-black">{icon}</span>
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 text-sm">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
