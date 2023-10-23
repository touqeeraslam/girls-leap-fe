import React, { useContext } from "react";
import { useState } from "react";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Tooltip } from "@mui/material";
import clientContext from "../../../context/client/clientContext";

const VIL = ({id, thumbnailUrl, title, description, slug, duration, videoSlug })=>{

    const [showListOption, setShowListOption] = useState(false);
    
    const context = useContext(clientContext);

    const { removeFromMyList, imageHost } = context;

    const addToPlayList = async (vidid)=>{
        let removedItem = await removeFromMyList(vidid);
        if(removedItem){
            window.location.reload();
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

    function secondsToTime(secs)
    {
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return minutes + ":" + seconds;
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
                <div className="cursor-pointer p-3 mx-auto lg:mx-1 lg:p-1 xl:mx-2 xl:p-0 2xl:mx-3 overflow-hidden shadow-lg m-2"
                    onMouseEnter={ ()=>{showOption()}} onMouseLeave={()=>{hideOption()}} >
                    <div className="relative cursor-pointer">
                        
                        <a href={`/${slug}/videos/${videoSlug}`}>
                            <img className="w-full h-[187px] xl:max-h-[257px] 2xl:h-[243px]" src={`${imageHost}` + thumbnailUrl} alt={title}/>
                        </a>

                        <span className="absolute bottom-1 right-1 bg-gray-800 text-white px-2 py-1 text-xs rounded brand-color">
                            {secondsToTime(duration)}
                        </span>
                        {
                            showListOption ?
                            <div className="badge absolute top-0 right-0 bg-gray-500 m-1  p-1 px-2 text-xs font-bold rounded" onClick={
                            ()=>{addToPlayList(id)}
                            }>
                                <Tooltip title={"Remove from My List"} placement="left" arrow>
                                    <PlaylistAddCheckIcon />      
                                </Tooltip>    
                            </div>  : null
                        }
                    </div>
                    <div className="py-4">
                        <a href={`/${slug}/videos/${videoSlug}`}>
                            <div className="block font-sans text-base mb-2 text-white">
                                {title}
                            </div>
                        </a>
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default VIL;