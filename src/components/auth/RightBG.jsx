import React from 'react'

function RightBG({ title }) {
    return <div className=" relative bg w-6/12 bg-gradient-to-bl from-[#F9F10C] to-[#938E07]">
        <div className="circle w-80 h-80 bg-white rounded-full absolute left-20 -top-12 bg-gradient-to-bl from-[#938E07] to-[#F9F10C]">            </div>

        <div className="circle w-80 h-80 bg-white rounded-full absolute -top-5 -left-32 bg-gradient-to-bl from-[#F9F10C] to-[#938E07] rotate-3">            </div>
        <div className="circle w-32 h-32 bg-white rounded-full absolute bottom-14 left-40 bg-gradient-to-bl from-[#938E07] to-[#F9F10C]">            </div>
        <div className="reg absolute bottom-10 left-10  w-30 text-white">
            <p className=" font-bold text-2xl"> {title}</p>
        </div>
    </div>;
}

export default RightBG