import React, { useContext, useEffect } from 'react';
import coachContext from '../../../context/coach/coachContext';

const Playlist = ()=> {
    
    const context = useContext(coachContext);

    const { playLists, getPlaylists } = context;
    
    useEffect(() => {
        if(playLists.length === 0){
            getPlaylists();
        }
        // eslint-disable-next-line
    }, [])
    
    
    const viewsForPlayList = (playlist)=>{
        return playlist.videos.reduce((accumulator, video) => accumulator + video.views, 0);
    }

    return (
        <div className='relative text-black dark:text-white border border-2'>
            <h2 className="mt-2 mb-2 text-xl" style={{ textAlign: 'center' }}>Playlist</h2>
            <div className="absolute h-80 overflow-y-scroll mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th>Title</th>
                            <th>Videos</th>
                            <th>Views</th>
                        </tr>
                    </thead>
                    <tbody className='bg-black dark:bg-gray-900 dark:border-gray-700'>
                        {
                            playLists.map((user)=>{
                                return <tr key={user._id} className='text-center bg-black border-b dark:bg-gray-900 dark:border-gray-700'>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.title}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.videos.length}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {viewsForPlayList(user)}
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

export default Playlist;
