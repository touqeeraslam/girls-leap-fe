import React from 'react'
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom'

import AdminState from '../../context/admin/AdminState';

export default function HomeAdmin() {
  
  return (
    <AdminState>
      <div>
        <SideBar/>
        <Outlet />
      </div>
    </AdminState>
  )
}
