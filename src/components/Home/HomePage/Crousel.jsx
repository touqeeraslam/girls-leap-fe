import { useContext, useEffect  } from 'react';
import clientContext from '../../../context/client/clientContext';

import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'


const Carousel = ()=>{

    const context = useContext(clientContext);
    const {slides, getCarouselItems, imageHost } = context;
    
    useEffect(() => {
        getCarouselItems();
        // eslint-disable-next-line
    }, [])

    const divStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
    }
    
    return (
        <>
            <div className="cursor-pointer sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1536px] 2xl:max-w-full h-[400px] xl:h-[730px] w-full m-auto relative group">
                {
                    slides.length > 0 &&
                    <>
                        <Fade>
                            {slides.map((slideImage, index)=> (
                                <div key={index}>
                                    <div className='drop-shadow-xl text-white h-[400px] xl:h-[730px] flex flex-col' 
                                        style={{ ...divStyle,  'backgroundImage': `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url(${imageHost}/${slideImage.thumbnail})`}}>
                                        <h1 className="text-2xl xl:text-5xl w-6/12 text-center font-bold mb-4 mt-[200px] md:mt-[300px] xl:mt-[560px]" style={{opacity: 1}}> 
                                            {slideImage.title}
                                        </h1>
                                        <p className="text-md xl:text-xl w-8/12 text-center mb-4" style={{opacity: 1}}> 
                                            {slideImage.description.length > 150
                                            ? `${slideImage.description.substring(0, 150)} ...`
                                            : slideImage.description}
                                        </p>
                                        <h5 className="text-xl mb-16" style={{opacity: 1}}>
                                            {slideImage.videos.length} Items
                                        </h5>
                                    </div>
                                </div>
                            ))} 
                        </Fade>
                    </>
                }
            </div>
        </>
    );

}

export default Carousel;