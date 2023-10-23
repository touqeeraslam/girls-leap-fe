import React from 'react'
import { Outlet } from 'react-router-dom'

import AuthState from '../../context/auth/AuthState';

export default function HomeAdmin() {
  
  return (
    <AuthState>
      <div>
        <Outlet />
      </div>
    </AuthState>
  )
}
