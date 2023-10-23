import React, { useContext, useEffect, useState } from 'react';
import adminContext from '../../../context/admin/adminContext';


const Payments = ()=> {

    const [selection, setSelection] = useState("");

    const context = useContext(adminContext);

    const { getAllPayments, payments } = context;
    
    const [filteredPaymentsList, setFilteredPaymentsList] = useState([]);

    useEffect(() => {
        getAllPayments();
        // eslint-disable-next-line
    }, [])
    
    const subscriptionPayments = ()=>{
        const filteredPayments = payments.filter((payment) => payment.type === "subscription");
        setFilteredPaymentsList(filteredPayments);
    }

    const refunds = ()=>{
        const filteredPayments = payments.filter((payment) => payment.type === "refund");
        setFilteredPaymentsList(filteredPayments);
    } 

    const clearFilter = ()=>{
        setFilteredPaymentsList(payments);
    }

    return (
        <div className='relative text-black dark:text-white border border-2'>
            <h2 className="mt-2 mb-2 text-xl text-white" style={{ textAlign: 'center' }}>Payment Type - {selection}</h2>
            <div style={{ textAlign: 'center' }} className='w-full flex flex-row justify-around'>
                <button
                    onClick={()=>{setSelection("Successfull Payments"); subscriptionPayments();}}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Subscriptions
                </button>
                <button
                    onClick={()=>{setSelection("Refunds"); refunds();}}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Refunds
                </button>
                <button
                    onClick={()=>{setSelection("All"); clearFilter();}}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Clear
                </button>
            </div>
            <div className="absolute h-80 overflow-y-scroll mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-white dark:text-gray-400">
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Payment Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='bg-black dark:bg-gray-900 dark:border-gray-700'>
                        {
                            filteredPaymentsList.map((payment)=>{
                            return <tr key={payment._id} className='text-center bg-black border-b dark:bg-gray-900 dark:border-gray-700'>
                                <td className="px-6 py-4">
                                    {payment.user ? payment.user.name : "User"}
                                </td>
                                <td className="px-6 py-4">
                                    Payment
                                </td>
                                <td className="px-6 py-4">
                                    {payment.type}
                                </td>
                                <td className="px-6 py-4">
                                    $ {payment.amount}
                                </td>
                            </tr>
                        })
                        }
                    </tbody>
                </table>
            </div>            
        </div>
    )
}

export default Payments