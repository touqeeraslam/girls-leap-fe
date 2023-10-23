import React, { useState, useEffect, useContext } from "react";
import { PlaylistAdd } from "@mui/icons-material";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useParams } from "react-router-dom";
import VIE from "./VideoItemExample";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { EmailShareButton } from 'react-share';
import clientContext from "../../../context/client/clientContext";
import { Tooltip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const PlayListPage = ()=>{

    const context = useContext(clientContext);

    const { playList, getPlayList, addToMyList, videosInPlaylist, removeFromMyList, playListViewCount, playListLocked, imageHost } = context;

    const params = useParams();
    
    const [loading, setLoading] = useState(false);
    const [localAddedToList, setlocalAddedToList] = useState(false);
   
    const addItemToList = async (id)=>{
        let data = new FormData();
        data.append("id",id);
        data.append("type","playlist");
        let addToListResult = await addToMyList(data);
        if(addToListResult){
            setlocalAddedToList(true);
        }
    }

    const removeItem = async(id)=>{
        let removeResult = await removeFromMyList(id);
        if(removeResult){
            setlocalAddedToList(false);
        }
    }

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

                            {
                                localStorage.getItem('token') ?
                                (   
                                    !localAddedToList ?
                                    <Tooltip title={"Add to My List"} placement="left" arrow>
                                        <button className="mt-3 badge mr-2 bg-gray-500 p-3 text-gray-200 p-1 px-2 text-md font-bold"
                                            onClick={()=>{addItemToList(playList._id)}} >
                                            <PlaylistAdd fontSize="small"/> My List
                                        </button>
                                    </Tooltip> :
                                    <Tooltip title={"Remove from My List"} placement="left" arrow>
                                        <button className="mt-3 badge mr-2 bg-gray-500 p-3 text-gray-200 p-1 px-2 text-md font-bold"
                                            onClick={()=>{removeItem(playList._id)}} >
                                            <PlaylistAddCheckIcon fontSize="small"/> My List    
                                            </button>
                                    </Tooltip>
                                ) : 
                                <a href="/auth/signup" className="btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border py-3 px-4 mr-2 text-white font-bold">
                                    WATCH FREE
                                </a>
                            }
                            {
                                !loading && playList &&
                                <form className="rounded mt-4 lg:w-8/12 xl:w-7/12 2xl:w-6/12">
                                    <div className="flex flex-row lg:justify-between mb-4 gap-4 lg:gap-2">
                                        <h3 className="xl:w-5/12 mt-4 text-lg font-semibold text-white mb-4">
                                            Social Share:
                                        </h3>
                                        <FacebookShareButton
                                            className="xl:w-2/12"
                                            url={window.location.href}
                                            hashtag={"#girlsleap"}
                                            quote={`${playList.title}`}
                                            description={`${playList.description}`} >
                                            <div className="bg-[#182031] hover:bg-[#050c9c] w-[50px] h-[50px] flex items-center justify-center ">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                                                    height="50%" width="90%" fill="white"
                                                >
                                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                                                </svg>
                                            </div>
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            className='xl:w-2/12'
                                            quote={`${playList.title}`}
                                            url={window.location.href}
                                            hashtags={["girlsleap", "alkeme"]}>
                                            <div className="bg-[#182031] hover:bg-[#050c9c] w-[50px] h-[50px] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                    fill="white" height="70%" width="90%"
                                                >
                                                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                                                </svg>
                                            </div>
                                        </TwitterShareButton>
                                        <EmailShareButton
                                            className='xl:w-2/12'
                                            quote={`${playList.title}`}
                                            url={window.location.href}
                                            hashtags={[`${playList.title}`, "girlsleap"]} >
                                            <div className="bg-[#182031] hover:bg-[#050c9c]  w-[50px] h-[50px] flex items-center justify-center ">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80%" height="80%">
                                                    <path d="M22 4H2C0.895 4 0 4.895 0 6v12c0 1.105.895 2 2 2h20c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 3.18L12 13.69 2 7.18V6l10 6.51L22 6v1.18z"/>
                                                </svg>
                                            </div>
                                        </EmailShareButton>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
                <hr className="lg:w-10/12 xl:w-9/12 mx-auto bg-white md:w-[95%] xl:w-[82%] 2xl:w-[75%]"/>
                <div className="grid w-full p-3 2xl:w-9/12 lg:w-9/12 xl:w-10/12 sm:grid-cols-1 md:w-10/12 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        !loading && playList &&
                        videosInPlaylist.map((item)=>{
                            return <div key={item._id} className="cursor-pointer">
                                <VIE locked={playListLocked} playlistslug={playList.slug} thumbnailUrl={item.thumbnail} description={item.description} title={item.title} id={item._id} videoSlug={item.slug} duration={item.duration} />
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default PlayListPage;