import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfAuthenticated, registerAccount } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const [form, setForm] = useState({ email: '', password: '', username: "" });
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

        dispatch(registerAccount({ email: form.email, username: form.username, password: form.password }));
        // Optionally navigate after login
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}

                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Sign Up
                </button>
                <p className="text-xs mt-5">  already have an Account with us? <Link to={"/auth/login"}>login</Link></p>
            </form>
        </div>
    );
}
