import { useEffect, useState } from "react";
import LoadingSpinner from '../Loading/Spinner';
import { toast } from 'react-toastify';
import { useContext } from "react";
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from "../Loading/ButtonLoader";

const UsersTab = ()=>{
    
    const context = useContext(adminContext);

    const {getUsers, imageHost, users, addUser, editUserC, packages, getPackages, deleteUser } = context;

    // const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState({
        _id:"",
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        profile_picture: "",
        package: "",
        verified: false,
        user_name: ""
    });

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        profile_picture: "",
        package: "",
        verified: false,
        user_name: ""
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const [oldPicSource, setOldPicSource] = useState("");
    const [delUser, setDelUser] = useState("");
    const [showDelModal, setShowDelModal] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getUsers();
        getPackages();
        setLoading(false);
        // eslint-disable-next-line
    }, [])

    const onChange = (e)=>{
        setUser({...user, [e.target.name] : e.target.value});
        setEditUser({...editUser, [e.target.name] : e.target.value});
    }
    
    const addOrUpdateUser = async(e)=>{
        e.preventDefault();

        setIsLoading(true);
        setIsButtonDisabled(true);

        const data = new FormData();
        
        if(editUser._id){
           
            if(isClient === true){
                data.append("package",editUser.package);
            }

            if(editUser.name.length === 0 || editUser.email.length === 0 || editUser.role.length === 0){
                showToastMessage("Please fill out all fields!","warning")
                return;
            }

            if(editUser.password !== editUser.confirmPassword){
                showToastMessage("Passwords do not match!","warning");
                return;
            }

            data.append("profile_picture",profilePicture);
            data.append("name",editUser.name);
            data.append("email",editUser.email);
            data.append("role",editUser.role);
            data.append("password",editUser.password);
            data.append("verified",editUser.verified);
            data.append("user_name",editUser.user_name);

            await editUserC(data,editUser._id);
            closeModal();

        }else{

            if(isClient === true){
                data.append("package",user.package);
            }else{
                data.append("package","null");
            }
            
            if(user.name.length === 0 || user.email.length === 0){
                showToastMessage("Please fill out all fields!","warning")
                return;
            }
            
            if(user.role.length === 0){
                showToastMessage("Please select user role!","warning")
                return;
            }

            if(user.password !== user.confirmPassword){
                showToastMessage("Passwords do not match!","warning");
                return;
            }

            data.append("profile_picture",profilePicture);
            data.append("name",user.name);
            data.append("email",user.email);
            data.append("role",user.role);
            data.append("password",user.password);
            data.append("verified",user.verified)
            data.append("user_name",user.user_name);
            
            const addResult = await addUser(data);
            if(addResult){
                closeModal();
            }
        }

        setIsLoading(false);
        setIsButtonDisabled(false);
    }

    const editUserModal = (id)=>{
        const selectedUser = users.filter(user => user._id === id);
        setEditUser({
            _id: selectedUser[0]._id,
            name: selectedUser[0].name,
            email: selectedUser[0].email,
            role: selectedUser[0].role,
            package: selectedUser[0].package,
            profile_picture: selectedUser[0].profile_picture,
            payment: "none",
            verified: selectedUser[0].verified,
            user_name: selectedUser[0].user_name
        });
        setOldPicSource(`${imageHost}` + selectedUser[0].profile_picture);
        setShowModal(true);
    }
    
    const closeModal = ()=>{
        setEditUser({
            name: "",
            email: "",
            role: "",
            package: "",
            password: "",
            confirmPassword: "",
            payment: ""
        });
        setOldPicSource("");
        setShowModal(false);
    }

    const deleteSelectedUser = async ()=>{
        if(delUser.length > 0){
            setIsLoading(true);
            setIsButtonDisabled(true);
            await deleteUser(delUser);
            setShowDelModal(false);
            setDelUser("");
            setIsLoading(false);
            setIsButtonDisabled(false);
        }
    }

    const showToastMessage = (message,type) => {
        toast(message, {
            type: type
        });
    };
    
    const setRole = (e)=>{
        var role = e.target.value;
        if(role==="client"){
            setIsClient(true);
        }else{
            setIsClient(false);
        }
        setUser({...user, [e.target.name] : e.target.value});
        setEditUser({...editUser, [e.target.name] : e.target.value});
    }
    
    const onChangeVerified = ()=>{
        if(user.verified === true || user.verified === "on"){
            user.verified = false;
        }else{
            user.verified = true;
        }
        if(editUser.verified === true || editUser.verified === "on"){
            editUser.verified = false;
        }else{
            editUser.verified = true;
        }
    }


    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl text-white font-bold">Users</h1>
                                <div className="flex justify-end">
                                    <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                        onClick={()=>{setShowModal(true)}}
                                    >
                                        <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                        <span className="ml-3">Add User</span>
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
                                                        Are you sure you want to delete this user?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDelModal(false);
                                                            setDelUser("");
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={isButtonDisabled}
                                                        onClick={()=>{
                                                            deleteSelectedUser();
                                                        }}
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
                                {showModal ? (
                                    <>
                                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            User
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form onSubmit={addOrUpdateUser} encType="multipart/form-data" className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Name
                                                                </label>
                                                                <input onChange={onChange} value={editUser.name || ""} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="name" type="text" name="name" placeholder="Name..."/>
                                                            </div>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Username
                                                                </label>
                                                                <input onChange={onChange} value={editUser.user_name || ""} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="user_name" type="text" name="user_name" placeholder="Username..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                    Email Adress
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="email" onChange={onChange} value={editUser.email || ""} id="email" type="email" placeholder="Email Address..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                    Password
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="password" onChange={onChange} value={editUser.password || ""} id="password" type="text" placeholder="Password..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                    Confirm Password
                                                                </label>
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="confirmPassword" onChange={onChange} value={editUser.confirmPassword || ""} id="confirmPassword" type="text" placeholder="Password..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                    Profile Picture
                                                                </label>
                                                                {
                                                                    oldPicSource.length > 0 && 
                                                                    <div className="flex flex-row items-center mx-2">
                                                                        <p>Old Profile Picture: </p>
                                                                        <img className="h-10 w-10" src={oldPicSource} alt=""/>
                                                                    </div>
                                                                }
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                   name="profile_picture" onChange={(e)=>{setProfilePicture(e.target.files[0])}} 
                                                                   id="profile_picture" type="file" accept=".jpg, .jpeg, .png" placeholder="Profile Picture url.." />
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                    Role
                                                                </label>
                                                                <select  defaultValue={editUser.role} id="role" name="role" onChange={setRole} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    <option value="admin">Admin</option>
                                                                    <option value="coach">Coach</option>
                                                                    <option value="client">User</option>
                                                                </select>
                                                            </div>
                                                            {
                                                                isClient ?
                                                                <div className="mb-6">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="package">
                                                                        Package
                                                                    </label>
                                                                    <select  id="package" name="package" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                        {
                                                                            packages && packages.map((listItem)=>{
                                                                                return <option key={listItem._id} value={listItem._id}>{listItem.title}</option>
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div> : null
                                                            }
                                                            <div className="flex items-center mb-4">
                                                                <input onChange={onChangeVerified} defaultChecked={editUser.verified} type="checkbox" name="active" id="active" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                                <label htmlFor="active" className="ml-2 block text-gray-700 text-sm font-bold">Account Verified</label>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <button 
                                                                    disabled={isButtonDisabled}
                                                                    type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        isLoading ? (
                                                                            <ButtonLoader/>
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
                            </div>
                            {loading ?
                            <LoadingSpinner />            
                            :
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                {/* <div className="text-end h-16">
                                    <label htmlFor="search" className="text-white mr-4">
                                        Search: 
                                    </label>
                                    <input type="text" />
                                </div> */}
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
                                                Sign Up Date
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Role
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Profile Picture
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users.length > 0 && users.map((user)=>{
                                                return <tr key={user._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700 text-white dark:text-black">
                                                    <td className="px-6 py-4">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.date}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.role}
                                                    </td>
                                                    <td className="px-6 py-4 truncate">
                                                        {
                                                            user.profile_picture && user.profile_picture.length > 100 ?
                                                                `${user.profile_picture.substring(0, 25)}...` : user.profile_picture
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={()=>{
                                                            editUserModal(user._id)
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button> 
                                                        <span className="mx-1">
                                                            |
                                                        </span>
                                                        <button onClick={()=>{
                                                            setShowDelModal(true);
                                                            setDelUser(user._id);
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

export default UsersTab;