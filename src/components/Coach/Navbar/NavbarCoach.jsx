import { useNavigate  } from 'react-router-dom';
import { useEffect } from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { useContext } from "react";
import coachContext from "../../../context/coach/coachContext";


const NavbarCoach = ()=>{

    const context = useContext(coachContext);

    const { getCoach, loggedInUser, imageHost } = context;

    let navigate = useNavigate();
    
    useEffect(() => {
        if(localStorage.getItem('token')){
            getCoach();
        }
        // eslint-disable-next-line
    }, [])
    
    const homePage = ()=>{
        navigate('/coach');
    }

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/');
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    
    const navigation = [
        { name: 'HOME', href: '/coach',},
        { name: 'PLAYLISTS', href: '/coach/myplaylists'},
        { name: 'VIDEOS', href: '/coach/myvideos' },
        { name: 'COMMENTS', href: '/coach/comments'},
        { name: 'REPLIES', href: '/coach/replies'}
    ]

    return ( 
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                <>
                <div className="w-full px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                        </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center cursor-pointer" onClick={homePage}>
                            <img
                                className="block h-8 w-auto lg:hidden"
                                src="/images/logo.png"
                                alt="Your Company"
                            />
                            <img
                                className="hidden h-8 w-auto lg:block"
                                src="/images/logo.png"
                                alt="Your Company"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                        <div className="flex ">
                            {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md xl:px-2 lg:px-1 lg:text-white py-2 text-sm xl:font-medium md:px-2 md:flex md:items-center'
                                )}
                            >
                                {item.name}
                            </a>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative xl:mr-8 items-end">
                        <div>
                            {
                                localStorage.getItem('token') ?
                                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none  focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="sr-only">Open user menu</span>
                                    {
                                        loggedInUser && loggedInUser.profile_picture ?
                                        <img
                                            className="h-8 w-9 rounded-full"
                                            src={`${imageHost}` +loggedInUser.profile_picture}
                                            alt=""
                                        /> :
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={'/images/profile.png'}
                                            alt=""
                                        />       
                                    }
                                </Menu.Button> : 
                                <div>
                                    <a href='/signup' className="start-watching-standard btn-standard hover:bg-black text-white font-bold py-2 px-4 mr-2">
                                        Start Watching
                                    </a>
                                    <a href="/login" className="text-white font-bold py-2 px-4 border border-blue-700 md:mr-10 ">
                                        Login
                                    </a>
                                </div>   
                            }
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                <a
                                    href="/"
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                    {loggedInUser && loggedInUser.email}
                                </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                <a
                                    href="/"
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                    Settings
                                </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                <button
                                    onClick={handleLogout}
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                    Sign out
                                </button>
                                )}
                            </Menu.Item>
                            </Menu.Items>
                        </Transition>
                        </Menu>
                    </div>
                    </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        >
                        {item.name}
                        </Disclosure.Button>
                    ))}
                    </div>
                </Disclosure.Panel>
                </>
            )}
            </Disclosure>
        </>
    );

}

export default NavbarCoach;