import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VIE from '../Playlist/VideoItemExample';
import { useNavigate, useParams  } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import Comment from './Comment';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { EmailShareButton } from 'react-share';
import NextVideo from './NextVideoItem';
import ReplayIcon from '@mui/icons-material/Replay';
import clientContext from '../../../context/client/clientContext';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewVideo = ()=>{

    const params = useParams();

    const context = useContext(clientContext);
    
    const { host, video, getLoggedInUser, loggedInUser, checkAvailability, updateViewCount, getVideoPackage, videoPackage,getVideo, nextVideo, postComment, imageHost, handleVideoProgress} = context;
    
    const [userLoggedIn, setUserLoggedIn] = useState(true);
    const [userNotLoggedIn, setUserNotLoggedIn] = useState(false);
    const [nextVideoCountdown, setNextVideoCountdown] = useState(10);
    
    const [videoEnded, setVideoEnded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    let navigate = useNavigate();

    const [comment, setComment] = useState({
        message: ""
    });

    const postCommentNew = async (id)=>{
        const commentResult = await postComment(comment.message, video._id);
        if(commentResult){
            setComment({
                message: ""
            });
        }
    }

    const onChange = (e)=>{
        setComment({...comment, [e.target.name]: e.target.value});
    }

    const handleEnded = ()=>{
        if(nextVideo !== null){
            setUserLoggedIn(false);
            setUserNotLoggedIn(false);
            setVideoEnded(true);
            let countDown = 100;
            const countDownInterval = setInterval(() => {
                countDown--;
                setNextVideoCountdown(countDown);
                if(countDown === 0){
                    clearInterval(countDownInterval);
                    navigate(`/${video.playlist.slug}/videos/${nextVideo.slug}`);
                }
            }, 1000);
        }
    }

    const [videoLocked, setVideoLocked] = useState(false);

    const getPageContent = async(videoSlug)=>{
        await getVideo(videoSlug);
        if(localStorage.getItem("token")){

            let locked = await checkAvailability(videoSlug);

            if(locked){
                setVideoLocked(true);
                setUserLoggedIn(false);
                setUserNotLoggedIn(false);
                setVideoEnded(false);
                return;
            }
                
            let user = await getLoggedInUser();
            
            if(user){
                setUserLoggedIn(true);
                setUserNotLoggedIn(false);
                setVideoEnded(false);
            }else{
                setUserLoggedIn(false);
                setUserNotLoggedIn(true);
                setVideoEnded(false);
            }
        }else if(videoSlug === "girls-leap-trailer"){
            setUserLoggedIn(true);
            setUserNotLoggedIn(false);
            setVideoEnded(false);
        }else{
            setUserLoggedIn(false);
            setUserNotLoggedIn(true);
            setVideoEnded(false);
        }

    }

    useEffect(() => {
        getVideoPackage(params.videoname);
        getPageContent(params.videoname);
        if(localStorage.getItem('token')){
            updateViewCount(params.videoname);
        }
        // eslint-disable-next-line
    }, [params])
    
    function secondsToTime(secs)
    {
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        return minutes + "m " + seconds + "s";
    }

    const handleProgress = async (progress)=>{
        const {playedSeconds } = progress;
        const data = new FormData();
        data.append("progressTime",playedSeconds );
        // we take the progress time and update the overall progress
        await handleVideoProgress(data,video._id);
    }
    
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleReady = async (player)=>{
        const addToMyList = await axios({
            method: 'GET',
            url: `${host}/continuesection/get-progress/${params.videoname}`,
            headers: {
                'Content-Type' : "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const data = addToMyList.data;
        if(data.success){
            if(data.value === video.duration){
                player.seekTo(0);
            }
        }
    }
  


    return (    
        <>
            {
                video && 
                <div className='bg-transparent w-full'>
                    {
                        userLoggedIn ?
                        <div className='flex justify-center items-center xl:h-[82vh] md:h-[60vh] h-[30vh] bg-black' 
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <ReactPlayer
                                url={`https://vimeo.com/${video.url}`}
                                width="100%"
                                height="100%"
                                controls={true}
                                onReady={handleReady}
                                onProgress={handleProgress}
                                onEnded={handleEnded}
                                playing={true}
                            />
                            {
                                isHovered ?
                                <div className={'bg-black invisible md:visible absolute w-11/12 top-2/2 left-1/2 opacity-100 transform -translate-x-1/2 md:-translate-y-50 lg:-translate-y-60 xl:-translate-y-60 text-white p-4'} 
                                    style={{ background: 'none' }} >
                                    <div className='flex w-full justify-start'>
                                        <a href={`/playlist/${video.playlist.slug}`} className="font-sans hover:opacity-80 text-white text-2xl font-bold py-1 px-12 ml-4">
                                            <ArrowBackIosIcon fontSize='small'/>
                                            Back
                                        </a>
                                    </div>
                                </div> : null
                            }
                        </div> : null
                    }
                    {
                        userNotLoggedIn === true ?
                        <div className='xl:h-[82vh] md:h-[60vh] h-[30vh] w-full bg-black'>
                            <img className='h-[30vh] md:h-[60vh] xl:h-[80vh] bg-black w-full md:mt-8 lg:mt-0 object-contain flex items-center justify-center opacity-40' src={`${imageHost}` + video.thumbnail} alt="" />
                            <div className='flex flex-col w-full absolute md:mt-[240px] -top-[-20%] justify-center items-center content-center'>
                                <div className='flex flex-row'>
                                    <h1 className='text-white text-center font-bold text-sm xl:text-2xl py-2 mr-8'>
                                        WATCH THIS VIDEO AND MORE ON GIRLS L.E.A.P
                                    </h1>
                                </div>
                                <div className='flex flex-row h-8 md:h-10'>
                                    <a href={`/auth/signup/${videoPackage !== null ? videoPackage._id : ""}`} className="btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border font-sans mr-4 text-sm md:text-2xl font-bold py-1 px-4 xl:px-12">
                                        Watch Free
                                    </a>
                                    <a href='/trailer/girls-leap-trailer' className="bg-gray-600 ml-4 text-white text-md md:text-xl py-1 px-4 xl:px-12">
                                        Learn More
                                    </a>
                                </div>
                                <div className='flex flex-row invisible md:visible'>
                                    <p className='text-white text-center text-md py-2 mr-8'>
                                        Already registered? <a className='text-yellow-400' href="/auth/login">Sign In</a> 
                                    </p>
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        videoEnded && nextVideo ?
                        <div className='xl:h-[82vh] md:h-[60vh] h-[30vh] w-full bg-black'>
                            <img className='h-[30vh] md:h-[60vh] xl:h-[80vh] w-full md:mt-8 lg:mt-0 object-contain flex items-center justify-center opacity-40' src="/images/darkness.jpg" alt="" />
                            <div className='absolute w-full md:mt-[440px] flex flex-col justify-center items-center z-10 -top-[15%] bottom-0 content-center'>
                                <div className='flex flex-row w-7/12'>
                                    <div className='w-6/12'>
                                        <NextVideo imageHost={imageHost} slug={video.playlist.slug} videoSlug={nextVideo.slug} thumbnailUrl={nextVideo.thumbnail} title={nextVideo.title}/>
                                    </div>
                                        <div className='w-1/12'>
                                        </div>
                                    <div className='w-5/12 flex flex-col text-white'>
                                        <h4 className='text-md mt-4 mb-4'>
                                            Next Video in <span className='text-yellow-400'>{ nextVideoCountdown }</span>
                                        </h4>
                                        <hr/>
                                        <h2 className='mt-4 mb-4 text-2xl font-bold font-sans'>
                                            {nextVideo.title}
                                        </h2>
                                        <p>
                                            {nextVideo.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center h-4 items-center text-yellow-400' >
                                    <a href={`/${video.playlist.slug}/videos/${nextVideo.slug}`}>
                                        <ReplayIcon/> Replay Video    
                                    </a> 
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        videoLocked === true ?
                        <div className='xl:h-[82vh] md:h-[60vh] h-[30vh] w-full bg-black'>
                            <img className='h-[30vh] md:h-[60vh] xl:h-[80vh] bg-black w-full md:mt-8 lg:mt-0 object-contain flex items-center justify-center opacity-40' src={`${imageHost}` + video.thumbnail} alt="" />
                            <div className='absolute w-full md:mt-[420px] flex flex-col justify-center items-center z-10 -top-[40%] bottom-20 content-center'>
                                <div className='flex flex-row '>
                                    <h1 className="text-white text-center font-bold text-sm xl:text-2xl py-2 mr-8">
                                        PLEASE UPGRADE YOUR SUBSCRIPTION TO VIEW THIS VIDEO
                                    </h1>
                                </div>
                                <div className='flex flex-row h-8 md:h-10'>
                                    <a href='/pricing' className="btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border font-sans mr-4 text-sm md:text-2xl font-bold py-1 px-4 xl:px-12">
                                        Subscribe
                                    </a>
                                    <a href='/auth/signup' className="bg-gray-600 ml-4 text-white text-md md:text-xl py-1 px-4 xl:px-12">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            }

            <div className="flex flex-row ml-4 lg:justify-around items-center mt-4 mb-4">
                {
                    video &&
                    <div className="items-center text-white w-10/12 md:w-5/12 xl:w-5/12 2xl:w-5/12 2xl:ml-8">
                        <h1 className="text-4xl mb-1 sm:block">
                            {
                                video.title
                            }
                        </h1>
                        <p>
                        <span>
                            { secondsToTime(video.duration) } &nbsp; <span className="w-[10px]"> | </span> &nbsp; <VisibilityIcon /> {video.views} Views &nbsp; | 
                            &nbsp; {video.playlist.title}
                        </span>
                        </p>
                        <p className='text-sm'> 
                            <ChatBubbleOutlineIcon/> {video.comments.length} Comments
                        </p>
                        <p className='text-sm mt-8 w-full'> 
                            {video.description}
                        </p>
                    </div>
                }
                <div className='w-2/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-1/12'>
                </div>  
            </div>
            
            <div className="flex flex-row ml-4 lg:justify-around items-center mt-4 mb-4">
                {
                    video &&
                    <div className="flex flex-row items-center text-white w-10/12 md:w-5/12 xl:w-5/12 2xl:w-5/12 2xl:ml-8">
                        <h2 className='text-lg'>
                            Social Share : 
                        </h2>
                        <div className='flex flex-row ml-4 gap-8'>
                            <FacebookShareButton
                                className="xl:w-2/12"
                                url={window.location.href}
                                hashtag={"#girlsleap"}
                                quote={`${video.title}`}
                                description={`${video.description}`} >
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
                                quote={`${video.title}`}
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
                                quote={`${video.title}`}
                                url={window.location.href}
                                hashtags={[`${video.title}`, "girlsleap"]} >
                                <div className="bg-[#182031] hover:bg-[#050c9c]  w-[50px] h-[50px] flex items-center justify-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
                                        fill="white" height="70%" width="90%">
                                        <path d="M22 4H2C0.895 4 0 4.895 0 6v12c0 1.105.895 2 2 2h20c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 3.18L12 13.69 2 7.18V6l10 6.51L22 6v1.18z"/>
                                    </svg>
                                </div>
                            </EmailShareButton>
                        </div>
                    </div>
                }
                <div className='w-2/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-1/12'>
                </div>  
            </div>
            
            {
                video && video.playlist.videos.length > 0 &&
                <div className="text-center text-white mt-4 mb-4 text-3xl font-bold">
                    Up Next In <a href={"/playlist/" + video.playlist.slug}>
                        {video.playlist.title}
                    </a>
                </div>
            }
            <div className="mx-auto w-10/12 2xl:w-10/12 lg:w-11/12 md:w-11/12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mr-4">
                {
                    video && video.playlist.videos.map((item)=>{
                        return <div key={item._id}>
                            <VIE id={item._id} videoSlug={item.slug} playlistslug={video.playlist.slug} description={video.des} thumbnailUrl={item.thumbnail} duration={item.duration} title={item.title}/>
                        </div>
                    })
                }
            </div>
            <hr />
            {/* Comments section */}
            {
                video &&
                <div className="max-w-4xl mx-auto rounded-lg p-1 md:p-3 m-10 text-white">
                    <h3 className="font-semibold p-1">{video.comments.length} Comments</h3>
                    <div className="flex flex-col gap-5 m-3">    
                        {
                            localStorage.getItem('token') ?
                            <>
                                <div>
                                    <div className="w-full px-3 mb-2 mt-6 flex flex-row">
                                        {
                                            loggedInUser && loggedInUser.profile_picture ?
                                            <img
                                                className="h-9 w-9 rounded-full mr-2"
                                                src={`${imageHost}` + loggedInUser.profile_picture}
                                                alt=""
                                            /> :
                                            <img
                                                className="h-9 w-9 rounded-full mr-2"
                                                src={'/images/profile.png'}
                                                alt=""
                                            />       
                                        }
                                        <textarea className="text-black bg-gray-100 rounded border border-gray-400 resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
                                            name="message" id="message" value={comment.message} onChange={onChange} placeholder="Comment..." required></textarea>
                                    </div>
                                    <div className="w-full flex justify-between px-3 my-3">
                                        <p className='ml-2'>
                                            Having trouble? <span className='text-blue-500'>Read our FAQ</span>
                                        </p>
                                        <button type="submit"className='px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 text-lg'
                                            onClick={()=>{postCommentNew(video._id)}}
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </> : null
                        }
                        {
                            video.comments && video.comments.map((comment)=>{
                                return <div key={comment._id} >
                                    <Comment comment={comment} user={loggedInUser}/>
                                </div>
                            })
                        }
                    </div>
                </div>
            }
        </>
    );

}

export default ViewVideo;