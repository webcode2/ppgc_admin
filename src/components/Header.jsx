import React from 'react'
// import { useDispatch } from "react-redux"
import { Bell, Menu, User, User2, X } from "lucide-react";
import { Link } from "react-router-dom";
import SearchComponent from "./searchComponent";


function Header({ setMenuOpen, menuOpen }) {
    // const dispatch = useDispatch()

    return (
        <header className="sticky top-0 left-0 w-full bg-[#3a0a0a] shadow z-50 ">
            <div className="flex items-center  md:px-20 px-5 py-3 ">
                <img src="logo/logo.png" alt="" className="mr-10" srcset="" />
                <SearchComponent onSearch={() => { }} placeholder="search" />
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <nav className="hidden md:flex gap-2 text-sm ml-auto lg:flex justify-center items-center ">



                    <Link to={"/notifications"} className=" font-bold text-sm bg-white rounded-full p-2 ">
                        <Bell className="text-[#3a0a0a]" />
                    </Link>&nbsp;
                    |
                    <Link to={"auth/register"} className="font-bold text-sm">
                        <User2 className="text-white " size={30} />
                    </Link>

                </nav>
            </div>

            {/* Slide-in Mobile Menu */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col p-6 gap-4">
                    <a href="#features" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#how" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>How It Works</a>
                    <a href="#usecases" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Use Cases</a>
                    <a href="#contact" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</a>
                    <Link to={"/new"} className="hover:text-blue-600">admin</Link>

                    <div className="flex flex-col items-start justify-start  w-full">
                        <Link to={"auth/login"} className=" font-bold text-sm"> Login
                        </Link>&nbsp;

                        <Link to={"auth/register"} className="font-bold text-sm"> Register
                        </Link>

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header