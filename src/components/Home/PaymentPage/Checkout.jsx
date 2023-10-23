import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import clientContext from '../../../context/client/clientContext';
import ButtonLoader from '../../Loading/ButtonLoader';
import './cards.css';

function Checkout() {

    const navigate = useNavigate();

    const params = useParams();
    // const navigate = useNavigate();
    const context = useContext(clientContext);

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCVC] = useState(''); 

    const [buttonDisabled, setButtonDisabled] = useState(false);
    // const [paymentMethodSelected, setPaymentMethodSelected] = useState("new");

    
    const { selectedPackage, getPackageById, timeout, defaultPaymentCard, changePaymentMethod, showToastMessage, confirmSubscriptionWithOldCard, paymentMethods, getUserCards, confirmSubscription } = context;

    useEffect(() => {
        getPackageById(params.package_id);
        getUserCards();
        // eslint-disable-next-line
    }, [params])
    
    const {
        getCardImageProps,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps
    } = usePaymentInputs();
    

    const handleCardNumberChange = (e) => {
        setCardNumber(e.target.value);
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value);
    };

    const handleCVCChange = (e) => {
        setCVC(e.target.value);
    };


    const onSubmit = async (e)=>{
        e.preventDefault();
        console.log(defaultPaymentCard)
        if(defaultPaymentCard === "new"){
            if(cardNumber.length === 0){
                showToastMessage("Invalid Card number provided!","warning")
                return;
            }

            if(expiryDate.length === 0){
                showToastMessage("Card expiry date can not be empty!","warning")
                return;
            }
            
            if(cvc.length === 0){
                showToastMessage("Card cvc/cvv can not be empty!","warning")
                return;
            }
            setButtonDisabled(true);

            const subResult = await confirmSubscription(cardNumber,expiryDate,cvc,defaultPaymentCard,params.package_id);

            if(subResult){
                await timeout(5000);
                navigate('/profile');
            }
        }else{
            // using default_card for subscribing
            setButtonDisabled(true);
            const subRes = await confirmSubscriptionWithOldCard(params.package_id);
            if(subRes){
                await timeout(5000);
                navigate('/profile');
            }
        }

        setButtonDisabled(false);
    }

    return (
        <div className="min-h-[85vh]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">{selectedPackage ? selectedPackage.title : "Package Name"}</h2>
                    <p className="mb-5 font-light text-white sm:text-xl">{selectedPackage ? selectedPackage.description : "Package Description"}</p>
                </div>
                {
                    
                    <div className="w-6/12 sm:gap-6 mx-auto text-white">
                        {
                            paymentMethods.length > 0 && paymentMethods.map((pm)=>{
                                return <div key={pm._id}>
                                    <input
                                        disabled={buttonDisabled}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        type="radio"
                                        name="paymentMethodSelected"
                                        value={pm._id}
                                        checked={pm._id === defaultPaymentCard}
                                        onChange={()=>{changePaymentMethod(pm._id)}}
                                    />
                                    <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium">
                                        {pm.card_name}
                                    </label>
                                    <div className={`${pm.class_name} + credit-card selectable`}>
                                        <div className="credit-card-last4">
                                            {pm.number.slice(-4)}
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                        <div className="flex items-center mb-4">
                            <input
                                disabled={buttonDisabled}
                                type="radio" 
                                value="new" 
                                name="new"
                                checked={defaultPaymentCard === "new"}
                                onChange={()=>{changePaymentMethod("new")}}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-white">
                                Use New Payment Method
                            </label>
                        </div>

                    </div>
                }
                <div className="w-6/12 sm:gap-6 mx-auto ">
                    {
                        defaultPaymentCard === "new" && (
                            <form className="flex flex-wrap gap-3 w-full p-2 text-white">
                                <label className="relative w-full flex flex-col">
                                    <span className="font-bold mb-3">Card number</span>
                                    <PaymentInputsWrapper>
                                        <svg {...getCardImageProps({ images })} />
                                        <input {...getCardNumberProps({onChange : handleCardNumberChange})} 
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
                                <label className="relative flex-1 flex flex-col">
                                    <span className="font-bold mb-3">Expire date</span>
                                    <input 
                                        {...getExpiryDateProps({onChange : handleExpiryDateChange})}
                                    className="rounded-md text-black peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </label>
                                <label className="relative flex-1 flex flex-col">
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
                                        {...getCVCProps({onChange : handleCVCChange})}
                                        className="rounded-md text-black peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </label>
                            </form>
                        )
                    }
                    <button
                        onClick={onSubmit}
                        className="mt-4 mb-2 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center btn-standard hover:bg-transparent hover:text-[#E9A039] hover:border-[#E9A039] hover:border">
                        {
                            buttonDisabled ? <ButtonLoader/> : <>
                                Confirm Subscription - $ {selectedPackage ? selectedPackage.price : "0"}
                            </>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Checkout