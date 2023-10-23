import React, { useContext, useEffect, useState } from 'react'
import Spinner from '../Loading/Spinner';
import adminContext from '../../context/admin/adminContext';
import ButtonLoader  from '../Loading/ButtonLoader';

const Packages = ()=> {
    
    const context = useContext(adminContext);

    const { packages, getPackages,showToastMessage, addNewPackage, updatePackageById, deletePackageById } = context;
    
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [delPackage, setDelPackage] = useState("");

    const [packageSite, setPackageSite] = useState({
        name: "",
        price: 0.0,
        features: "",
        description: ""
    });

    const [editPackage, setEditPackage] = useState({
        _id: "",
        name: "",
        price: 0.0,
        features: "",
        description: ""
    });
    const [role,setRole] = useState(false)
    
    const onChange = (e)=>{
        setPackageSite({...packageSite, [e.target.name] : e.target.value});
        setEditPackage({...editPackage, [e.target.name] : e.target.value});
    }

    const addOrUpdatePacakge = async (e)=>{
        e.preventDefault();
        setLoading(true);
        if(editPackage._id){
            // validation
            if(editPackage.name.length === 0){
                showToastMessage("Please specify name!", "warning");
                return;
            }

            if(editPackage.price.length === 0){
                showToastMessage("Please specify price for the pacakge!", "warning");
                return;
            }
            
            if(editPackage.features.length === 0){
                showToastMessage("Please specify features for the pacakge!", "warning");
                return;
            }

            if(editPackage.description.length === 0){
                showToastMessage("Description can not be empty!", "warning");
                return;
            }

            let data = new FormData();

            data.append('title', editPackage.name);
            data.append('price', editPackage.price);
            data.append('features',editPackage.features);
            data.append('description',editPackage.description);
            if(role === true){
                data.append('role',"Org")
            }

            let updateRes = await updatePackageById(data,editPackage._id);
            
            if(updateRes){
                setRole(false)
                closeModal();
            }
        }else{
            // validation 
            if(packageSite.name.length === 0){
                showToastMessage("Please specify name!", "warning");
                return;
            }

            if(packageSite.price.length === 0){
                showToastMessage("Please specify price for the pacakge!", "warning");
                return;
            }
            
            if(packageSite.features.length === 0){
                showToastMessage("Please specify features for the pacakge!", "warning");
                return;
            }

            if(packageSite.description.length === 0){
                showToastMessage("Description can not be empty!", "warning");
                return;
            }

            const data = new FormData();

            data.append('title', packageSite.name);
            data.append('price', packageSite.price);
            data.append('features',packageSite.features);
            data.append('description',packageSite.description);
            if(role){
                data.append("role","Org")
            }

            let addResult = await addNewPackage(data);
            if(addResult){
                setRole(false)
                closeModal();
            }
        }
        setLoading(false);
    }

    const closeModal = ()=>{
        setEditPackage({
            _id: "",
            name: "",
            price: "",
            features: "",
            role:""
        });
        setRole(false)
        setShowModal(false);
    }

    const editPackageModal = (id)=>{
        const selectedPackage = packages.filter(item => item._id === id);
        setEditPackage({
            _id: selectedPackage[0]._id,
            name: selectedPackage[0].title,
            price: selectedPackage[0].price,
            features: selectedPackage[0].features,
            description: selectedPackage[0].description
        });
        setRole(false)
        setShowModal(true);
    }

    const deletePackage = async ()=>{
        if(delPackage.length > 0){
            setLoading(true);
            let delResult = await deletePackageById(delPackage);
            if(delResult){
                setShowDeleteModal();
            }
            setDelPackage("");
            setRole(false)
            setLoading(false);
        }
    }

    const handleRoleClick = () => {
        setRole(!role)
    }
    
    useEffect(() => {
        setLoading(true);
        if(packages.length === 0){
            getPackages();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])
    
    return ( 
        <>
            <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl text-white font-bold">Pacakges</h1>
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
                                                        Are you sure you want to delete this Package?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDeleteModal(false);
                                                            setDelPackage("");
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={()=>{
                                                            deletePackage();
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
                                            className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Package
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form onSubmit={addOrUpdatePacakge} encType="multipart/form-data" className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Name
                                                                </label>
                                                                <input onChange={onChange} value={editPackage.name || ''} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="name" type="text" name="name" placeholder="Name..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                                                    Price ($)
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="price" onChange={onChange} value={editPackage.price || 0} id="price" type="number" placeholder="Price..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                                                    Description
                                                                </label>
                                                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    name="description" value={editPackage.description} onChange={onChange} id="description" type="text" placeholder="Description..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="features">
                                                                    Features
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="features" onChange={onChange} value={editPackage.features || ''} id="features" type="text" placeholder="Features..."/>
                                                                <span className='text-sm'>Seperate each feature by comma</span>
                                                            </div>
                                                            <div className="flex items-center mb-4">
                                                                <input type="checkbox" name="active" onChange={handleRoleClick} checked={role} id="active" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                                <label htmlFor="active" className="ml-2 block text-gray-700 text-sm font-bold">Organization Package</label>
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
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Features
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        packages && packages.map((item)=>{
                                            return <tr key={item._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                <td className="px-6 py-4">
                                                    {item.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    $ {item.price}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.features}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={()=>{
                                                        editPackageModal(item._id)
                                                    }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button> 
                                                    <span className='mx-1'>
                                                        |
                                                    </span>
                                                    <button onClick={()=>{
                                                        setShowDeleteModal(true);
                                                        setDelPackage(item._id);
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
        </>
    )
}

export default Packages