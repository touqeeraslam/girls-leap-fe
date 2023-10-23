import Slider from "react-slick";
import PIE from '../Playlist/PlayListItemExample';

const CategoryDisplay = (props)=>{

    const settings = {
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        draggable: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    speed: 1000,
                    arrows: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    speed: 1000,
                    arrows: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 1000,
                    arrows: false,
                }
            }
        ]
    }; 
    
    return (
        <div className="mx-4">
            <div className='flex flex-row justify-between mr-4'>                
                <h2 className=' mt-4 ml-8 text-2xl font-medium font-bold text-white'>
                    <a href={`/category/${props.slug}`}>
                        {props.name}
                    </a>
                </h2>
                <a href={`/category/${props.slug}`} className='hidden sm:block 2xl:ml-16 start-watching-standard btn-standard px-6 py-2 mt-4 font-bold text-white text-sm '>
                    View All
                </a>
            </div>
            <div className="mt-2 mx-4">
                {
                    <Slider {...settings} infinite={props.list.length > 4}>
                        {
                            props.list.map((item,index)=>{
                                return <div key={index}>
                                    <PIE id={item._id} slug={item.slug} description={item.description} thumbnailUrl={item.thumbnail} title={item.title} videos={item.videos.length} />
                                </div>
                            })
                        }
                    </Slider>
                }
            </div>
            <hr/>
        </div>
    );
}

export default CategoryDisplay;
