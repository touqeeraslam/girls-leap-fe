import React from 'react'
import ClientNavbar from './Navbar/ClientNavbar'
import ClientFooter from './Footer/ClientFooter'
import { Outlet, useNavigate } from 'react-router-dom'
import ClientState from '../../context/client/ClientState';
import { useEffect } from 'react';
import axios from 'axios';

export default function Main() {
  const navigate = useNavigate()
  // const host = "http://localhost:5000/api"
  const host = "https://gl2.ithawks.pk/api"
  const getUser = async() => {
  const res =  await axios({
      method:"POST",
      url:`${host}/auth/getuser`,
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    });
    const json = res.data;
    if (json.user.role  === "employee"){
      navigate("/employee")
    }
  }
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getUser();
    }
  })
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
