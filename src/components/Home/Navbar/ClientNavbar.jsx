import { useNavigate  } from 'react-router-dom';
import { useEffect, useContext } from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clientContext from '../../../context/client/clientContext';


export default function ClientNavbar(){

    let navigate = useNavigate();

    const context = useContext(clientContext);
    const { imageHost, getNavItem, navBarItems, user, getUserLoggedIn } = context;

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        window.location.reload(false);
    }

    const getNavItems = async ()=>{
        await getNavItem();
    }

    useEffect(() => {
        getNavItems();
        if(localStorage.getItem('token')){
            getUserLoggedIn();
        }
        // eslint-disable-next-line
    }, [])

    const homePage = ()=>{
        navigate('/');
    }
    
    return (
        <>
            <Disclosure as="nav" className="bg-black w-full">
                {({ open }) => (
                <>
                <div className="w-full px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                        </Disclosure.Button>
                    </div>
                    <div className="ml-12 sm:ml-0 flex flex-1 sm:items-stretch sm:justify-between">
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
                        <div className="hidden gap-4 md:gap-1 sm:ml-6 sm:block">
                            <div className="flex gap-2 md:gap-1">
                                {navBarItems.map((item) => (
                                <a
                                    rel="noreferrer"
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                    'text-gray-300 hover:bg-gray-700 hover:text-white uppercase',
                                    'rounded-md xl:px-2 lg:px-1 lg:text-white py-2 text-sm xl:font-medium md:px-2 md:flex md:items-center'
                                    )}
                                    target={item.type === "url" ? "_blank" : ""}
                                >
                                    {item.name}
                                </a>
                                ))}
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
                                            user && user.profile_picture ?
                                            <img
                                                className="h-9 w-10 rounded-full"
                                                src={`${imageHost}` + user.profile_picture}
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
                                        <a href='/auth/signup' className="invisible lg:visible start-watching-standard btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border text-white font-bold py-2 px-4 mr-2">
                                            Start Watching
                                        </a>
                                        <a href="/auth/login" className="text-white font-bold py-2 px-4">
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
                                        {user && user.email}
                                    </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <a
                                        href="/profile"
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
                </div>
                
                <Disclosure.Panel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                    {navBarItems.map((item) => (
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