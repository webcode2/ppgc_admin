import { KeyRoundIcon, Mail } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfAuthenticated, loginAccount } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import RightBG from "../../components/auth/RightBG";

export default function Login() {
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(checkIfAuthenticated())
    }, [])
    useEffect(() => {

        if (isAuthenticated) {
            navigate("/records")
        }
    }, [isAuthenticated, navigate])



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

        dispatch(loginAccount({ email: form.email, password: form.password }));
        // Optionally navigate after login
    };

    return (
        <div className="min-h-screen  flex   ">

            <div className="w-6/12 bg-white z-40 flex items-center justify-center p-8">

                <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 font-serif text-center">Sign In</h2>


                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3  rounded-full focus:outline-none  focus:ring-2 focus:ring-gray-300  bg-gray-100"
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>

                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300  bg-gray-100"
                            />

                            <KeyRoundIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>


                    <div className="mb-6 justify-end flex">

                        <p className="text-xs mt-4 "> <Link className="text-[#938E07] text-end " to={"/auth/forget-password"}>Forgot password?</Link> </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white cursor-pointer font-semibold py-2 px-4 rounded-full bg-[linear-gradient(0deg,#938E07,#F9F10C)] active:scale-95 transition-transform duration-200 focus:ring-opacity-50">
                        Sign In
                    </button>

                    <p className="text-xs text-center mt-6 ">  have an Account? <Link className="text-[#938E07]" to={"/auth/register"}>Sign up</Link> no for one!</p>

                </form>
            </div>

            <RightBG title={"Welcome back!"} />
        </div >
    );
}
