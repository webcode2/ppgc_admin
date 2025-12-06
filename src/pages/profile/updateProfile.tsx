import { useState, ChangeEvent } from "react";
import { ImagePlusIcon } from "lucide-react";
import DashboardCard from "../../components/dashboardCard";

export default function ProfileForm() {
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfilePic(url);
        }
    };

    return (
        <DashboardCard className="pt-10" showDropDown={false}>
            {/* Profile Picture */}
            <div className="mb-6">
                <label
                    htmlFor="profile-upload"
                    className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg cursor-pointer hover:border-gray-400"
                >
                    {profilePic ? (
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <>
                            <ImagePlusIcon className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Upload your photo</span>
                        </>
                    )}

                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>

                <p className="my-2 font-medium">Your profile picture</p>
            </div>

            <hr className="my-6" />

            {/* Form Fields */}
            <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full name</label>
                        <input
                            type="text"
                            placeholder="Please enter your full name"
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Please enter your email"
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Please enter your username"
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone number</label>
                        <input
                            type="tel"
                            placeholder="Please enter your phone number"
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Bio</label>
                    <textarea
                        rows={4}
                        placeholder="Write your Bio here e.g your hobbies, interests ETC"
                        className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end items-center">
                    <button
                        type="button"
                        className="px-6 py-3 border border-gray-300 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#F9F10C] to-[#938E07] text-black font-semibold rounded-lg shadow-sm hover:opacity-90"
                    >
                        Update profile
                    </button>
                </div>
            </form>
        </DashboardCard>
    );
}
