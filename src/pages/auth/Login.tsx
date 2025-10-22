import { KeyRoundIcon, Loader2, Mail } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfAuthenticated, loginAccount } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import RightBG from "../../components/auth/RightBG";
import { AppDispatch, RootState } from "../../store";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate()

    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

    const [form, setForm] = useState<FormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({ password: "", email: "" });

    useEffect(() => {
        // Perform one-time auth check on mount
        dispatch(checkIfAuthenticated());
    }, [dispatch]);

    useEffect(() => {
        // Wait until loading completes before deciding
        if (isLoading) return;

        if (isAuthenticated) {
            const params = new URLSearchParams(location.search);
            const redirect = params.get("redirect");

            // Prevent null/undefined redirect values
            const target = redirect && redirect !== "null" ? decodeURIComponent(redirect) : "/";

            navigate(target, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);










    const validate = (form: FormData, setErrors: (errors: FormErrors) => void): boolean => {
        const errs: FormErrors = {};

        if (!form.email || !form.email.includes('@')) {
            errs.email = 'Invalid email';
        }

        if (!form.password || form.password.length < 6) {
            errs.password = 'Minimum 6 characters required';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };








    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate(form, setErrors)) return;
        console.log("data")
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
                        disabled={isLoading} // prevent double-submit while loading
                        className={`    w-full flex items-center justify-center    font-semibold py-2 px-4 rounded-full    bg-[linear-gradient(0deg,#938E07,#F9F10C)]    text-white shadow-md    transition-all duration-200    active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400    ${isLoading ? "opacity-70 cursor-default" : "cursor-pointer"}  `}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                    <p className="text-xs text-center mt-6 ">  have an Account? <Link className="text-[#938E07]" to={"/auth/register"}>Sign up</Link> no for one!</p>

                </form>
            </div>

            <RightBG title={"Welcome back!"} />
        </div >
    );
}
