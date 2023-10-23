import React, { useContext, useEffect, useState } from "react";
import organizationContext from "../../context/organization/organizationContext";
import Spinner from '../Loading/Spinner';

const MyCategories = () => {
    const context = useContext(organizationContext)
    const [loading , setLoading] = useState(false)
    const {getAllCategories , videos,categories} = context;

    useEffect(()=>{
        setLoading(true)
        getAllCategories()
        setLoading(false)
    },[])
    return(
        <>
        <div>
        <div className="p-4 sm:ml-64">
        {loading ?
                            <Spinner />            
                            :
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                               <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Active
                                            </th>
                                          
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categories.map((category)=>{
                                                return <tr key={category._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                    <td className="px-6 py-4">
                                                        {category.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            category.description.length > 50 ? `${category.description.substring(0,50)}...` : category.description
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            category.active === true ? "Yes" : "No"
                                                        }
                                                    </td>
                                                  
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            }
        </div>
        </div>
        
        </>
    )
}

export default MyCategories;