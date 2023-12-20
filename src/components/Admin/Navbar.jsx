import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Spinner from '../Loading/Spinner';
import adminContext from '../../context/admin/adminContext';
import ButtonLoader from '../Loading/ButtonLoader';

function Navbar() {
    
    const context = useContext(adminContext);

    const { navigationItems, getAllNavItems, addNewNavigationItem, showToastMessage, updateNavItemById, deleteNavItemById, playLists, getPlayLists, categories, getcategories  } = context;

    const [showDelModal, setShowDelModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isPlaylist, setIsPlaylist] = useState(true);
    const [isCategory, setIsCategory] = useState(false);
    const [isUrl, setIsUrl] = useState(false);

    const [navItem, setNavItem] = useState({
        title: "",
        reference: "",
        reference_type: "playlist"
    });

    const [editNavItem, setEditNavItem] = useState({
        _id: "",
        title: "",
        reference: "",
        reference_type: "playlist"
    });

    const addOrUpdateNavItem = async (e)=>{
        e.preventDefault();
        setLoading(true);
        if(editNavItem._id){
            
            console.log(editNavItem);

            if(editNavItem.title.length === 0){
                showToastMessage("Please specify name!","warning");
                return;
            }

            if(editNavItem.reference_type.length === 0){
                showToastMessage("Please select a category for navigation page!","warning");
                return;
            }

            if(editNavItem.reference.length === 0){
                showToastMessage(`Please select ${editNavItem.reference_type} from the list!`,"warning");
                return;
            }

            let data = new FormData();

            data.append("title",editNavItem.title);
            data.append("type",editNavItem.reference_type);
            data.append("reference",editNavItem.reference);
            
            let updateResult = await updateNavItemById(data,editNavItem._id);
            if(updateResult){
                closeModal();
            }

        }else{
            
            if(navItem.title.length === 0){
                showToastMessage("Please specify name!","warning");
                return;
            }

            if(navItem.reference_type.length === 0){
                showToastMessage("Please select a category for navigation page!","warning");
                return;
            }
            
            if(navItem.reference.length === 0){
                showToastMessage(`Please select ${navItem.reference_type} from the list!`,"warning");
                return;
            }

            let data = new FormData();

            data.append("title",navItem.title);
            data.append("type",navItem.reference_type);
            data.append("reference",navItem.reference);

            let addResult = await addNewNavigationItem(data);
            if(addResult){
                closeModal();
            }
        }
        setLoading(false);
    }

    const onChange = (e)=>{
        setNavItem({...navItem, [e.target.name] : e.target.value});
        setEditNavItem({...editNavItem, [e.target.name] : e.target.value})
    }

    const editNavigation = (id)=>{
        let selecedNavigationItem = navigationItems.filter(item => item._id === id);

        console.log(selecedNavigationItem[0]);

        setEditNavItem({
            _id: selecedNavigationItem[0]._id,
            title: selecedNavigationItem[0].title,
            reference: selecedNavigationItem[0].references || selecedNavigationItem[0].url,
            reference_type: selecedNavigationItem[0].type
        });

        if(selecedNavigationItem[0].type === "playlist"){
            setIsPlaylist(true);
            setIsUrl(false);
            setIsCategory(false);
        }else if(selecedNavigationItem[0].type === "category"){
            setIsPlaylist(false);
            setIsUrl(false);
            setIsCategory(true);
        }else{
            setIsUrl(true);
            setIsPlaylist(false);
            setIsCategory(false);
        }

        setShowModal(true);
    }

    const hideNavigationItem = async ()=>{
        if(delNavigationItem.length > 0){
            let delResult = await deleteNavItemById(delNavigationItem);
            if(delResult){
                setShowDelModal(false);
            }
            setDelNavigationItem("");
        }
    }

    useEffect(() => {
        setLoading(true);
        if(navigationItems.length === 0){
            getAllNavItems();
        }
        if(playLists.length === 0){
            getPlayLists();
        }
        if(categories.length === 0){
            getcategories();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])
    
    const [delNavigationItem, setDelNavigationItem] = useState("");
    
    const closeModal = ()=>{
        setEditNavItem({
            _id: "",
            title: "",
            reference: "",
            reference_type : "playlist"
        });
        setNavItem({
            title: "",
            reference: "",
            reference_type : "playlist"
        })

        setShowModal(false);

        setIsPlaylist(true);
        setIsUrl(false);
        setIsCategory(false);

    }

    const refTypeChange = (e)=>{
        var type = e.target.value;
        if(type === "url"){
            setIsUrl(true);
            setIsCategory(false);
            setIsPlaylist(false);
        }else if(type === "playlist"){
            setIsUrl(false);
            setIsCategory(false);
            setIsPlaylist(true);
        }else{
            setIsUrl(false);
            setIsCategory(true);
            setIsPlaylist(false);
        }

        setEditNavItem({
            _id: editNavItem._id,
            title: editNavItem.title,
            reference: "",
            reference_type : e.target.value
        });

        setNavItem({
            title: navItem.title,
            reference: "",
            reference_type : e.target.value
        });
    }

   
    return (
        <>
        {
            <div>
                <div className="p-4 sm:ml-64">
                    <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                        <div className="mb-4">
                            <h1 className="mt-2 font-serif text-2xl text-white font-bold">Navigation Items</h1>
                            <div className="flex justify-end">
                                <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                    onClick={()=>{setShowModal(true)}}
                                >
                                    <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                    <span className="ml-3">Create</span>
                                </button>
                            </div>
                            {
                                showDelModal ? 
                                <>
                                <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                        <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                <h3 className="text-xl font-semibold">
                                                    Are you sure you want to delete this Navigation item?
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                <button onClick={()=>{setShowDelModal(false)}}
                                                className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                    Cancel
                                                </button>
                                                <button 
                                                    disabled={loading}
                                                    onClick={()=>{hideNavigationItem()}}
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
                                                        Navigation Items
                                                    </h3>
                                                    <button
                                                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                        onClick={()=>{closeModal()}}
                                                    > x </button>
                                                </div>
                                                <div className="relative p-6 flex-auto">
                                                    <form onSubmit={addOrUpdateNavItem} encType="multipart/form-data" className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                Name
                                                            </label>
                                                            <input onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                id="title" type="text" value={editNavItem.title} name="title" placeholder="Page Title"/>
                                                        </div>
                                                        <div className="mb-6">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ref_type">
                                                                Attachment Type
                                                            </label>
                                                            <select onChange={refTypeChange} defaultValue={editNavItem.reference_type} id="reference_type" name="reference_type" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                <option value="playlist">Playlist</option>
                                                                <option value="category">Category</option>
                                                                <option value="url">URL</option>
                                                            </select>
                                                        </div>
                                                        {
                                                            isCategory ?
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reference">
                                                                    Categories
                                                                </label>
                                                                <select defaultValue={editNavItem.reference} id="reference" name="reference" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        categories.length > 0 && categories.map((item)=>{
                                                                            return <option key={item._id} value={item._id}>{item.title}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div> : null
                                                        }
                                                        {
                                                            isPlaylist ?
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reference">
                                                                    Playlists
                                                                </label>
                                                                <select defaultValue={editNavItem.reference} id="reference" name="reference" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        playLists.length > 0 && playLists.map((item)=>{
                                                                            return <option key={item._id} value={item._id}>{item.title}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div> : null
                                                        }
                                                        {
                                                            isUrl ?
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
                                                                    URL
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="reference" onChange={onChange} value={editNavItem.reference} id="reference" type="text" placeholder="Reference Link"/>
                                                            </div> : null
                                                        }
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
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Attachment Type
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            URL
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        navigationItems.length > 0 &&
                                        navigationItems.map((item)=>{
                                            return <tr key={item._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                <td className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                                                    {item.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.type.toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.url}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={()=>{
                                                        editNavigation(item._id)
                                                    }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button> 
                                                    <span className="mx-1">
                                                        |
                                                    </span>
                                                    <button onClick={()=>{
                                                        setShowDelModal(true);
                                                        setDelNavigationItem(item._id);
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

export default Navbar