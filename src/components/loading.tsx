import React from 'react'

function Loading() {
    return (

        <div className="bg-white text-gray-900 font-sans py-20 flex items-center justify-center my-auto rounded-lg">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#938E07]"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    )
}

export default Loading