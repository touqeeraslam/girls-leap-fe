import React, { useContext } from "react";
import { useState } from "react";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Tooltip } from "@mui/material";
import clientContext from "../../../context/client/clientContext";


const PLML = ({id,thumbnailUrl, title, description, videos, slug})=>{
    
    const [showListOption, setShowListOption] = useState(false);
    
    const context = useContext(clientContext);

    const { removeFromMyList, imageHost } = context;

    const addToPlayList = async (vidid)=>{
        let remove = await removeFromMyList(vidid);
        if(remove){
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
                <div className="cursor-pointer p-2 mx-auto lg:mx-1 lg:p-1 xl:mx-2 xl:p-0 2xl:mx-3 overflow-hidden shadow-lg m-2"
                    onMouseEnter={ ()=>{ showOption() } } onMouseLeave={()=>{hideOption()}}>
                    <div className="relative curosr-pointer">
                        <a href={`/playlist/${slug}`}>
                            <img className="w-full h-[187px] xl:max-h-[257px] 2xl:h-[243px]" src={`${imageHost}` + thumbnailUrl} alt={title}/>
                        </a>
                        {
                            showListOption ?
                            <div className="badge absolute top-0 right-0 bg-gray-500 m-1  p-1 px-2 text-xs font-bold rounded" onClick={
                            ()=>{addToPlayList(id,"playlist")}
                            }>
                                <Tooltip title={"Remove from My List"} placement="left" arrow>
                                    <PlaylistAddCheckIcon />      
                                </Tooltip>  
                            </div>  : null
                        }
                    </div>
                    <div className="py-2">
                        <a href={`/playlist/${slug}`}>
                            <div className="block font-sans text-base mb-2 text-white">{title}</div>
                            <p className='text-white text-sm font-sans'>{videos} Videos</p>
                        </a>
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default PLML;