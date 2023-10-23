import React from 'react'
import NavbarCoach from './Navbar/NavbarCoach';
import FooterCoach from './Footer/FooterCoach';
import { Outlet } from 'react-router-dom';

import CoachState from '../../context/coach/CoachState';

export default function Home() {
    return (
      <CoachState>
        <div>
          <NavbarCoach/>
          <Outlet/>
          <FooterCoach/>
        </div>
      </CoachState>   
    )
}
