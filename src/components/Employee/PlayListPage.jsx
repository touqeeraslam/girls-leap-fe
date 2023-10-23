import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import VIE from "./VIE";
import VisibilityIcon from '@mui/icons-material/Visibility';
import employeeContext from "../../context/employee/employeeContext";

const PlayListPageEmployee = ()=>{

    const context = useContext(employeeContext);

    const { playList, getPlayList, videosInPlaylist, playListViewCount,  imageHost } = context;

    const params = useParams();
    
    const [loading, setLoading] = useState(false);

  

    useEffect(() => {
        setLoading(true);
        getPlayList(params.playlistname);
        setLoading(false);
        // eslint-disable-next-line
    }, [params.playlistname])
    
    return (
        <>
            <div style={{minHeight: '90vh'}} className="font-sans text-white mt-4 mb-4 ">
                <div className="md:mx-4 lg:mx-0 mt-4 mb-4">
                    <div className="flex flex-col sm:flex-row content-center w-full mx-auto 2xl:w-9/12 xl:w-10/12 xl:p-2 lg:w-10/12">
                        <div className="w-10/12 h-auto sm:w-1/2 mt-8 mx-auto sm:mr-4">
                            {
                                !loading && playList &&
                                <img className="object-fit" src={`${imageHost}` + playList.thumbnail}  alt="Playlist Thumbnail" />
                            }
                        </div>
                        <div className='w-11/12 sm:w-1/2 mx-auto ml-4 xl:mt-8'>
                            <h2 className="text-bold mb-4 mt-4" style={{fontSize: '2rem'}}>
                                {
                                    !loading && playList &&
                                    playList.title
                                }
                            </h2>
                            <p className="text-lg mt-2">
                                
                                {playList && playList.videos.length} Video(s) <span className="w-[10px]"> | </span> <VisibilityIcon/> {playListViewCount} Views 
                                
                            </p>
                            <p className="text-lg mt-4 mb-4">
                                {
                                    !loading && playList &&
                                    (                                        
                                        playList.description.length > 250 ?
                                        `${playList.description.substring(0, 250)}...` : playList.description
                                    )
                                }
                            </p>

                      
                           
                        </div>
                    </div>
                </div>
                <hr className="lg:w-10/12 xl:w-9/12 mx-auto bg-white md:w-[95%] xl:w-[82%] 2xl:w-[75%]"/>
                <div className="grid w-full p-3 2xl:w-9/12 lg:w-9/12 xl:w-10/12 sm:grid-cols-1 md:w-10/12 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        !loading && playList &&
                        videosInPlaylist.map((item)=>{
                            return <div key={item._id} className="cursor-pointer">
                                <VIE  playlistslug={playList.slug} thumbnailUrl={item.thumbnail} description={item.description} title={item.title} id={item._id} videoSlug={item.slug} duration={item.duration} />
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default PlayListPageEmployee;