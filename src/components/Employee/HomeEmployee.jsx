import React from 'react'
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom'

import EmployeeState from '../../context/employee/employeeState';

export default function HomeEmployee() {
  
  return (
    <EmployeeState>
      <div>
        <Navbar/>
        <Outlet />
      </div>
    </EmployeeState>
  )
}
