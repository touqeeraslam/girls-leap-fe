import React from "react";

import Playlist from "./Statistics/Playlist";
import Videos from "./Statistics/Video";

const HomePageCoach = ()=>{
    
    return (
        <>
            <div className="min-h-[86vh] mt-[18px] container mt-4 w-full m-auto">
                <div className="relative overflow-x-auto">
                    <div className="items-center mb-4">
                        <h1 className="mt-2 font-serif text-2xl text-white font-bold text-center">Coach Home Page</h1>
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    <div className="items-center mb-4">
                        <Playlist/>
                    </div>
                    <div className="items-center mb-4">
                        <Videos/>
                    </div>
                </div>

            </div>
        </>
    );

}

export default HomePageCoach;