import React from "react";
import { Mail, Lock, ShieldCheck, Save, Power, UserCircle } from "lucide-react";
import DashboardCard from "../../components/dashboardCard";
import { OutlineButton } from "../../components/buttons";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
    const navigate = useNavigate()
    return (
        <DashboardCard showDropDown={false} title="Account Settings" className="py-5 " >          {/* Account Details */}
            <div className="border rounded-xl p-4 mb-10 mt-5">
                <div className="flex py-3 justify-between items-center">

                    <h2 className="font-semibold text-lg mb-4">Account Details</h2>
                    <OutlineButton onClick={() => {
                        navigate("/profile/update")
                    }} className="flex gap-x-3 active:scale-95 border-1">

                        Update Profile
                    </OutlineButton>

                </div>

                {/* Sign-In Email */}
                <div className="flex items-center justify-between py-2 border-t">
                    <div>
                        <p className="font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" /> Sign-In Email
                        </p>

                        <p className="text-sm text-gray-500">Verify Email Address</p>
                    </div>
                    <span className="text-green-600 font-medium">Verified</span>
                </div>

                {/* Update Password */}
                <div className="flex items-center justify-between py-2 ">
                    <div>
                        <p className="font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" /> Update Password
                        </p>
                        <p className="text-sm text-gray-500">
                            Change your password to protect your Account
                        </p>
                    </div>
                    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
                        Change Password
                    </button>
                </div>

                {/* 2FA */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="font-medium flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-gray-500" /> 2-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                            Enable Two-factor Authentication to enhance security
                        </p>
                    </div>
                </div>
            </div>

            {/* Recovery Settings */}
            <div className="border rounded-xl  mb-10">
                <h2 className="font-semibold text-lg mb-4 p-4">Recovery Settings</h2>
                <hr />
                <div className="flex items-center gap-2 mb-3 p-4">
                    <p className="font-medium">Recovery Email Address</p>
                </div>
                <div className="flex gap-2 p-4 justify-between px-10">
                    <div className="input w-6/12">
                        <input
                            type="email"
                            placeholder="Enter recovery email"
                            className="flex-1 px-3 py-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#938E07]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 flex justify-between items-center bg-gradient-to-r from-[#F9F10C] to-[#938E07] text-black font-semibold rounded-lg shadow-sm hover:opacity-90"
                    > <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

            {/* Deactivate Account */}
            <div className="border rounded-xl p-4 py-10">
                <h2 className="font-semibold text-lg mb-2">Deactivate Account</h2>

                <div className="flex justify-between items-center">

                    <p className="text-sm text-gray-500 mb-3">
                        This will shut down your account. And it will reactivate with Signing In
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95 rounded-lg flex items-center gap-1">
                        <Power className="w-4 h-4" /> Deactivate
                    </button>
                </div>
            </div>
        </DashboardCard >
    );
}
