import React, { useContext, useEffect } from 'react';
import organizationContext from '../../../context/organization/organizationContext';

const PlaylistStatistics = ()=> {
    
    const context = useContext(organizationContext);

    const { playLists, getPlayLists } = context;

    useEffect(() => {
        if(playLists.length === 0){
            getPlayLists();
        }
        // eslint-disable-next-line
    }, [])
    
    
    const viewsForPlayList = (playlist)=>{
        return playlist.videos.reduce((accumulator, video) => accumulator + video.views, 0);
    }

    return (
        <div className='relative text-black dark:text-white border border-2'>
            <h2 className="mt-2 mb-2 text-xl text-white" style={{ textAlign: 'center' }}>Playlist</h2>
            <div className="absolute h-80 overflow-y-scroll mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-white dark:text-gray-400">
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
                                    <td className="px-6 py-4">
                                        {user.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.videos.length}
                                    </td>
                                    <td className="px-6 py-4">
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

export default PlaylistStatistics;
