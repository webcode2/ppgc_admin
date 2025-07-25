import React from 'react'
import { Outlet } from "react-router-dom"

function DefaultScreen() {
    return (
        <div><Outlet /></div>
    )
}

export default DefaultScreen