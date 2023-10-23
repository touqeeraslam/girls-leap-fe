import { useContext, useEffect, useState } from "react";
import Spinner from '../Loading/Spinner';
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from '../Loading/ButtonLoader';

const PlayList = ()=>{

    const context = useContext(adminContext);

    const {imageHost, categories, showToastMessage, getcategories, coaches, getCoaches, playLists, getPlayLists, addNewList, updateListById, deleteListById } = context;

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);

    const [oldPicSource, setOldPicSource] = useState("");
    const [delPlaylist, setDelPlaylist] = useState("");
    const [showDelModal, setShowDelModal] = useState(false);

    const [playList, setPlayList] = useState({
        title: "",
        description: "",
        category: "",
        slug: "",
        coach: "",
        homePage: ""
    });
    
    const [editPlayList, setEditPlayList] = useState({
        _id : "",
        title: "",
        description: "",
        category: "",
        coach: "",
        slug: "",
        homePage: ""
    });

    useEffect(() => {
        setLoading(true);
        // get playlists
        getPlayLists();
        getcategories();
        getCoaches();
        setLoading(false);
        // eslint-disable-next-line
    }, [])
    

    const addOrUpdateVideo = async (e)=>{
        e.preventDefault();
        let data = new FormData();

        if(editPlayList._id){
            console.log(editPlayList);
            // validations
            if(editPlayList.title.length === 0 || editPlayList.description.length === 0 || editPlayList.slug.length === 0){
                showToastMessage("Please fill out all fields!","warning");
                return;
            }

            if(!editPlayList.category){
                showToastMessage("Please select a category for new Playlist!","warning");
                return;
            }

            if(editPlayList.category.length === 0){
                showToastMessage("Please select a category for new Playlist!","warning");
                return;
            }

            if(editPlayList.coach.length === 0){
                showToastMessage("Please select a coach for new Playlist!","warning");
                return;
            }

            if(editPlayList.homePage === "on"){
                editPlayList.homePage = true;
            }else if(editPlayList.homePage === "off" || editPlayList.homePage === ""){
                editPlayList.homePage = false;
            }
            
            setLoading(true);

            data.append("title",editPlayList.title);
            data.append("description",editPlayList.description);
            data.append("slug",editPlayList.slug);
            data.append("category",editPlayList.category);
            data.append("coach",editPlayList.coach);
            data.append("onHomePage",editPlayList.homePage);
            data.append("thumbnail",thumbnail);
            
            let updateResult = await updateListById(data,editPlayList._id);
            if(updateResult){
                closeModal();
            }

            setLoading(false);

        }else{

            if(playList.title.length === 0 || playList.description.length === 0 || playList.slug.length === 0){
                showToastMessage("Please fill out all fields!","warning");
                return;
            }

            if(thumbnail === null){
                showToastMessage("Please select a thumbnail image file for new Playlist!","warning");
                return;
            }

            if(playList.category.length === 0){
                showToastMessage("Please select a category for new Playlist!","warning");
                return;
            }

            if(playList.coach.length === 0){
                showToastMessage("Please select a coach for new Playlist!","warning");
                return;
            }

            if(playList.homePage === "on"){
                playList.homePage = true;
            }else if(playList.homePage === "off" || playList.homePage === ""){
                playList.homePage = false;
            }

            setLoading(true);
            
            data.append("title",playList.title);
            data.append("description",playList.description);
            data.append("slug",playList.slug);
            data.append("category",playList.category);
            data.append("coach",playList.coach);
            data.append("onHomePage",playList.homePage);
            data.append("thumbnail",thumbnail);

            let addResult = await addNewList(data);
            if(addResult){
                closeModal();
            }
    
            setLoading(false);
        }
    }

    const editPlaylist = async (id)=>{
        const selectedPlayList = playLists.filter(pl => pl._id === id);
        setEditPlayList({
            _id: selectedPlayList[0]._id,
            title: selectedPlayList[0].title,
            description: selectedPlayList[0].description,
            category: selectedPlayList[0].category ? selectedPlayList[0].category._id : "",
            slug: selectedPlayList[0].slug,
            coach: selectedPlayList[0].coach ? selectedPlayList[0].coach._id : "",
            homePage: selectedPlayList[0].onHomePage
        });
        if(selectedPlayList[0].thumbnail){
            setOldPicSource(`${imageHost}` +selectedPlayList[0].thumbnail);
        }
        await timeout(500); 
        setShowModal(true);
    }

    function timeout(delay){
        return new Promise(res => setTimeout(res,delay));
    }
    
    const closeModal = ()=>{
        setEditPlayList({
            _id : "",
            title: "",
            description: "",
            category: "",
            homePage: ""
        });

        setPlayList({
            title: "",
            description: "",
            category: "",
            coach: "",
            homePage: ""
        });

        setThumbnail(null);
        setOldPicSource("");
        setShowModal(false);
    }

    const onChange = (e)=>{
        setPlayList({...playList, [e.target.name] : e.target.value});
        setEditPlayList({...editPlayList, [e.target.name] : e.target.value });
    }

    const deletePlayList = async ()=>{
        if(delPlaylist.length > 0){
            setLoading(true);
            let deleteResult = await deleteListById(delPlaylist);
            if(deleteResult){
                setShowDelModal(false);
            }
            setDelPlaylist("");
            setLoading(false);
        }
    }

    const addSlug = ()=>{
        // const slug = slugify(playList.title, {lower: true});
        let title = editPlayList.title;
        let slug = convertToSlug(title);
        setPlayList({...playList, slug : slug});
        setEditPlayList({...editPlayList, slug: slug});
    }

    function convertToSlug(Text) {
        return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }

    const onChangeActive = ()=>{
        if(editPlayList.homePage === true || editPlayList.homePage === "on"){
            editPlayList.homePage = false;
        }else{
            editPlayList.homePage = true;
        }

        if(playList.homePage === true || playList.homePage === "on"){
            playList.homePage = false;
        }else{
            playList.homePage = true;
        }
    }
        
    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl font-bold text-white">Playlists</h1>
                                <div className="flex justify-end">
                                    {
                                        coaches.length > 0 && categories.length > 0 &&
                                        <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                            onClick={()=>{setShowModal(true)}} >
                                            <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                            <span className="ml-3">Create</span>
                                        </button>
                                    }
                                </div>
                                {
                                    showDelModal ? 
                                    <>
                                    <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                    <h3 className="text-xl font-semibold">
                                                        Are you sure you want to delete this Playlist?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDelModal(false);
                                                            setDelPlaylist("");
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={()=>{
                                                            deletePlayList();
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
                                        <div
                                            className="w-full justify-center items-center flex overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Playlist
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form onSubmit={addOrUpdateVideo} className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Title
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="title" onChange={onChange} value={editPlayList.title || ""} 
                                                                    onBlur={()=>{addSlug()}}
                                                                    type="text" name="title" placeholder="Play list Title..."/>
                                                            </div>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Slug
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="slug" onChange={onChange} value={editPlayList.slug || ""} type="text" name="slug" placeholder="Slug"/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Description
                                                                </label>
                                                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                name="description" onChange={onChange} value={editPlayList.description || ""} id="description" type="text" placeholder="Description..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Thumbnail
                                                                </label>
                                                                {
                                                                    oldPicSource.length > 0 && 
                                                                    <div className="flex flex-row items-center mx-2">
                                                                        <p>Current Thumbnail: </p>
                                                                        <img className="h-10 w-10" src={oldPicSource} alt=""/>
                                                                    </div>
                                                                }
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    name="thumbnail" onChange={(e)=>{setThumbnail(e.target.files[0])}} id="thumbnail" type="file" accept=".jpg, .jpeg, .png"/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                                                    Coach
                                                                </label>
                                                                <select defaultValue={editPlayList.coach} id="coach" name="coach" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        coaches.length > 0 && coaches.map((coach)=>{
                                                                            return <option key={coach._id} value={coach._id}>{coach.name}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                                                    Category
                                                                </label>
                                                                <select  id="category" name="category" defaultValue={editPlayList.category} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        categories.map((category)=>{
                                                                            return <option key={category._id} value={category._id}>{category.title}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center mb-4">
                                                                <input onChange={onChangeActive} defaultChecked={editPlayList.homePage || false}
                                                                    type="checkbox" name="homePage" id="homePage" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                                <label htmlFor="active" className="ml-2 block text-gray-700 text-sm font-bold">On Home Page</label>
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
                                <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Title
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Cateogory
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Coach
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                On Home Page
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            playLists.length > 0 && playLists.map((playlist)=>{
                                                return <tr key={playlist._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                    <td className="px-5 py-4">
                                                        {playlist.title}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {
                                                            playlist.description.length > 70 ?
                                                            `${playlist.description.substring(0, 30)}...` : playlist.description
                                                        }
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {playlist.category ? playlist.category.title : "Category Removed"}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {playlist.coach ? playlist.coach.name : "Coach info removed"}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {
                                                            playlist.onHomePage === true ? "Yes" : "No" 
                                                        }
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <button onClick={()=>{
                                                            editPlaylist(playlist._id)
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button>   
                                                        <span className="mx-1">
                                                            |
                                                        </span>
                                                        <button onClick={()=>{
                                                            setShowDelModal(true);
                                                            setDelPlaylist(playlist._id);
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

export default PlayList;