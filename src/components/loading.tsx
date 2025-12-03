import React from 'react'

function Loading({ text = "Loading" }) {
    return (

        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#938E07]"></div>
                <p className="text-gray-600">{text}</p>
            </div>
        </div>
    )
}

export default Loading