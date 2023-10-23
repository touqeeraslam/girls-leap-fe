import React from 'react';
import loading from '../loading.gif'

const ButtonLoader = ()=> {
    return <div className='flex items-center justify-center'>
        <img className='px-4' src={loading} alt="Loading"/> 
    </div>
}

export default ButtonLoader;
