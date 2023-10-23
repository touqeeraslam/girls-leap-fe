import React, { useContext, useEffect } from 'react';
import coachContext from '../../../context/coach/coachContext';

const Videos = ()=> {
    
    const context = useContext(coachContext);

    const { videos, getVideos } = context;

    useEffect(() => {
        if(videos.length === 0){
            getVideos();
        }
        // eslint-disable-next-line
    }, [])
    
    
    return (
        <div className='relative text-black dark:text-white border border-2'>
            <h2 className="mt-2 mb-2 text-xl" style={{ textAlign: 'center' }}>Videos</h2>
            <div className="absolute h-80 overflow-y-scroll mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th>Name</th>
                            <th>Video ID</th>
                            <th>Comments</th>
                            <th>Views</th>
                        </tr>
                    </thead>
                    <tbody className='bg-black dark:bg-gray-900 dark:border-gray-700'>
                        {
                            videos.map((user)=>{
                                return <tr key={user._id} className='text-center bg-black border-b dark:bg-gray-900 dark:border-gray-700'>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.title}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.url}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.comments.length}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.views}
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

export default Videos;
