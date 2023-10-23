import React from 'react'

function Packages({id,title, price, selectedPackage, currentPacakge }) {
    
    return (
        <>
            <div className={currentPacakge ? "shadow p-5 rounded-lg border-t-8 border-gray-400 bg-white cursor-pointer" : "shadow p-5 rounded-lg border-t-8 border-yellow-400 bg-white cursor-pointer"}
                onClick={()=>{ selectedPackage(id,price);  }} >
                <p className="uppercase text-sm font-medium text-gray-500">
                    {title}
                </p>
                <p className="mt-4 text-3xl text-gray-700 font-medium">
                    {price === 0 ? "Free" : "$" + price }
                </p>
            </div>
        </>
    )
}

export default Packages
