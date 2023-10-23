import { LockClosedIcon } from '@heroicons/react/20/solid';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import authContext from '../../context/auth/authContext';

import ButtonLoader from '../Loading/ButtonLoader';

const Login = ()=>{

    const [credentials, setCredentials] = useState({emailOrUsername: "", password: ""})

    const context = useContext(authContext);

    const { Login } = context;

    const handleClick = async (e)=>{
        console.log("Button Clicked")
        e.preventDefault();
        setButtonDisabled(true);
        if(credentials.emailOrUsername.length === 0 || credentials.password.length === 0){
            showToastMessage("Please enter your Email and Password!","warning");
            return;
        }
        await Login(credentials);
        setButtonDisabled(false);
    }

    const showToastMessage = (message,type) => {
        toast(message, {
            type: type
        });
    };

    const onChange = (e)=>{
        if(e.target.name === "emailOrUsername" && e.target.value.includes(' ')){
            setCredentials({
                ...credentials,
                [e.target.name] : e.target.value.replace(/\s+/g, '')
            })
        }else{
            setCredentials({...credentials, [e.target.name] : e.target.value});
        }
    }

    const [buttonDisabled, setButtonDisabled] = useState(false);

    return (
    <>
        <div className="flex min-h-full mt-12 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/images/logo.png"
                        alt="Your Company"
                        />
                    <h2 className="text-white mt-6 text-center text-3xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleClick}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className='mb-4 '>
                            <label htmlFor="email-address" className="sr-only">
                                Email or Username
                            </label>
                            <input
                                value={credentials.emailOrUsername}
                                id="emailOrUsername"
                                name="emailOrUsername"
                                type="text"
                                required
                                className="relative block w-full  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Email or Username"
                                onChange={onChange}
                            />
                        </div>
                        <div className='mt-2 mb-4'>
                            <label htmlFor="password" className="sr-only">
                            Password
                            </label>
                            <input
                                value={credentials.password}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Password"
                                onChange={onChange}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            disabled={buttonDisabled}
                            type="submit"
                            className="group relative flex w-full justify-center py-2 px-3 text-sm font-semibold btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                            {
                                buttonDisabled ? <ButtonLoader/> : "Sign In"
                            }
                        </button>
                        <div className='flex flex-row items-cetner justify-center'> 
                            <p className='mx-1 px-1 py-1 text-md'>
                                Forgot Your Password ?
                            </p> 
                            <a href="/auth/reset-password" className='px-1 py-1 text-md text-yellow-400'>
                                Reset Here
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
}

export default Login;