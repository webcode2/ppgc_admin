import React from 'react'
import AddNewMessage from "./AddNewMessage"

function Modal() {
    return (
        <div className="h-screen absolute  bg-black/40 backdrop-blur-sm w-full bottom-0  ">

            <div className="lg:w-9/12 h-10/12 bg-white shadow-2xl overflow-auto shadow-amber-300 mx-auto absolute bottom-10 right-0 left-0 py-16 px-5 rounded-2xl  ">
                <div className="close text-5xl place-self-end">X</div>
                <AddNewMessage />
            </div>
            <div className="relative bg-red-400">


            </div>
        </div>
    )
}

export default Modal