import Slider from "react-slick";
import VIWP from './VideoItemWithProgress';

const MyContinueList = (props)=>{

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
        <div className='mx-4' >
            <div className='flex flex-wrap'>
                <h2 className='mx-4 w-11/12 mt-4  lg:ml-8 text-2xl font-medium font-bold text-white'>Continue Watching</h2>
            </div>
            <div className="mt-2 mx-4">
            {
                <Slider {...settings} infinite={props.list.length > 4}>
                    {
                        props.list.map((item,index)=>{
                            return <div key={index}> 
                                <VIWP thumbnailUrl={item.video.thumbnail}  description={item.video.description} videoSlug={item.video.slug} duration={item.video.duration} title={item.video.title} id={item.video._id} progress={item.progress} slug={"something-here-to-test"} />
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

export default MyContinueList;
