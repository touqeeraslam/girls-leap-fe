import React, { useContext } from 'react'
import ButtonLoader from '../../Loading/ButtonLoader'
import authContext from '../../../context/auth/authContext'
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ()=> {

    const context = useContext(authContext);
    const navigate = useNavigate();

    const { resetPassword, showToastMessage, timeout, sendPasswordResetOTP } = context;

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [resetPasswordStep, setResetPasswordStep] = useState("1");

    const [credentials, setCredentials] = useState({
        email: "",
    });

    const [updatePasswordObject, setUpdatePasswordObject] = useState({
        code: "",
        password: "",
        confirmPassword: ""
    });

    const updatePassword = async(e)=>{
        e.preventDefault();
        console.log(updatePasswordObject);

        setButtonDisabled(true);

        if(updatePasswordObject.password.length === 0){
            showToastMessage("Please enter new password!","warning");
            return;
        }

        if(updatePasswordObject.confirmPassword.length === 0){
            showToastMessage("Passwords do not match","warning");
            return;
        }

        if(updatePasswordObject.password !== updatePasswordObject.confirmPassword){
            showToastMessage("Passwords do not match","warning");
            return;
        }

        if(updatePasswordObject.code.length !== 8){
            showToastMessage("Please provide 8 character OTP","warning");
            return;
        }
        
        const data = new FormData();
        data.append("email",credentials.email);
        data.append("code",updatePasswordObject.code);
        data.append("password",updatePasswordObject.password);

        let result = await resetPassword(data);
        if(result){
            setCredentials({
                email: ""
            });
            setUpdatePasswordObject({
                code: "",
                password: "",
                confirmPassword: ""
            })
            setResetPasswordStep("1");
            await timeout(3000);
            navigate('/auth/login');
        }
        setButtonDisabled(false);
    }

    const sendOTP = async(e)=>{
        e.preventDefault();
        if(credentials.email.length === 0){
            showToastMessage("Please enter email address!","warning");
            return;
        }
        setButtonDisabled(true);
        const result = await sendPasswordResetOTP(credentials.email);
        if(result){
            setResetPasswordStep("2");
        }
        setButtonDisabled(false);
    }

    return (
        <section className="">
            <div className="flex flex-col mt-16 md:mt-0 items-center justify-center px-6 mx-auto md:h-screen">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="h-12 w-auto mr-8" src="/images/logo.png" alt="logo"/>
                </a>
                <div className="w-full p-6 bg-white shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        <ArrowBackIcon className='cursor-pointer' onClick={()=>{
                            if(resetPasswordStep === "2"){
                                setResetPasswordStep("1");
                                setCredentials({
                                    email: ""
                                })
                            }else{
                                navigate('/auth/login')
                            }
                        }}/> Reset Password
                    </h2>
                    {
                        resetPasswordStep === "1" && (
                            <form onSubmit={sendOTP} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email"
                                        onChange={(e)=>{setCredentials({...credentials, "email": e.target.value})}}
                                        value={credentials.email}
                                        name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <button
                                    type="submit" className="w-full text-white brand-color bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    {
                                        buttonDisabled ? <ButtonLoader/> : "Send OTP"
                                    }
                                </button>
                            </form>
                        )
                    }
                    {
                        resetPasswordStep === "2" && (
                            <form onSubmit={updatePassword} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                                <div>
                                    <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OTP</label>
                                    <input type="text"
                                        onChange={(e)=>{setUpdatePasswordObject({...updatePasswordObject, "code": e.target.value})}}
                                        value={updatePasswordObject.code}
                                        name="code" id="code" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="ABCD1234" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                    <input type="password"
                                        onChange={(e)=>{setUpdatePasswordObject({...updatePasswordObject, "password": e.target.value})}}
                                        value={updatePasswordObject.password}
                                        name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                    <input type="password"
                                        onChange={(e)=>{setUpdatePasswordObject({...updatePasswordObject, "confirmPassword": e.target.value})}}
                                        value={updatePasswordObject.confirmPassword} name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                                </div>
                                <button type="submit" className="w-full text-white brand-color bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    {
                                        buttonDisabled ? <ButtonLoader/> : "Reset passwod"
                                    }
                                </button>
                            </form>
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default ResetPassword