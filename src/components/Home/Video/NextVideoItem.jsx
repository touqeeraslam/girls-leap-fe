import React from "react";

const NextVideo = ({slug, thumbnailUrl, title, videoSlug, imageHost })=>{
    
    return (
        <>
            <div className="cursor-pointer p-3 mx-auto lg:mx-1 lg:p-1 xl:mx-2 xl:p-0 2xl:mx-3 overflow-hidden shadow-lg m-2">
                <div className="relative cursor-pointer">
                    <a href={`/${slug}/videos/${videoSlug}`}>
                        <img className="w-full h-[135px] xl:h-[170px] 2xl:h-[250px] object-cover" src={`${imageHost}` + thumbnailUrl} alt={title}/>
                    </a>
                </div>
                <div className="py-4">
                    <div className="block font-sans text-base mb-2 text-white" >
                        <a href={`/${slug}/videos/${title}`}>
                            {title}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NextVideo;