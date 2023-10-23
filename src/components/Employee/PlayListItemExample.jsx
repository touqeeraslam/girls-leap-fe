import React, { useContext } from "react";
import { useState } from "react";
import { PlaylistAdd } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import employeeContext from "../../context/employee/employeeContext";

const PIE = ({id, thumbnailUrl, description, title, videos, slug})=>{
    
    const [showListOption, setShowListOption] = useState(false);

    const context = useContext(employeeContext);

    const { addToMyList, removeFromMyList, imageHost } = context;

    const [addedToList, setAddedToList] = useState(false);

    const addItemToMyList = async (vidid)=>{
        let data = new FormData();
        data.append("id",vidid);
        data.append("type","playlist");
        let addToList = await addToMyList(data);
        if(addToList){
            setAddedToList(true);
        }
    }

    const removeItemFromList = async(vidid)=>{
        let removeResult = await removeFromMyList(vidid);
        if(removeResult){
            setAddedToList(false);
        }
    }

    const showOption = ()=>{
        if(localStorage.getItem('token')){
            setShowListOption(true);
        }
    }

    const hideOption = ()=>{
        setShowListOption(false);
    }

    return (
        <>
            <Tooltip placement="right" arrow
                title={
                    <React.Fragment>
                        <h1 color="inherit" className="text-xl font-bold">{title}</h1>
                        <p className="text-md font-medium">
                            {description}
                        </p>
                    </React.Fragment>
                }
            >
                <div className="cursor-pointer p-2 mx-auto lg:mx-1 xl:mx-2 xl:p-1 2xl:mx-3 overflow-hidden m-2"
                    onMouseEnter={ ()=>{ showOption() } } onMouseLeave={()=>{hideOption()}}>
                    <div className="relative curosr-pointer">
                        {
                            showListOption &&
                            (
                                !addedToList ? 
                                <div className="badge absolute fixed top-0 right-0 bg-gray-500 m-1 p-1 px-2 text-xs font-bold rounded" >
                                    <Tooltip title={"Add to My List"} placement="left" arrow>
                                        <PlaylistAdd  onClick={()=>{addItemToMyList(id)}} />
                                    </Tooltip> 
                                </div> :  <div className="badge absolute fixed top-0 right-0 bg-gray-500 m-1 p-1 px-2 text-xs font-bold rounded">
                                    <Tooltip title={"Remove From List"} placement="left" arrow>
                                        <PlaylistAddCheckIcon  onClick={()=>{removeItemFromList(id)}} />
                                    </Tooltip>
                                </div>
                            ) 
                        }
                        <a href={`/employee/playlist/${slug}`}>
                            <img className="w-full object-contain" src={`${imageHost}` + thumbnailUrl} alt={title} />
                        </a>
                    </div>
                    <div className="py-2">
                        <a href={`/employee/playlist/${slug}`}>
                            <div className="block font-sans text-base mb-2 text-white">{title}</div>
                            <p className='text-white text-sm font-sans'>{videos} Videos</p>
                        </a>
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default PIE;