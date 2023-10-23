import HomePageCarousel from './Crousel';
import { useContext, useEffect, useState } from 'react';
import CategoryDisplay from './CategoryList';
import MyListCarousel from './MyListCarousel';
import Spinner from '../../Loading/Spinner';
import MyContinueList from './ContinueWatching'; 
import clientContext from '../../../context/client/clientContext';

const ClientHome = ()=>{

    const context = useContext(clientContext);

    const {categories, getHomePageContent, myList, getMyFavList, myContinueWatchingSection, getContinueSection } = context;

    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        getHomePageContent();
        getMyFavList();
        getContinueSection();       
        setLoading(false);
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <HomePageCarousel/>
            <div className='container sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1536px] 2xl:max-w-full'>
                {
                    myContinueWatchingSection.length > 0 &&
                    <MyContinueList list={myContinueWatchingSection}/>
                }
                {
                    myList.length > 0 &&
                    <MyListCarousel list={myList} />
                }
                {
                    !loading ? categories.length > 0 &&
                    categories.map((category) =>{
                        return <CategoryDisplay key={category._id} id={category._id} name={category.title} slug={category.slug} list={category.playlists}/>
                    }) : <Spinner/>
                }
            </div>
        </>
    );
}

export default ClientHome;