import React, { useContext, useEffect } from 'react'
import clientContext from '../../../context/client/clientContext';
import { useParams } from 'react-router-dom';
import { useState } from 'react';


const CoachProfilePage = ()=> {

    const context = useContext(clientContext);

    const { getCoach, coach } =  context;

    const params = useParams();
    const [loading, setLoading] = useState(false);

    const getCoachInfo = async(username)=>{
        setLoading(true);
        await getCoach(username);
        setLoading(false);
    }

    useEffect(() => {
        getCoachInfo(params.coach);
        console.log(params);
        // eslint-disable-next-line
    }, [params])
    

    return (
        <>
            <div style={{minHeight: '90vh'}} className="font-sans text-white mt-4 mb-4 ">
                <div className="mt-4 mb-4">
                    {
                        !loading && coach &&
                        <div className="flex flex-col sm:flex-row content-center w-full mx-auto 2xl:w-9/12 xl:w-10/12 xl:p-2 lg:w-10/12">
                            <div className="w-10/12 h-auto sm:w-1/2 mt-8 mx-auto sm:mr-4">
                                {
                                    <img src={`${imageHost}` + coach.profile_picture} alt="Coach Profile Picture" />
                                }
                            </div>
                            <div className='w-11/12 sm:w-1/2 mx-auto ml-4 xl:mt-8'>
                                <h2 className="text-2xl text-bold mb-4 mt-4">
                                    {coach.name}
                                </h2>
                            </div>
                        </div>
                    }
                </div>
                <hr className="bg-white"/>
                <div className="grid w-full xl:p-2 2xl:w-9/12 lg:w-10/12 xl:w-10/12 sm:grid-cols-1 md:w-11/12 md:grid-cols-2 lg:grid-cols-3 lg:mx-auto">
                    {
                        !loading && playList &&
                        videosInPlaylist.map((item)=>{
                            return <div key={item._id} className="cursor-pointer">
                                <VIE locked={playListLocked} playlistslug={playList.slug} thumbnailUrl={item.thumbnail} description={item.description} title={item.title} id={item._id} videoSlug={item.slug} duration={item.duration} />
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );

}

export default CoachProfilePage