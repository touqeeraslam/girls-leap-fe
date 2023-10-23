import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import adminContext from "../../context/admin/adminContext";

const SideBar = ()=>{

    const context = useContext(adminContext);

    const { getUser, loggedInUser, imageHost } = context;

    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            getUser();
        }
        // eslint-disable-next-line
    },[navigate])

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/');
    }
    
    return (
        <>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            {
                loggedInUser && 
                <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2">
                            <li>
                                <a href="/admin" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <span className="sr-only">Open user menu</span>
                                    {
                                        loggedInUser.profile_picture ? 
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={ `${imageHost}`  + loggedInUser.profile_picture}
                                            alt=""
                                        /> :
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={"../images/profile.png"}
                                            alt=""
                                        /> 
                                    }
                                    <span className="ml-3 text-2xl">{loggedInUser.name.substring(0,8)}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin" className="mt-4 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                    <span className="ml-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/users" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/categories" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                                    </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Category</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/playlist" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg 
                                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="7" y1="7" x2="7" y2="7" />
                                    <line x1="7" y1="11" x2="7" y2="11" />
                                    <line x1="17" y1="7" x2="17" y2="7" />
                                    <line x1="17" y1="11" x2="17" y2="11" />
                                    <line x1="12" y1="7" x2="12" y2="7" />
                                    <line x1="12" y1="11" x2="12" y2="11" />
                                    <line x1="7" y1="15" x2="17" y2="15" />
                                    <line x1="7" y1="18" x2="17" y2="18" />
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Playlists</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/videos" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg 
                                        className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="23 7 16 12 23 17 23 7" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                    </svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Videos</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/packages" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg
                                        className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="3" y1="15" x2="21" y2="15" />
                                        <path d="M6 3v18" />
                                        <path d="M18 3v18" />
                                    </svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Packages</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/navigation-items" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    
                                    <svg 
                                        className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>

                                    <span className="flex-1 ml-3 whitespace-nowrap">Main Menu</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/comments" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.175,4.142H1.951C1.703,4.142,1.5,4.344,1.5,4.592v10.816c0,0.247,0.203,0.45,0.451,0.45h16.224c0.247,0,0.45-0.203,0.45-0.45V4.592C18.625,4.344,18.422,4.142,18.175,4.142 M4.655,14.957H2.401v-1.803h2.253V14.957zM4.655,12.254H2.401v-1.803h2.253V12.254z M4.655,9.549H2.401V7.747h2.253V9.549z M4.655,6.846H2.401V5.043h2.253V6.846zM14.569,14.957H5.556V5.043h9.013V14.957z M17.724,14.957h-2.253v-1.803h2.253V14.957z M17.724,12.254h-2.253v-1.803h2.253V12.254zM17.724,9.549h-2.253V7.747h2.253V9.549z M17.724,6.846h-2.253V5.043h2.253V6.846z"></path></svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Comments</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/comment-replies" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" 
                                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.175,4.142H1.951C1.703,4.142,1.5,4.344,1.5,4.592v10.816c0,0.247,0.203,0.45,0.451,0.45h16.224c0.247,0,0.45-0.203,0.45-0.45V4.592C18.625,4.344,18.422,4.142,18.175,4.142 M4.655,14.957H2.401v-1.803h2.253V14.957zM4.655,12.254H2.401v-1.803h2.253V12.254z M4.655,9.549H2.401V7.747h2.253V9.549z M4.655,6.846H2.401V5.043h2.253V6.846zM14.569,14.957H5.556V5.043h9.013V14.957z M17.724,14.957h-2.253v-1.803h2.253V14.957z M17.724,12.254h-2.253v-1.803h2.253V12.254zM17.724,9.549h-2.253V7.747h2.253V9.549z M17.724,6.846h-2.253V5.043h2.253V6.846z"></path></svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Replies</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/emails" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" 
                                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.175,4.142H1.951C1.703,4.142,1.5,4.344,1.5,4.592v10.816c0,0.247,0.203,0.45,0.451,0.45h16.224c0.247,0,0.45-0.203,0.45-0.45V4.592C18.625,4.344,18.422,4.142,18.175,4.142 M4.655,14.957H2.401v-1.803h2.253V14.957zM4.655,12.254H2.401v-1.803h2.253V12.254z M4.655,9.549H2.401V7.747h2.253V9.549z M4.655,6.846H2.401V5.043h2.253V6.846zM14.569,14.957H5.556V5.043h9.013V14.957z M17.724,14.957h-2.253v-1.803h2.253V14.957z M17.724,12.254h-2.253v-1.803h2.253V12.254zM17.724,9.549h-2.253V7.747h2.253V9.549z M17.724,6.846h-2.253V5.043h2.253V6.846z"></path></svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Emails</span>
                                </a>
                            </li>
                            {
                                loggedInUser.role !== "admin" ?
                                <div>
                                    <li>
                                        <a href="/login" className="bottom-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
                                        <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
                                        </a>
                                    </li>
                                </div> : <li>
                                    <button 
                                        onClick={handleLogout}
                                    className="bottom-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
                                        <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
                                    </button>
                                </li>
                            }
                        </ul>
                    </div>
                </aside>
            }

        </>
    );

}

export default SideBar;