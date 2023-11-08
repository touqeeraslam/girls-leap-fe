import React from 'react'
import ClientNavbar from './Navbar/ClientNavbar'
import ClientFooter from './Footer/ClientFooter'
import { Outlet, useNavigate } from 'react-router-dom'
import ClientState from '../../context/client/ClientState';


export default function Main() {
  return (
    <ClientState>
      <div>
        <ClientNavbar/>
        <Outlet/>
        <ClientFooter/>
      </div>
    </ClientState>
  )
}
