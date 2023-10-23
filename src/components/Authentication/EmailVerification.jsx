import React, { useContext } from 'react'
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../Loading/Spinner2';
import authContext from '../../context/auth/authContext';

const EmailVerification = ()=>{
    
    const params = useParams();
    const context = useContext(authContext);

    const {  emailVerificationFailure, verifyEmailAddress, emailVerificationSuccess, workingOnIt } = context;

    useEffect(() => {
        verifyEmailAddress(params.id,params.token);
        // eslint-disable-next-line
    }, [params])
    
    return (
        <div className="shadow-lg min-h-screen text-white bg-black flex justify-center ">

            {
                workingOnIt &&
                <Spinner/>
            }
            {
                emailVerificationSuccess &&
                <div className="h-screen flex flex-col items-center justify-center text-white">
                    <img src="/images/success.png" alt="" />
                    <h1>Email Verified Successfully!</h1>
                    <Link to={"/auth/login"}>
                        <button>
                            Do not leave the page! You will be redirected to Login Page shortly!
                        </button>
                    </Link>
                </div>
            }
            {
                emailVerificationFailure &&
                <div className='h-screen flex flex-col items-center justify-center text-white'>
                    <h2>Token has expired!</h2>
                    <Link to={"/auth/login"}>
                        <button>
                            You can Login Here
                        </button>
                    </Link>
                </div>
            }
        </div>
    )
}

export default EmailVerification