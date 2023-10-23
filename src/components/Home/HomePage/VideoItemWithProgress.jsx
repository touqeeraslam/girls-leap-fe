import React, { useContext } from "react";
import { useState } from "react";
import { PlaylistAdd } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import clientContext from "../../../context/client/clientContext";
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import { EmailShareButton, EmailIcon } from 'react-share';

const VIWP = ({id, thumbnailUrl, title, slug, description, progress, duration, videoSlug})=>{

    const [showListOption, setShowListOption] = useState(false);
    const [localAddedToList, setlocalAddedToList] = useState(false);
    
    const context = useContext(clientContext);

    const { addToMyList, removeFromMyList, imageHost } = context;

    const addToPlayList = async (vidid)=>{
        const data = new FormData();
        data.append("id",vidid);
        data.append("type","video");
        let addtolist = await addToMyList(data);
        if(addtolist){
            setlocalAddedToList(true);
        }
    }
    
    const removeFromList = async (id)=>{
        let removed = await removeFromMyList(id);
        if(removed){
            setlocalAddedToList(false);
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
    const tooltipStyle = {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
    };
    
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    
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
                    onMouseEnter={ ()=>{showOption()}} onMouseLeave={()=>{hideOption()}} 
                    >
                    <div className="relative cursor-pointer">
                        <a href={`/video/${videoSlug}`}>
                            <div onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave} >
                                <img
                                    src={`${imageHost}` + thumbnailUrl}
                                    alt={title}
                                    className={`w-full h-[170px] xl:max-h-[257px] 2xl:h-[243px] h-auto transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-100'}`}
                                />
                                {isHovered && (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <div className="brand-color w-16 h-16 rounded-full flex justify-center items-center">
                                                <PlayArrowIcon fontSize="large"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </a>
                        <span className="absolute bottom-5 right-1 bg-gray-800 text-white px-2 py-1 text-xs rounded brand-color">
                            {(secondsToTime(duration))}
                        </span>
                        <div className="absolute w-11/12 ml-4 bottom-2 h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div className=" h-full bg-blue-500 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s' }}></div>
                        </div>
                        {
                            showListOption && (
                                <div className="mr-2 badge absolute top-0 right-10 bg-transparent m-1 p-1 text-xs font-bold rounded">
                                    <Tooltip style={tooltipStyle} title={
                                        <div>
                                            <div className="w-full flex items-center justify-center rounded-md">
                                                <FacebookShareButton
                                                    url={window.location.href}
                                                    hashtag={`#${title}`}
                                                    quote={`${title}`}
                                                    description={`${description}`}
                                                    className="Demo__some-network__share-button"
                                                >
                                                    <FacebookIcon size={32} round /> 
                                                </FacebookShareButton>
                                            </div>

                                            <div className=" w-full flex items-center justify-center rounded-md">
                                                <TwitterShareButton
                                                    quote={`${title}`}
                                                    url={window.location.href}
                                                    hashtag={`#${title}`}
                                                >
                                                    <TwitterIcon size={32} round />
                                                </TwitterShareButton>
                                            </div>
                                            
                                            <div className=" w-full flex items-center justify-center rounded-md">
                                                <EmailShareButton
                                                    quote={`${title}`}
                                                    url={window.location.href}
                                                    hashtag={`#${title}`} >
                                                    <EmailIcon size={32} round />
                                                </EmailShareButton>
                                            </div>
                                        </div>
                                    } placement="bottom" arrow>
                                        <ShareIcon />      
                                    </Tooltip>
                                </div>
                            )
                        }
                        {
                            localStorage.getItem('token') && showListOption ?
                            <div className="badge absolute top-0 right-0 bg-gray-500 m-1  p-1 px-2 text-xs font-bold rounded">
                                {
                                    localAddedToList === false &&
                                    <Tooltip title={"Add to My List"} placement="bottom" arrow>
                                        <PlaylistAdd onClick={()=>{addToPlayList(id)}}/> 
                                    </Tooltip>
                                }
                                {
                                    localAddedToList === true &&
                                    <Tooltip title={"Remove from My List"} placement="bottom" arrow>
                                        <PlaylistAddCheckIcon onClick={()=>{removeFromList(id)}}/> 
                                    </Tooltip>
                                }
                            </div>  : null
                        }
                    </div>
                    <div className="py-4">
                        <a href={`/video/${videoSlug}`}>
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

export default VIWP;