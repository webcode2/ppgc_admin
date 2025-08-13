import React, { useState } from "react";
import OtpInput from "react-otp-input";

export default function App() {
    const [otp, setOtp] = useState("");

    return (
        <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={5}
            renderSeparator={<span></span>}
            inputStyle={"p-6 border border-gray-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"}
            containerStyle="flex gap-2"
            inputType="text"

            renderInput={(props) => <input {...props} />}
        />
    );
}
