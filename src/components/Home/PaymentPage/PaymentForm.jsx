import React, { useContext, useEffect } from 'react'
import clientContext from '../../../context/client/clientContext'
import FeatureList from './FeatureList';
import { useParams } from 'react-router-dom';


const PaymentForm = ()=>{

    const params = useParams();

    const context = useContext(clientContext);
    const { packages, getPackages } = context;

    useEffect(() => {
        if(packages.length === 0){
            getPackages();
        }
        // eslint-disable-next-line
    }, [params])
    
    return (
        <div className="min-h-[85vh]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">Designed for needs.</h2>
                    <p className="mb-5 font-light text-white sm:text-xl dark:text-gray-400">Here at GIRLS L.E.A.P we focus on long-term value.</p>
                </div>
                <div className="lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {
                        packages.length > 0 &&
                        packages.map((item)=>{
                            console.log(item.price);
                            return <div key={item._id} 
                                className="flex flex-col p-6 mx-auto sm:w-[300px] mt-4 mb-4 xl:mt-0 xl:mb-0 md:w-[350px] xl:w-[400px] 
                                    text-center bg-black  text-white rounded-lg border border-gray-100 shadow xl:p-8"
                            >
                                <h3 className="mb-4 text-2xl font-semibold">{item.title}</h3>
                                <p className="font-light sm:text-lg dark:text-gray-400">{item.description}</p>
                                {
                                    item.price === 0 ?
                                    <div className="flex justify-center items-baseline my-8">
                                        <span className="mr-2 text-5xl font-bold">Free Content</span>
                                    </div> :
                                    <div className="flex justify-center items-baseline my-8">
                                        <span className="mr-2 text-5xl font-bold">${item.price}</span>
                                        <span>/month</span>
                                    </div>
                                }
                                <FeatureList features={item.features}/>
                                {
                                    item.price !== 0 ?
                                    <a  href={`/checkout/${item._id}`}
                                        className="mt-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-blue-900"
                                    >Get started</a> : 
                                    <button
                                            className="mt-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-blue-900"
                                        >Free</button>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default PaymentForm;