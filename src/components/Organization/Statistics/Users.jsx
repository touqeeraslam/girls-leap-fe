import React, { useContext, useEffect, useState } from 'react';
import organizationContext from '../../../context/organization/organizationContext';

const Users = ()=> {
    
    const context = useContext(organizationContext);

    const { users, getUsers } = context;
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [selection, setSelection] = useState("Today");

    const filterToday = () => {
        // console.log("Function Called")
        if(users.length === 0){
            getUsers();
        }
        if(selection.length >= 0 && selection === "Today" && users.length > 0){
            const today = new Date();
            const filteredData = users.filter(user => {
                const userDate = new Date(user.date);
                return userDate.toDateString() === today.toDateString();
            });
            setFilteredUsers(filteredData);
            setSelection("Today");
        }
    };
    
    const filterWeek = () => {
        if(users.length === 0){
            getUsers();
        }
        if(selection.length >= 0 && selection !== "Week" && users.length > 0 ){
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
            const filteredData = users.filter(user => {
                const userDate = new Date(user.date);
                return userDate >= startOfWeek;
            });
            setFilteredUsers(filteredData);
            setSelection("Week");
        }
    };
    
    const filterMonth = () => {
        if(users.length === 0){
            getUsers();
        }
        if(selection.length > 0 && selection !== "Month" && users.length > 0){            
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const filteredData = users.filter(user => {
                const userDate = new Date(user.date);
                return userDate >= startOfMonth;
            });
            setFilteredUsers(filteredData);
            setSelection("Month");
        }
    };

    useEffect(() => {
        if(users.length === 0){
            getUsers();
        }
        filterToday();
        // eslint-disable-next-line
    }, [])
    
    
    return (
        <div className='relative text-black dark:text-white border border-2'>
            <h2 className="mt-2 mb-2 text-xl text-white" style={{ textAlign: 'center' }}>New Users - {selection}</h2>
            <div style={{ textAlign: 'center' }} className='w-full flex flex-row justify-around'>
                <button 
                    onClick={filterToday}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Today
                </button>
                <button 
                    onClick={filterWeek}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Week
                </button>
                <button 
                    onClick={filterMonth}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 border border-blue-700 rounded">
                    Month
                </button>
            </div>
            <div className="absolute h-80 overflow-y-scroll mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-white dark:text-gray-400">
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody className='bg-black dark:bg-gray-900 dark:border-gray-700'>
                        {
                            filteredUsers.map((user)=>{
                                return <tr key={user._id} className='text-center bg-black border-b dark:bg-gray-900 dark:border-gray-700'>
                                    <td className="px-6 py-4">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 ">
                                        {user.role}
                                    </td>
                                   
                                    <td className="px-6 py-4 ">
                                        {user.date}
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>            
        </div>
    );
}

export default Users;
