import React, { useEffect } from "react";
import { Image, Mail, Lock, ShieldCheck, Save, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/dashboardCard";
import { OutlineButton } from "../../components/buttons";
import { JSX } from "react/jsx-runtime";

// --------------------------------------------------
// Types
// --------------------------------------------------
interface UserProfile {
    fullName: string;
    email: string;
    username: string;
    phone: string;
    bio?: string;
    profilePic?: string;
    category?: string;
}

// --------------------------------------------------
// Component
// --------------------------------------------------
export default function ProfileScreen(): JSX.Element {
    const navigate = useNavigate();

    // Fake user data (typed)
    const user: UserProfile = {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        username: "janedoe",
        phone: "+1 234 567 890",
        bio: "Travel lover, foodie, and amateur photographer. Always looking for the next adventure!",
        profilePic: "",
        category: "",
    };
    useEffect(() => {
        //dispatch to  fetch from the store
    }, [])

    return (
        <div className="space-y-5 p-5">
            {/* -------------------------------------------------- */}
            {/* Profile Overview */}
            {/* -------------------------------------------------- */}
            <DashboardCard showHeader={false}>
                <div className="flex justify-between items-start">
                    {/* Left Section: Picture + Bio */}
                    <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
                        <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#938E07] bg-gray-100 flex items-center justify-center">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Image className="text-gray-500 w-12 h-12" />
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {user.fullName}
                            </h2>
                            <p className="text-gray-500">@{user.username}</p>
                            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex">
                        <OutlineButton
                            onClick={() => navigate("/profile/update")}
                            className="flex gap-x-3 active:scale-95 border"
                        >
                            Update Profile
                        </OutlineButton>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {/* Phone */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">
                            Phone Number
                        </p>
                        <p className="mt-1 text-gray-800">{user.phone}</p>
                    </div>

                    {/* Category */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">
                            Category
                        </p>
                        <p className="mt-1 text-gray-800">{user.category || "N/A"}</p>
                    </div>

                    {/* Bio */}
                    <div className="sm:col-span-2 bg-gray-100 py-5 px-3 rounded-2xl">
                        <p className="text-xs font-semibold text-gray-400 uppercase">Bio</p>
                        <p className="mt-1 text-gray-800 leading-relaxed">
                            {user.bio || "No bio provided."}
                        </p>
                    </div>
                </div>
            </DashboardCard>

            {/* -------------------------------------------------- */}
            {/* Account Settings */}
            {/* -------------------------------------------------- */}
            <DashboardCard
                showDropDown={false}
                title="Account Settings"
                className="py-5"
            >
                {/* Account Details */}
                <div className="border rounded-xl p-4 mb-10 mt-5">
                    <div className="flex py-3 justify-between items-center">
                        <h2 className="font-semibold text-lg mb-4">Account Details</h2>
                    </div>

                    {/* Email Verification */}
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
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-500" /> Update Password
                            </p>
                            <p className="text-sm text-gray-500">
                                Change your password to protect your account
                            </p>
                        </div>
                        <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
                            Change Password
                        </button>
                    </div>

                    {/* Two-Factor Auth */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-gray-500" /> 2-Factor
                                Authentication
                            </p>
                            <p className="text-sm text-gray-500">
                                Enable two-factor authentication for better security
                            </p>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------- */}
                {/* Recovery Settings */}
                {/* -------------------------------------------------- */}
                <div className="border rounded-xl mb-10">
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
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>

                {/* -------------------------------------------------- */}
                {/* Deactivate Account */}
                {/* -------------------------------------------------- */}
                <div className="border rounded-xl p-4 py-10">
                    <h2 className="font-semibold text-lg mb-2">Deactivate Account</h2>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 mb-3">
                            This will shut down your account. It will reactivate when you sign
                            in again.
                        </p>

                        <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95 rounded-lg flex items-center gap-1">
                            <Power className="w-4 h-4" /> Deactivate
                        </button>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
}
