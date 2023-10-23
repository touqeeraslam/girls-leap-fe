import React from 'react'
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom'

import OrganizationState from '../../context/organization/organizationState';

export default function HomeAdmin() {
  
  return (
    <OrganizationState>
      <div>
        <SideBar/>
        <Outlet />
      </div>
    </OrganizationState>
  )
}
