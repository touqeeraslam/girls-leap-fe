import React from "react";
import employeeContext from "../../context/employee/employeeContext";
import { useContext } from "react";
import VIE from "./VIE";
const MyVideosEmployee = () => {
    const context = useContext(employeeContext);
    const { videos, imageHost,loggedInUser } = context;
    return(
        <>
         <div style={{minHeight: '90vh'}} className="font-sans text-white mt-4 mb-4 ">
                <div className="md:mx-4 lg:mx-0 mt-4 mb-4">
                      
                <div className="grid w-full p-3 2xl:w-9/12 lg:w-9/12 xl:w-10/12 sm:grid-cols-1 md:w-10/12 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        loggedInUser?.videos?.map((item)=>{
                            return <div key={item._id} className="cursor-pointer">
                                <VIE  thumbnailUrl={item.thumbnail} description={item.description} title={item.title} id={item._id} videoSlug={item.slug} duration={item.duration} />
                            </div>
                        })
                    }
                </div>
                </div>

                </div>
        </>
    )
}

export default MyVideosEmployee;