import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Users from "./Statistics/Users";
import PlaylistStatistics from "../Admin/Statistics/Playlist";
const HomePageOrganization = ()=>{
    
    let navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
    }, [navigate])
    

    return (
        <>
            <div className="p-4 sm:ml-64 mb-4">
                <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                    <h2 className="text-white text-center text-4xl">Dashboard</h2>
                </div>
                <div className="w-full flex flex-row p-4 mt-4 dark:border-gray-700 max-h-[350px] mb-4">
                    <div className="w-1/2">
                        <Users/> 
                    </div>
                    <div className="mx-4 w-1/2">
                    <PlaylistStatistics/>
                    </div>
                </div>
            </div>
            
        </>
    );

}

export default HomePageOrganization;