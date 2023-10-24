import { useEffect, useState } from "react";
import LoadingSpinner from '../Loading/Spinner';
import { toast } from 'react-toastify';
import { useContext } from "react";
import ButtonLoader from "../Loading/ButtonLoader";
import organizationContext from "../../context/organization/organizationContext";
import Select from "react-select";
const AssignVideosOrganization = () => {

    const context = useContext(organizationContext);

    const { getUsers,  users,  getAllVideos, handleCategoryAdd ,handeleAssignRemoveCategory , updatedEmployee,getNotAssignedCategories,getAllCategories,categories} = context;
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAssignedVideosModal, setShowAssignedVideosModal] = useState(false)

    const [selectedId, setSelectedId] = useState("")

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [userWithAssignedVideos, setUserWithAssignedVideos] = useState([])
    const [userWithAssignedVideosID,setUserWithAssignedVideosID] = useState("")
    const [showDelModal, setShowDelModal] = useState(false);
    const [videoID,setVideoID] = useState("")
    useEffect(() => {
        getUsers();
        getAllCategories()
        setLoading(false);
        // eslint-disable-next-line
    }, [])




    const editUserModal = async(id) => {
           await getNotAssignedCategories(id);   
            setSelectedId(id)
            setShowModal(true);
        
        
    }

    const closeModal = () => {
        setShowModal(false);
        setShowAssignedVideosModal(false)
    }


    const categoryAdd = async () => {
        // console.log("id",selectedId)
        if (selectedCategory == "" || selectedCategory == null) {
            showToastMessage("Please Select At least One Category", "info")
        }
        else {
            const addCategory = await handleCategoryAdd(selectedId, selectedCategory);
            if (addCategory === true) {
                setSelectedId("")
                setSelectedCategory("")
                closeModal()
            }
        }
    }


    const showToastMessage = (message, type) => {
        toast(message, {
            type: type
        });
    };


    const options = categories?.map((categories) => ({
        value: categories._id, label: categories.title
    }))

    const handleCategoryChange = (selectedOptions) => {
        const filterId = selectedOptions.map((e) => e.value)
        setSelectedCategory(filterId);
    };


    const handleAssignedModel = (user) => {
        setUserWithAssignedVideos(user)
        setUserWithAssignedVideosID(user._id)
        setShowAssignedVideosModal(true)
        console.log(userWithAssignedVideos)
    }

    const handleRemoveVideo = (id) => {
        console.log(id)
        setVideoID(id)
        setShowDelModal(true)
    }

    const videoDelete = async() => {
        const delVideo = await handeleAssignRemoveCategory(userWithAssignedVideosID, videoID);
        if (delVideo === true) {
            setUserWithAssignedVideos(updatedEmployee)
            setUserWithAssignedVideosID("")
            setShowDelModal(false)
            setShowAssignedVideosModal(false)
        }
    }
    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl text-white font-bold">Manage Videos</h1>
                                {showModal ? (
                                    <>
                                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Assign Category to User
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form encType="multipart/form-data" className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Categories
                                                                </label>
                                                                <Select options={options} isMulti onChange={handleCategoryChange} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <button
                                                                    disabled={isButtonDisabled} onClick={categoryAdd}
                                                                    type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        isLoading ? (
                                                                            <ButtonLoader />
                                                                        ) : "Save"
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
                                {showAssignedVideosModal ? (
                                    <>
                                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Assigned Categories 
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <div className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th scope="col" className="flex flex-row px-6 py-3">
                                                                            Title
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3">
                                                                            Actions
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {userWithAssignedVideos?.categories?.map((categories) => {
                                                                        return <tr className="bg-black border-b dark:bg-gray-900 dark:border-gray-700 text-white dark:text-black">
                                                                            <td className="px-6 py-4">
                                                                                {categories.title} 
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <button onClick={() => handleRemoveVideo(categories._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Remove</button>
                                                                            </td>


                                                                        </tr>

                                                                    })}
                                                                </tbody>

                                                            </table>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                    </>
                                ) : null}
                                   {
                                    showDelModal ? 
                                    <>
                                    <div  className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                    <h3 className="text-xl font-semibold">
                                                        Are you sure you want to delete this assigned Category?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDelModal(false);
                                                           
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={isButtonDisabled}
                                                        onClick={videoDelete}
                                                    className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        {
                                                            isLoading ? <ButtonLoader/> : "Confirm"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </> : null
                                }
                            </div>
                            {loading ?
                                <LoadingSpinner />
                                :
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="flex flex-row px-6 py-3">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Assigned
                                                </th>
                                                {/* <th scope="col" className="px-6 py-3">
                                                Profile Picture
                                            </th> */}
                                                <th scope="col" className="px-6 py-3">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                users.length > 0 && users.map((user) => {
                                                    return <tr key={user._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700 text-white dark:text-black">
                                                        <td className="px-6 py-4">
                                                            {user.name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {user.email}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <button onClick={() => handleAssignedModel(user)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> View/Remove Assigned Categories  </button>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <button onClick={() => {
                                                                editUserModal(user._id)
                                                            }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Assign Categories  </button>

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

export default AssignVideosOrganization;