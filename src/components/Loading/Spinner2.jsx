import React from 'react';
import loading from '../loading2.gif'

const SpinnerLoading = ()=> {
    return <>
      <div className="flex flex-col justify-center items-center h-screen">
        <img className="my-3" src={loading} alt="Loading" />
        <h2 className='text-2xl text-white'>
          Verifying Email Address....please wait.
        </h2>
      </div>
    </>
}

export default SpinnerLoading;
