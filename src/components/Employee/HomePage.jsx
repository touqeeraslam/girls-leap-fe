import { useContext } from "react";
import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import employeeContext from "../../context/employee/employeeContext";
import Spinner from '../Loading/Spinner';
import CategoryDisplay from "./CategoryDisplay";


const HomePageEmployee = ()=>{
    const context = useContext(employeeContext)
    const { getMyCategories, categories } = context;
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
        setLoading(true);
        getMyCategories();
        setLoading(false);
    }, [navigate])


    

    return (
        <>
            <div className='container sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1536px] 2xl:max-w-full'>

            {
                    !loading ? categories?.length > 0 &&
                    categories.map((category) =>{
                        return <CategoryDisplay key={category._id} id={category._id} name={category.title} slug={category.slug} list={category.playlists}/>
                    }) : <Spinner/>
                }
                </div>
        </>
    );

}

export default HomePageEmployee;