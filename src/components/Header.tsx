import React from 'react'
// import { useDispatch } from "react-redux"
import { Bell, Menu, User, User2, X } from "lucide-react";
import { Link } from "react-router-dom";
import SearchComponent from "./searchComponent";


function Header() {
    // const dispatch = useDispatch()

    return (
        <header className="sticky top-0 left-0 w-full bg-[#3a0a0a] shadow z-50 ">
            <div className="flex items-center  md:px-20 px-5 py-3 ">
                <SearchComponent onSearch={() => { }} placeholder="search" />

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


        </header>
    );
}

export default Header