import React from 'react';
import loading from '../loading.gif'

const Spinner = ()=> {
  return <>
    <div className="mb-4 mt-4 grid h-screen place-items-center">
      <img className="my-3" src={loading} alt="Loading" />
    </div>
  </>
}

export default Spinner;
