import PIE from './PlayListItemExample';
import VIE from './VideoItemExample';
import { useContext, useEffect, useState } from 'react';
import Spinner from '../../Loading/Spinner';
import clientContext from '../../../context/client/clientContext';

const MyList = ()=>{

    const context = useContext(clientContext);

    const { getMyListItems, myListItems } = context;
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(myListItems.length === 0){
            getMyListItems();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])
    
    return (
        <>
            {
                <div style={{minHeight: '90vh'}} className="font-sans text-white mt-4 mb-4 ">
                    <h2 className="w-full text-center text-3xl font-sans">
                        My List
                    </h2>
                    <div className="grid w-full xl:p-2 2xl:w-8/12 lg:w-8/12 xl:w-9/12 sm:grid-cols-1 md:w-9/12 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                        {
                            loading ? 
                            <Spinner/> :
                            myListItems && myListItems.map((item,index)=>{
                                if(item.model_type === "video"){
                                    return <div key={index}>
                                        <VIE thumbnailUrl={item.references.thumbnail} title={item.references.title} id={item.references._id} slug={"something-here-to-test"} />
                                    </div>
                                }
                                return <div key={index}>
                                    <PIE id={item.references._id} slug={item.references.slug} thumbnailUrl={item.references.thumbnail} title={item.references.title} videos={item.references.videos.length} />
                                </div>
                            })
                        }
                    </div>  
                </div>
            }
        </>
    );

}


export default MyList;