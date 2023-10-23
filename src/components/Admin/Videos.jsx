import { useContext, useEffect, useState } from "react";
import Spinner from '../Loading/Spinner';
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from '../Loading/ButtonLoader';
const Videos = ()=>{

    const context = useContext(adminContext);

    const {videos, imageHost, showToastMessage, getVideos, addNewVideo, updateVideoById, deleteVideoById, playLists, getPlayLists } = context;

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oldPicSource, setOldPicSource] = useState("");
    const [delVideo, setDelVideo] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    
    const [video, setVideo] = useState({
        title: "",
        url: "",
        description: "",
        slug: "",
        thumbnail: "",
        playlist: "",
        access_type: "basic"
    });

    const [editVideo, setEditVideo] = useState({
        _id: "",
        title: "",
        url: "",
        description: "",
        thumbnail: "",
        playlist: "",
        access_type: "",
        slug: "",
    });

    useEffect(() => {
        setLoading(true);
        getVideos();
        getPlayLists();
        setLoading(false);
        // eslint-disable-next-line
    }, [])


    const addOrUpdateVideo = async (e)=>{
        e.preventDefault();
        const data = new FormData();
        if(editVideo._id){
            // validations
            if(editVideo.title.length === 0 || editVideo.url.length === 0 || editVideo.description.length === 0){
                showToastMessage("Please fill out all fields!","warning")
                return;
            }
            if(!editVideo.playlist){
                showToastMessage("Please select a playist for the video!","warning")
                return;
            }
            if(editVideo.access_type.length === 0){
                showToastMessage("Please specify access type for the video!","warning")
                return;
            }
            // data
            data.append("title",editVideo.title);
            data.append("url",editVideo.url);
            data.append("description",editVideo.description);
            data.append("playlist",editVideo.playlist);
            data.append("access_type",editVideo.access_type);
            data.append("slug",editVideo.slug);
            data.append("thumbnail",videoThumbnail);
            
            setLoading(true);


            let updateResult = await updateVideoById(data,editVideo._id);
            if(updateResult){
                closeModal();
            }
            setLoading(false);
            
        }else{
            // validations
            if(video.title.length === 0 || video.url.length === 0 || video.description.length === 0){
                showToastMessage("Please fill out all fields!","warning")
                return;
            }
            if(!video.playlist){
                showToastMessage("Please select a playist for new video!","warning")
                return;
            }
            if(video.access_type.length === 0){
                showToastMessage("Please specify access type for new video!","warning")
                return;
            }
            setLoading(true);

            // data
            data.append("title",video.title);
            data.append("url",video.url);
            data.append("description",video.description);
            data.append("playlist",video.playlist);
            data.append("access_type",video.access_type);
            data.append("slug",video.slug);
            data.append("thumbnail",videoThumbnail);
            
            let addResult = await addNewVideo(data);
            if(addResult){
                closeModal();
            }
            
            setLoading(false);
        }
    }
    
    const deleteVideo = async ()=>{
        if(delVideo.length > 0){
            setLoading(true);
            let delResult = await deleteVideoById(delVideo);
            if(delResult){
                setDelVideo("");
            }
            setShowDeleteModal(false);
            setLoading(false);
        }
    }
    
    const editVideoModal = (id)=>{
        const selectedVideo = videos.filter(video => video._id === id);
        setEditVideo({
            _id: selectedVideo[0]._id,
            title: selectedVideo[0].title,
            url: selectedVideo[0].url,
            description: selectedVideo[0].description,
            access_type: selectedVideo[0].access_type,
            slug: selectedVideo[0].slug,
            playlist: selectedVideo[0].playlist ? selectedVideo[0].playlist._id : ""
        });

        setOldPicSource(`${imageHost}` + selectedVideo[0].thumbnail);

        setShowModal(true);
    }
    
    const closeModal = ()=>{
        setEditVideo({
            _id: "",
            title: "",
            url: "",
            description: "",
            access_type: "",
            playlist: "",
            slug: ""
        });

        setVideo({
            title: "",
            url: "",
            description: "",
            access_type: "",
            playlist: "",
            slug: ""
        });

        setOldPicSource("");
        setShowModal(false);
    }

    const onChange = (e)=>{
        setVideo({...video,[e.target.name]: e.target.value});
        setEditVideo({...editVideo,[e.target.name]: e.target.value});
    }

    const setSlug = ()=>{
        let text = editVideo.title;
        let slug = convertToSlug(text);
        setVideo({...video,slug: slug});
        setEditVideo({...editVideo,slug : slug});
    }

    function convertToSlug(Text) {
        return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }  
    
    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl font-bold text-white">Videos</h1>
                                <div className="flex justify-end">
                                    <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                        onClick={()=>{setShowModal(true)}}
                                    >
                                        <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                        <span className="ml-3">Create</span>
                                    </button>
                                </div>
                                {
                                    showDeleteModal ? 
                                    <>
                                    <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                    <h3 className="text-xl font-semibold">
                                                        Are you sure you want to delete this video?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDeleteModal(false);
                                                            setDelVideo("");
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={()=>{
                                                            deleteVideo();
                                                        }}
                                                    className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        {
                                                            loading ? <ButtonLoader/> : "Confirm"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </> : null
                                }
                                {showModal ? (
                                    <>
                                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Video
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form onSubmit={addOrUpdateVideo} className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Video Title
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    onBlur={()=>{setSlug()}}  onChange={onChange} value={editVideo.title} id="title" type="text" name="title" placeholder="Video Title..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                                                                    Slug
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                name="slug" value={editVideo.slug || ""} onChange={onChange} id="slug" type="text" placeholder="Slug..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Video ID
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                name="url" onChange={onChange} id="url" value={editVideo.url} type="text" placeholder="Video ID..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Description
                                                                </label>
                                                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                name="description" value={editVideo.description} onChange={onChange} id="description" type="text" placeholder="Description..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                                                                    Thumbnail
                                                                </label>
                                                                {
                                                                    oldPicSource.length > 0 && 
                                                                    <div className="flex flex-row items-center mx-2">
                                                                        <p>Old Thumbnail Picture: </p>
                                                                        <img className="h-10 w-10" src={oldPicSource} alt=""/>
                                                                    </div>
                                                                }
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    name="thumbnail" onChange={(e)=>{setVideoThumbnail(e.target.files[0])}} id="thumbnail" type="file" accept=".jpg, .jpeg, .png"/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playlist">
                                                                    Playlist
                                                                </label>
                                                                <select defaultValue={editVideo.playlist} id="playlist" name="playlist" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        playLists.map((listItem)=>{
                                                                            return <option key={listItem._id} value={listItem._id}>{listItem.title}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="access_type">
                                                                    Access Type
                                                                </label>
                                                                <select defaultValue={editVideo.access_type} id="access_type" name="access_type" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    <option defaultValue value="basic">Basic</option>
                                                                    <option value="standard">Standard</option>
                                                                    <option value="premium">Premium</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <button 
                                                                    disabled={loading}
                                                                    type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        loading ? <ButtonLoader/> : "Save"
                                                                    }
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                    </>
                                    ) : null}
                            </div>
                            {loading ?
                            <Spinner />            
                            :
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-white dark:text-gray-400 table-fixed">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Video ID
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Playlist
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Comments
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Views
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            videos.length > 0 && videos.map((video)=>{
                                                return <tr key={video._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                    <td className="px-6 py-4">
                                                        {video.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            video.description && video.description.length > 100 ?
                                                             `${video.description.substring(0, 30)}...` : video.description
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.url}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.playlist ? video.playlist.title : "Playlist Removed"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.comments ? video.comments.length : "0"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.views}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={()=>{
                                                            editVideoModal(video._id)
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button> 
                                                        <span className="mx-1">
                                                            |
                                                        </span>
                                                        <button onClick={()=>{
                                                            setShowDeleteModal(true);
                                                            setDelVideo(video._id);
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Delete </button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );

}

export default Videos;