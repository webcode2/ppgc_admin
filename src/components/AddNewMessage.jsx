import React from 'react'

function AddNewMessage() {
    return (
        <div className="w-9/12 mx-auto pt-2  ">
            <div className="flex gap-x-3">

                <div class="relative mb-4 flex-col flex w-fit">
                    <label for="start_date" class="leading-7 text-sm text-gray-600">Start Date</label>
                    <input type="date" id="start_date" name="start_date" class=" bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div class="relative mb-4 flex-col flex w-fit">
                    <label for="start_date" class="leading-7 text-sm text-gray-600">End Date</label>
                    <input type="date" id="end_date" name="end_date" class=" bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
            </div>
            <div class="relative mb-4 flex-1  ">
                <textarea name="New Message" placeholder="New Notice Message..."
                    className="border rounded-lg w-full text-lg py-2 px-4" id="newmessage" rows={6}>
                </textarea>
            </div>
            <div className=" flex justify-end">

                <button class=" text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Send Message
                </button>
            </div>

        </div>)
}

export default AddNewMessage