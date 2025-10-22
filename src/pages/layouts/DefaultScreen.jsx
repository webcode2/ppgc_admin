import React from 'react'
import { Outlet } from "react-router-dom"
import Header from "../../components/Header"

function DefaultScreen() {
    return (

        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default DefaultScreen