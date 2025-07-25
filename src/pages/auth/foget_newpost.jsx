import React from 'react';
import { Link } from "react-router-dom";

export default function ResetPassword() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
                    Reset Password
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Enter your email to receive password reset instructions.
                </p>

                <form className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                {/* Back to Login */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    Remembered your password?{' '}
                    <Link to="/auth/login" className="text-blue-600 hover:underline">
                        Go back to login
                    </Link>
                </p  >
            </div>
        </div>
    );
}
