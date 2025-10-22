import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfAuthenticated, preRegisterAccount, registerAccount } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { KeyRoundIcon, KeySquareIcon, Loader2, Mail, MailIcon, User, UserCircle } from "lucide-react";
import RightBG from "../../components/auth/RightBG";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { isAuthenticated, preAuth, isLoading } = useSelector(state => state.auth)

    const [form, setForm] = useState({ email: '', password: '', name: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(checkIfAuthenticated())
    }, [])
    useEffect(() => {

        if (isAuthenticated) {
            navigate("/")
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (preAuth.authStep === 1) navigate("/auth/verify-email")
    }, [preAuth, navigate])

    const validate = () => {
        const errs = {};
        if (!form.email.includes('@')) errs.email = 'Invalid email';
        if (form.password.length < 6) errs.password = 'Minimum 6 characters required';



        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };  

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        dispatch(preRegisterAccount({ email: form.email, fullname: form.name, password: form.password }));
        // Optionally navigate after login
    };



    return (
        <div className="min-h-screen flex ">
            <div className="w-6/12 bg-white z-40 flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className=" w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                        <div className="relative">

                            <input
                                id="name"
                                placeholder="Enter your full name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3  rounded-full focus:outline-none  focus:ring-2 focus:ring-gray-300  bg-gray-100"
                            />
                            <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>


                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}

                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                                placeholder="Enter your Email"
                        onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3  rounded-full focus:outline-none  focus:ring-2 focus:ring-gray-300  bg-gray-100"
                    />

                            <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>

                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                placeholder="Enter Password"
                                onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3  rounded-full focus:outline-none  focus:ring-2 focus:ring-gray-300  bg-gray-100"

                            />
                            <KeySquareIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>

                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading} // prevent double-submit while loading
                        className={`    w-full flex items-center justify-center    font-semibold py-2 px-4 rounded-full    bg-[linear-gradient(0deg,#938E07,#F9F10C)]    text-white shadow-md    transition-all duration-200    active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400    ${isLoading ? "opacity-70 cursor-default" : "cursor-pointer"}  `}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                    <p className="text-xs mt-5 text-center">  already have an Account with us? <Link to={"/auth/login"} className="text-[#938E07]">login</Link></p>
                </form>
            </div >

            <RightBG title={"Create an account!"} />
        </div>
    );
}
