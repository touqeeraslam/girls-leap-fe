
import React from "react";
import { useNavigate } from "react-router-dom";

const FooterCoach = ()=>{

    let navigate = useNavigate();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }

    return <footer className="p-4 bg-white lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 bottom-0 left-0 w-screen h-12">
                <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="/logout" onClick={handleLogout} className="mr-4 hover:underline md:mr-6">Logout</a>
                    </li>
                </ul>
            </footer>;
}

export default FooterCoach;