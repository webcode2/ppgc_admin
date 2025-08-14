import React, { useRef } from "react";

export default function TokenInput({ otp, setOtp, length = 5 }) {
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return; // allow only single alphanumeric

        const otpArray = otp.split("");
        otpArray[index] = value;
        setOtp(otpArray.join(""));

        if (value && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div className="flex gap-2">
            {Array.from({ length }, (_, i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-14 h-14 border border-gray-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        />
            ))}
        </div>
    );
}
