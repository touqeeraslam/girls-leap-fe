import React, { useState } from 'react';
import authContext from './authContext';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const host = "http://localhost:5000/api";
//  const host = "https://gl2.theitking.pk/api";

const AuthState = (props)=> {

    const history = useNavigate();

    // login page
    const Login = async(credentials)=>{
        const response = await axios.post(`${host}/auth/login`,credentials);
        const json = response.data;
        // console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken);
            if(json.userRole  === "admin"){
                history("/admin");
            }else if(json.userRole === "coach"){
                history("/coach");
            }
           else if(json.userRole  === "Org"){
                history("/organization");
            }
            else if(json.userRole === "employee"){
                history("/employee")
            }
            else{
                history("/");
            }
        }else{
            showToastMessage(json.error,"error");
        }
    }
    
    // signup page
    const [packages, setPackages] = useState([]);

    const getPackages = async()=>{
        const response = await fetch(`${host}/packages/getall/`,{
            method: 'GET'
        });
        const json = await response.json();
        if(json.success){
            setPackages(json.allPackages);
            return json.allPackages;
        }else{
            showToastMessage("Error retrieving packages!","warning");
            return null;
        }
    } 


    const getPackageForOrganization = async () => {
        const response = await fetch(`${host}/packages/get/org`,{
            method: 'GET'
        });
        const json = await response.json();
        if(json.success){
            setPackages(json.package);
            console.log(json.package)
            return json.allPackages;
        }else{
            showToastMessage("Error retrieving packages!","warning");
            return null;
        }
       
    }


    const showToastMessage = (message,type) => {
        toast(message, {
            type: type
        });
    };

    const signUpSubmit = async(data)=>{
        const signUpUser = await axios({
            method: "POST",
            url: `${host}/auth/createuser`,
            data: data,
            headers: {
                'Content-Type':"multipar/form-data"
            }
        })
        
        const json = signUpUser.data;
        if(json.success){
            showToastMessage(json.message,"success");
            return true;
        }else{
            showToastMessage(`Error: ${json.error}`,"error");
            return false;
        }
    }

    // reset-password
    const resetPassword = async(credentials)=>{
        const resetPass = await axios({
            method: "POST",
            url: `${host}/users/update-password`,
            data: credentials,
            headers:{
                "Content-Type": "application/json"
            }
        });
        let data = resetPass.data;
        if(data.success){
            showToastMessage(data.message,"success");
            return true;
        }else{
            showToastMessage(data.message,"error");
            return false;
        }
    }

    // resent email verification
    const sendPasswordResetOTP = async(email)=>{
        const subConfirm = await axios({
            method: "POST",
            url: `${host}/users/send-otp/`,
            data: JSON.stringify({
                email: email
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const res = subConfirm.data;
        if(res.success){
            showToastMessage(res.message,"success");
            return true;
        }else{
            showToastMessage(res.message,"error");
            return false;
        }
    }

    // email verification

    const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false);
    const [emailVerificationFailure, setEmailVerificationFailure] = useState(false);
    const [workingOnIt, setWorkingOnIt] = useState(true);
    
    const verifyEmailAddress = async (id,token)=>{
        try {
            const url = `${host}/auth/${id}/verify/${token}`;
            const {data} = await axios.get(url);
            if(data.success){
                setWorkingOnIt(false);
                setEmailVerificationSuccess(true);
                const user = data.updatedUser;
                if(user.paymentMethod === "credit"){
                    const confirmPayment = `${host}/auth/user/payment/${id}`;
                    let result = await axios.post(confirmPayment);
                    if(result.data.success){
                        showToastMessage(result.data.message,"success");
                    }else{
                        showToastMessage(result.data.message,"error");
                    }
                }else{
                    // free subscription endpoint
                    const confirmSubs = await axios({
                        method: "POST",
                        url: `${host}/auth/user/free/${id}`
                    });
                    let resData = confirmSubs.data;
                    if(resData.success){
                        showToastMessage(resData.message,"success");
                    }else{
                        showToastMessage(resData.message,"error");
                    }
                }
                await timeout(2500);
                history('/auth/login');
            }else{
                setWorkingOnIt(false);
                setEmailVerificationFailure(true);
            }
        } catch (error) {
            console.log(error);
            setWorkingOnIt(false);
            setEmailVerificationFailure(true);
        }
    }

    // utility
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }
    
    return <authContext.Provider value={{Login, 
        emailVerificationFailure, emailVerificationSuccess, workingOnIt,
        verifyEmailAddress, sendPasswordResetOTP, timeout, getPackages,getPackageForOrganization, packages, resetPassword, host, showToastMessage, signUpSubmit}}>
        {props.children}
    </authContext.Provider>
}

export default AuthState;