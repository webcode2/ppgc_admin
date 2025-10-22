import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RightBG from "../../components/auth/RightBG";
import TokenInput from "../../components/auth/verifyWithToken";
import { uiRoute } from "../../utils/utils";
import { registerAccount } from "../../store/slice/authSlice";

export default function TokenVerifyScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, preAuth } = useSelector((state) => state.auth);

    const [timerM, setTimerM] = useState(3);
    const [timerS, setTimerS] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [otp, setOtp] = useState("")

    // Navigate when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(uiRoute.home);
        }
    }, [isAuthenticated, navigate]);

    // Countdown timer effect
    useEffect(() => {
        let countdown;

        if (timerM === 0 && timerS === 0) {
            setCanResend(true);
            return;
        }

        countdown = setInterval(() => {
            if (timerS > 0) {
                setTimerS((prev) => prev - 1);
            } else if (timerM > 0) {
                setTimerM((prev) => prev - 1);
                setTimerS(59);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [timerM, timerS]);

    useEffect(() => {
        if (preAuth.authStep === 3) {
            navigate(uiRoute.authSuccess.pageRoute);
        }
    }, [preAuth, navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        // dispatch(loginAccount());

        dispatch(registerAccount(
            {
                "password": preAuth.authPassword,
                "fullname": preAuth.authName,
                "email": preAuth.authEmail,
                "pin": "",
                "code": otp
            }
        ))

    };

    const handleResend = () => {
        if (!canResend) return;
        // TODO: trigger resend action here
        setTimerM(3);
        setTimerS(30);
        setCanResend(false);

    };

    return (
        <div className="min-h-screen flex">
            <div className="w-6/12 bg-white z-40 flex flex-col items-center justify-center p-8">
                <TokenInput otp={otp} setOtp={setOtp} />
                <div className="countdown  my-4 flex">
                    <p className="text-gray-400 text-lg">

                        code expires in &nbsp;
                    </p>
                    <p className="text-lg font-semibold">

                        {timerM}:{timerS.toString().padStart(2, "0")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-6/12 text-white cursor-pointer mt-4  py-3 px-4 rounded-full bg-[linear-gradient(0deg,#938E07,#F9F10C)] active:scale-95 transition-transform duration-200 focus:ring-opacity-50"
                >
                    Verify
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className={`w-6/12 mt-4 font-semibold py-2 px-4 rounded-full border border-gray-600 active:scale-95 transition-transform duration-200 focus:ring-opacity-50 ${canResend
                        ? "text-black cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Send Again
                </button>
            </div>

            <RightBG title={"Welcome back!"} />
        </div>
    );
}
