import React from 'react'
import { Outlet } from 'react-router-dom'
import Headers from '../UI/Headers'
import Footers from '../UI/Footers'

const AppLayout = () => {
  return (
    <div>
        <Headers/>
        <Outlet />
        <Footers />
    </div>
  )
}

export default AppLayout