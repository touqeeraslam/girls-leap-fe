import Slider from "react-slick";
import VIL from './VideoInMyList';
import PLML from './PlayListInMyList';

const MyListCarousel = (props)=>{

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
        <div className='mx-4'>
            <div className='flex flex-row justify-between mr-4'>                
                <h2 className=' mt-4 ml-8 text-2xl font-medium font-bold text-white'>
                    <a href={`my-list`}>
                        My List
                    </a>
                </h2>
                <a href={`/my-list`} className='hidden sm:block 2xl:ml-16 start-watching-standard btn-standard px-6 py-2 mt-4 font-bold text-white text-sm '>
                    View All
                </a>
            </div>
            <div className="mt-2 mx-4">
              {
                <Slider {...settings} infinite={props.list.length > 4}>
                    {
                        props.list.map((item,index)=>{
                            // console.log(item)
                            if(item.model_type === "video"){
                                return <div key={index}>
                                  <VIL thumbnailUrl={item.references.thumbnail} description={item.references.description} videoSlug={item.references.slug} duration={item.references.duration} title={item.references.title} id={item.references._id} slug={"something-here-to-test"} />
                                </div>
                            }
                            return <div key={index}>
                              <PLML id={item.references._id} description={item.references.description} slug={item.references.slug} thumbnailUrl={item.references.thumbnail} title={item.references.title} videos={item.references.videos.length} />
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

export default MyListCarousel;
