import React, { useContext, useEffect, useState } from 'react'
import Packages from './Packages';
import ButtonLoader from '../Loading/ButtonLoader';

// import 'react-credit-cards/es/styles-compiled.css';
import 'react-toastify/dist/ReactToastify.css';

import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';

import authContext from '../../context/auth/authContext';
import { useParams } from 'react-router-dom';

function SignupForm() {

    const context = useContext(authContext);

    const { packages, getPackages, showToastMessage, getPackageForOrganization, signUpSubmit } = context;

    const [profile_picture, setprofile_picture] = useState(null);

    const [showPaymentForm, setShowPaymentForm] = useState(true);
    const [showPaymentOptions, setShowPaymentOptions] = useState(true);
    const [passwordStatus, setPasswordStatus] = useState(false);
    const [passwordStatusError, setPasswordStatusError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [termsAndConditionsCheck, setTermsAndConditionsCheck] = useState(false);

    const [roleUser, setRoleUser] = useState("Client")
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [packageBuy, setPackageBuy] = useState("");
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        profile_picture: "",
        payment: "credit",
        username: ""
    });

    const onChange = (e) => {
        if (e.target.name === "username" && e.target.value.includes(' ')) {
            setCredentials({
                ...credentials,
                [e.target.name]: e.target.value.replace(/\s+/g, '')
            })
        } else {
            setCredentials({ ...credentials, [e.target.name]: e.target.value });
        }
    }

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCVC] = useState('');

    const onChangePaymentOption = (e) => {
        if (e.target.value === "paypal") {
            setCredentials({ ...credentials, [e.target.name]: e.target.value });
            setShowPaymentForm(false);
        } else {
            setCredentials({ ...credentials, [e.target.name]: e.target.value });
            setShowPaymentForm(true);
        }
    }

    const { meta, getCardImageProps, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();

    const params = useParams();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (termsAndConditionsCheck === false) {
            showToastMessage("Please accept the terms and conditions!", "warning")
            return;
        }

        if (passwordStatus === true || passwordConfirmError.length > 0 || passwordStatusError.length > 0) {
            showToastMessage("Please choose a strong password!", "warning")
            return;
        }

        if (credentials.name.length === 0 || credentials.email.length === 0 || credentials.password.length === 0 || credentials.confirmPassword.length === 0) {
            showToastMessage("Please fill out all fields!", "warning")
            return;
        }

        // check for password matching
        if (credentials.password !== credentials.confirmPassword) {
            // setError("Passwords do not match!");
            showToastMessage("Passwords do not match!", "warning")
            return;
        }

        if (packageBuy.length === 0) {
            // setError("Please select a subscription package!");
            showToastMessage("Please select a subscription package!", "info");
            return;
        }

        if (credentials.username.length === 0) {
            showToastMessage("Invalid Username!", "warning")
            return;
        }

        let data = new FormData();

        data.append("name", credentials.name);
        data.append("email", credentials.email);
        data.append("password", credentials.password);
        data.append("role", credentials.role);
        data.append("payment", credentials.payment);
        data.append("package", packageBuy);
        data.append("profile_picture", profile_picture);
        data.append("username", credentials.username);


        if (showPaymentForm === true) {
            // confirm card details
            if (cardNumber.length === 0 || cardNumber.length < 16) {
                showToastMessage("Please provide a valid card number!", "info");
                return;
            } else if (cvc.length < 3) {
                showToastMessage("Please provide a valid cvc number!", "info");
                return;
            } else if (expiryDate.length === 0 || expiryDate.length < 5) {
                showToastMessage("Please provide a valid expiry date!", "info");
                return;
            }
            data.append("card_number", cardNumber);
            data.append("card_expiry", expiryDate);
            data.append("card_cvc", cvc);
        }

        setButtonDisabled(true);

        let signUPResult = await signUpSubmit(data);

        if (signUPResult) {
            setCredentials({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "client",
                profile_picture: "",
                payment: "credit"
            });
            setPackageBuy("");
            setCardNumber("");
            setExpiryDate("");
            setCVC("");
            setTimeout(() => {
                window.location.reload(false);
            }, 5000);
        }

        setButtonDisabled(false);
    }

    const getAllPackages = async (selectDefaultPackage) => {
        const allPackages = await getPackages();

        if (selectDefaultPackage.length === 0) {
            const filteredObjects = allPackages.filter((object) => object.price === 0);
            selectedPackage(filteredObjects[0]._id, filteredObjects[0].price);
        } else {
            const filteredObjects = allPackages.filter((object) => object._id === selectDefaultPackage);
            selectedPackage(filteredObjects[0]._id, filteredObjects[0].price);
        }
    }

    useEffect(() => {
        const pacakge = params.package;

        if (pacakge !== undefined) {
            getAllPackages(pacakge);
        } else {
            getAllPackages("");
        }
        // eslint-disable-next-line
    }, [params])

    const selectedPackage = (id, price) => {

        if (id === packageBuy) {
            return;
        }
        if (packageBuy === id) {
            setPackageBuy("");
        } else {
            setPackageBuy(id);
        }
        if (price === 0) {
            setShowPaymentForm(false);
            setShowPaymentOptions(false);
            setCredentials({ ...credentials, "payment": "none" });
        } else {
            setCredentials({ ...credentials, "payment": "credit" });
            setShowPaymentForm(true);
            setShowPaymentOptions(true);
        }
    }

    const onPasswordChange = (e) => {

        let passwordValue = e.target.value;

        // list of regex to test
        const poorRegExp = /[a-z]/;
        const weakRegExp = /(?=.*?[0-9])/;;
        const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
        const whitespaceRegExp = /^$|\s+/;

        // now we check it against all things
        const poorPassword = poorRegExp.test(passwordValue);
        const weakPassword = weakRegExp.test(passwordValue);
        const strongPassword = strongRegExp.test(passwordValue);
        const whiteSpace = whitespaceRegExp.test(passwordValue);

        if (whiteSpace) {
            setPasswordStatus(true);
            setPasswordStatusError("Password contains white spaces");
        }

        if (poorPassword) {
            setPasswordStatus(true);
            setPasswordStatusError("Poor Password!");
        }

        if (weakPassword) {
            setPasswordStatus(true);
            setPasswordStatusError("Weak Password");
        }

        if (strongPassword) {
            setPasswordStatus(false);
            setPasswordStatusError("");
        }

        setCredentials({ ...credentials, "password": e.target.value });

    }

    const checkPasswords = (e) => {

        let passwordValue = e.target.value;

        let password = credentials.password;

        if (passwordValue !== password) {
            setPasswordStatus(true);
            setPasswordStatusError("Passwords do not match!");
            setPasswordConfirmError("Passwords do not match!");
        } else {
            setPasswordStatus(false);
            setPasswordStatusError("");
            setPasswordConfirmError("");
        }

    }

    const handleCardNumberChange = (e) => {
        setCardNumber(e.target.value);
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value);
    };

    const handleCVCChange = (e) => {
        setCVC(e.target.value);
    };


    const handleRadioChange = (e) => {
        if (e.target.value === "Org"){
            getPackageForOrganization()
        }
        else {
            const pacakge = params.package;

        if (pacakge !== undefined) {
            getAllPackages(pacakge);
        } else {
            getAllPackages("");
        }
        }
        setRoleUser(e.target.value)
        setCredentials({ ...credentials, "role": e.target.value })

    }
    // if (roleUser === "Org") {
    //     getPackageForOrganization()
    // }
    // if(roleUser == "Client") {
    //   getAllPackages()
    // }
    return (
        <div className="min-h-screen text-white bg-white-50 dark:bg-gray-900 flex justify-center ">
            <div className="max-w-screen-xl m-0 sm:m-10 shadow justify-center flex-1">
                <div className="w-full p-6 sm:p-12">
                    <a href="/" className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-auto h-8 mr-2" src="/images/logo.png" alt="logo" />
                    </a>
                    <h1 className="text-2xl font-extrabold text-center text-white">
                        Join GIRLS L.E.A.P
                    </h1>
                    <div className="w-full flex lg:flex-row md-w-full flex-col items-center gap-8">
                        <div className="w-10/12 sm:w-9/12 lg:w-5/12 mt-4">
                            <form className="space-y-4 md:space-y-6" >
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Name</label>
                                    <input type="text"
                                        name="name" id="name"
                                        onChange={onChange}
                                        value={credentials.name}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                                    <input type="email"
                                        name="email" id="email"
                                        onChange={onChange}
                                        value={credentials.email}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="e.g name@domain.com"
                                        required="" />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                                    <input type="text"
                                        name="username" id="username"
                                        onChange={onChange}
                                        value={credentials.username}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="e.g john_doe"
                                        required="" />
                                    <p>
                                        Username can only be set once and it has to be unique!
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input type="password"
                                        name="password" id="password" placeholder="••••••••"
                                        onChange={onPasswordChange}
                                        value={credentials.password}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {
                                        passwordStatus && <p className='text-sm text-red-400'>{passwordStatusError}</p>
                                    }
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
                                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••"
                                        onChange={onChange}
                                        value={credentials.confirmPassword}
                                        onBlur={checkPasswords}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {
                                        passwordConfirmError.length > 0 && <p className='text-sm text-red-400'> {passwordConfirmError} </p>
                                    }
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Profile Picture</label>
                                    <input type="file" name="profile_picture" id="profile_picture"
                                        onChange={(e) => { setprofile_picture(e.target.files[0]) }}
                                        accept=".jpg, .jpeg, .png"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <h2 className='font-sans'>Signup as</h2>
                                    <div className="flex items-center mb-4">
                                        <input
                                            id="default-radio-1"
                                            type="radio"
                                            name="default-radio"
                                            value="Client"
                                            checked={roleUser === 'Client'}
                                            onChange={handleRadioChange}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 font-sans" style={{ color: '#fefefe' }}>Individual</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="default-radio-2"
                                            type="radio"
                                            name="default-radio"
                                            value="Org"
                                            checked={roleUser === 'Org'}
                                            onChange={handleRadioChange}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="default-radio-2" style={{ color: '#fefefe' }} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 font-sans">Organization</label>
                                    </div>

                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" value={termsAndConditionsCheck}
                                            onChange={() => { setTermsAndConditionsCheck(!termsAndConditionsCheck) }}
                                            name="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                    </div>

                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-white">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/tandc">
                                            Terms and Conditions</a>
                                        </label>
                                    </div>
                                </div>

                            </form>


                        </div>




                        <div className="flex-1 md:w-8/12">
                            <h2 className='text-2xl font-sans text-center'>
                                Select a Package
                            </h2>
                            <div className='flex fex-row w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto'>
                                {
                                    packages && packages.map((item) => {
                                        return <Packages key={item._id} currentPacakge={item._id === packageBuy ? true : false} id={item._id} title={item.title} price={item.price} features={item.features} selectedPackage={selectedPackage} />
                                    })
                                }
                            </div>
                            {
                                packages.length === 0 ?
                                    <ButtonLoader />
                                    :
                                    <>
                                        <div className='mt-4'>
                                            {
                                                showPaymentOptions ?
                                                    <div>
                                                        <h1>
                                                            Payment Options:
                                                        </h1>
                                                        <input type="radio" name="payment" value="credit" className="mb-1" defaultChecked onChange={onChangePaymentOption} /> Credit Card
                                                    </div> : null
                                            }
                                        </div>
                                        <div className="text-black flex fex-row w-full grid grid-cols-1" >
                                            <div className='flex text-white' >
                                                {
                                                    showPaymentForm &&
                                                    <form className="flex flex-col gap-3 w-full p-2">
                                                        <label className="relative w-full flex flex-col">
                                                            <span className="font-bold mb-3">Card number</span>
                                                            <PaymentInputsWrapper>
                                                                <svg {...getCardImageProps({ images })} />
                                                                <input {...getCardNumberProps({ onChange: handleCardNumberChange })}
                                                                    className='text-black'
                                                                    style={{
                                                                        minWidth: "90%",
                                                                        boxShadow: "none",
                                                                        WebkitAppearance: "none",
                                                                        MozAppearance: "none",
                                                                    }}
                                                                />
                                                            </PaymentInputsWrapper>
                                                        </label>
                                                        <div className='flex flex-col md:flex-row gap-2 w-full'>
                                                            <label className="relative  flex-1 flex flex-col md:w-5/12">
                                                                <span className="font-bold mb-3">Expire date</span>
                                                                <input
                                                                    {...getExpiryDateProps({ onChange: handleExpiryDateChange })}
                                                                    className="rounded-md text-black peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300" />
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </label>
                                                            <label className="relative flex-1 flex flex-col md:w-5/12">
                                                                <span className="font-bold flex items-center gap-3 mb-3">
                                                                    CVC/CVV
                                                                    <span className="relative group">
                                                                        <span className="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 transform translate-x-full -translate-y-1/2 w-max top-1/2 bg-black text-white"> Hey ceci est une infobulle !</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </span>
                                                                </span>
                                                                <input
                                                                    {...getCVCProps({ onChange: handleCVCChange })}
                                                                    className="rounded-md text-black peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300" />
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            </label>
                                                        </div>
                                                        {meta.isTouched && meta.error && <span>Error: {meta.error}</span>}
                                                    </form>
                                                }
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                    <div className='flex flex-col items-center w-full mt-2 mb-2'>
                        <button
                            disabled={buttonDisabled}
                            onClick={onSubmit}
                            className="mb-2 w-1/2 font-medium  text-sm px-5 py-2.5 text-center btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border">
                            {
                                buttonDisabled ? <ButtonLoader /> : "Sign Up"
                            }
                        </button>
                        <p className="w-1/2 text-sm font-light text-white text-center">
                            Already have an account? <a href="/auth/login" className="font-medium text-yellow-500">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupForm