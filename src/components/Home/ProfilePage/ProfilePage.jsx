import React, { useContext, useEffect, useState } from 'react'
import clientContext from '../../../context/client/clientContext';

import ButtonLoader from '../../Loading/ButtonLoader';

function ProfilePage() {

    const context = useContext(clientContext);

    const { updateProfile, myProfileInformation, timeout, showToastMessage, updateName, updateNotification, onChangeNotification, getProfileData, mySubscriptionInformation, mySubscription, getNotifications, myNotificationState, cancelSub } = context;

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [section, setSection] = useState("personal");
    const [profile_picture, setProfile_picture] = useState(null);
    const [updatedInformation, setUpdatedInformation] = useState({
        password:"",
        new_password: "",
        confirm_new_password: ""
    });

    useEffect(() => {
        if(myProfileInformation === null){
            getProfileData();
            mySubscriptionInformation();
            getNotifications();
        }
        // eslint-disable-next-line
    }, [])
    
    
    const cancelSubscription = async(e)=>{
        e.preventDefault();
        if(localStorage.getItem('token')){
            setButtonDisabled(true);
            await cancelSub();
            await timeout(5000);
            setButtonDisabled(false);
            window.location.reload();
        }
    }
    
    const updateProfileInformation = async (e)=>{
        e.preventDefault();
        setButtonDisabled(true);
        const formData = new FormData();

        if(profile_picture){
            formData.append('profile_picture',profile_picture);
        }

        if(updatedInformation.password.length > 0){

            if(updatedInformation.new_password.length === 0){
                showToastMessage("Please provide a new password to update!","warning");
                return;
            }
            
            if(updatedInformation.confirm_new_password.length === 0){
                showToastMessage("New password field can not be empty!","warning");
                return;
            }

            if(updatedInformation.new_password !== updatedInformation.confirm_new_password){
                showToastMessage("New Passwords do not match!","error");
                return;
            }

            formData.append("oldPassword",updatedInformation.password);
            formData.append("newPassword",updatedInformation.new_password);
        }

        formData.append("name",myProfileInformation.name);
        
        let result = await updateProfile(formData);
        if(result){
            setProfile_picture(null);
            setUpdatedInformation({
                password: "",
                new_password: "",
                confirm_new_password: ""
            })
        }
        setButtonDisabled(false);
    }

    const updateMyNotificationState = async(e)=>{
        e.preventDefault();
        setButtonDisabled(true);
        await updateNotification();
        setButtonDisabled(false);
    }

    return (
        <>
            <div className='ml-8 sm:ml-2 2xl:min-h-[92vh] lg:min-h-[83vh] w-11/12 min-h-[90] content-center flex flex-col md:flex-row lg:mx-auto lg:justify-center mt-[96px]'>
                <div className="h-36 px-3 w-full md:w-8/12 lg:w-8/12 xl:w-6/12 2xl:w-3/12">
                    <h1 className='font-md text-xl text-white'>
                        Settings
                    </h1>
                    <ul className="w-full font-medium bg-[#4A4A4A] rounded-lg">
                        <li className='w-full mt-2'>
                            <button 
                                onClick={()=>{setSection("personal")}}
                                className="w-full flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" className="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3">Personal Information</span>
                            </button>
                        </li>
                        <li className='w-full mt-2'>
                            <button 
                                onClick={()=>{setSection("subscription")}}
                                className="w-full flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                                <span className="ml-3">My Subscription</span>
                            </button>
                        </li>
                        <li className='w-full mt-2'>
                            <button 
                                onClick={()=>{setSection("notifications")}}
                                className="w-full flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-black dark:hover:bg-black">
                                <svg
                                    className="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    >
                                    <path d="M12 22C10.35 22 9 20.65 9 19H15C15 20.65 13.65 22 12 22Z"></path>
                                    <path d="M19.94 16C19.63 15.22 19 14.63 18.18 14.34L18 14H6C5.4 14 5 13.6 5 13V9C5 6.24 7.24 4 10 4C12.24 4 14.17 5.77 14.89 8H16C18.21 8 20 9.79 20 12C20 13.2 19.39 14.3 18.36 14.82L19.94 16Z"></path>
                                </svg>
                                <span className="ml-3">Notifications</span>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="w-full md:w-8/12 lg:px-6 lg:w-8/12 xl:w-6/12 2xl:w-5/12 rounded-lg h-auto mt-8 md:mt-0">
                    {
                        section === "personal" && 
                        (
                            <div className="flex flex-col w-full">
                                <form className="w-full bg-transparent shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Name
                                        </label>
                                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="name" type="text" value={myProfileInformation ? myProfileInformation.name : ""} name="name" placeholder="Page Title"
                                            onChange={(e)=>{
                                                updateName(e.target.value)
                                            }}
                                            />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="email">
                                            Email
                                        </label>
                                        <input disabled className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="email" type="text" onChange={()=>{}} value={myProfileInformation ? myProfileInformation.email : ""} name="email" placeholder="Email Address"/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="username">
                                            Username
                                        </label>
                                        <input disabled className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="username" type="text" onChange={()=>{}} value={myProfileInformation ? myProfileInformation.user_name : ""} name="username" placeholder="Username"/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Old Password
                                        </label>
                                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="password" type="text" value={updatedInformation.password} name="password" placeholder="Password"
                                            onChange={(e)=>{
                                                setUpdatedInformation({...updatedInformation, "password" : e.target.value})
                                            }}
                                            />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            New Password
                                        </label>
                                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="new_password" type="text" value={updatedInformation.new_password} name="new_password" placeholder="New Password"
                                                onChange={(e)=>{
                                                    setUpdatedInformation({...updatedInformation, "new_password" : e.target.value})
                                                }}
                                            />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Confirm New Password
                                        </label>
                                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="confirm_new_password" type="text"  value={updatedInformation.confirm_new_password} name="confirm_new_password" placeholder="Confirm New Password"
                                            onChange={(e)=>{
                                                setUpdatedInformation({...updatedInformation, "confirm_new_password" : e.target.value})
                                            }}
                                            />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-white text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Profile Picture
                                        </label>
                                        <input className="shadow text-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            type="file" accept=".jpg, .jpeg, .png" onChange={(e)=>{setProfile_picture(e.target.files[0])}}/>
                                    </div>
                                    <div className="mb-4 flex flex-row justify-end">
                                        <button
                                            disabled={buttonDisabled}
                                            onClick={updateProfileInformation}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            {
                                                buttonDisabled ? <ButtonLoader/> : "Save"
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {
                        section === "subscription" &&
                        (
                            <div className="flex flex-col w-full">
                                <form className="w-full bg-transparent shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                                    <div className="mb-4">
                                        <label className="block text-white text-xl font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Package Name
                                        </label>
                                        <h2 className='text-white text-lg font-sans'>
                                            {
                                                mySubscription && mySubscription
                                            }
                                        </h2>
                                    </div>
                                    <div className="mb-4">
                                        {
                                            mySubscription &&
                                            (
                                                mySubscription === "Inner Circle" || "Basic" ? 
                                                <a href="/pricing" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    Subscribe Now
                                                </a> : <button
                                                    disabled={buttonDisabled}
                                                    onClick={cancelSubscription}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    {
                                                        buttonDisabled ? <ButtonLoader/> : "Cancel Subscription"
                                                    }
                                                </button>
                                            )
                                        }
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {
                        section === "notifications" &&
                        (
                            <div className="flex flex-col w-full text-white">
                                <form className="w-full bg-transparent shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                                    <div className="mb-4">
                                        <label className="block text-white text-xl font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                            Notification Settings
                                        </label>
                                        <div className="flex items-center mb-4">
                                            <input id="comment_reply" type="checkbox" checked={myNotificationState.comment_reply} 
                                                onChange={(e)=>{
                                                    onChangeNotification("comment_reply", e.target.checked);
                                                }} 
                                                name="comment_reply" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="comment_reply" className="font-sans ml-2 text-md font-medium text-white dark:text-gray-300">Comment Replies</label>
                                        </div>
                                        <div className="flex items-center mb-4">
                                            <input id="new_video" type="checkbox" checked={myNotificationState.new_video} 
                                                onChange={(e)=>{
                                                    onChangeNotification("new_video", e.target.checked);
                                                }} 
                                                name="new_video" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="new_video" className="font-sans ml-2 text-md font-medium text-white dark:text-gray-300">New Videos</label>
                                        </div>
                                        <hr />
                                        <div className="flex items-center mb-4 mt-4">
                                            <input id="disable_all" type="checkbox" checked={myNotificationState.disable_all} 
                                                onChange={(e)=>{
                                                    onChangeNotification("disable_all", e.target.checked);
                                                }} name="disable_all" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="disable_all" className="font-sans ml-2 text-md font-medium text-white dark:text-gray-300">Disable All Notifications</label>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <button 
                                            disabled={buttonDisabled}
                                            onClick={updateMyNotificationState}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            {
                                                buttonDisabled ? <ButtonLoader/> : "Save"
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default ProfilePage