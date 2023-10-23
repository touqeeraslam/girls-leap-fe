import React, { useContext } from "react";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import employeeContext from "../../context/employee/employeeContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const VIE = ({id, thumbnailUrl, title, description, duration, videoSlug})=>{

    
    const context = useContext(employeeContext);

    const { imageHost } = context;

    function secondsToTime(secs)
    {
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return minutes + ":" + seconds;
    }

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
                  >
                    <div className="relative cursor-pointer">
                        <a href={`/employee/playlist/videos/${videoSlug}`} >
                            <div onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave} >
                                <img
                                    src={`${imageHost}` + thumbnailUrl}
                                    alt={title}
                                    className={`w-full h-[170px] object-cover xl:max-h-[257px] 2xl:h-[243px] h-auto transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-100'}`}
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
                        <span className="absolute bottom-1 right-1 text-white px-2 py-1 text-xs rounded bg-black">
                            {secondsToTime(duration)}
                        </span>
                            
                        
                    </div>
                    <div className="py-4">
                        <div className="block font-sans text-base mb-2 text-white">
                            <a href={`/employee/playlist/videos/${title}`}>
                                {title}
                            </a>
                        </div>
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default VIE;