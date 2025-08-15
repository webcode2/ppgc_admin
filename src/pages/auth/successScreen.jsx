import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAccount, registerAccount } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import RightBG from "../../components/auth/RightBG";    
import TokenInput from "../../components/auth/verifyWithToken";
import { uiRoute } from "../../utils";
import { CircleCheckBig } from "lucide-react";

export default function TokenVerifyScreenSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, preAuth } = useSelector((state) => state.auth);





    // Navigate when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(uiRoute.home);
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex">
            <div className="w-6/12 bg-white z-40 flex flex-col items-center justify-center p-8">

                <CircleCheckBig className="text-green-600" size={200} />
                <p className="mt-6 text-lg font-bold text-gray-400">Account Registration sucessful</p>
                <p className="text-gray-400 ">Your account has has been successfully created</p>
                <button
                    type="button"
                    onClick={() => { navigate("/") }}
                    className="w-6/12 text-white text-shadow-black   cursor-pointer mt-10  py-3 px-4 rounded-full bg-[linear-gradient(0deg,#938E07,#F9F10C)] active:scale-95 transition-transform duration-200 focus:ring-opacity-50"
                >
                    Back to Sign in
                </button>

            </div>

            <RightBG title={"Welcome Aboard!"} />
        </div>
    );
}
