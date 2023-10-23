import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import PIE from './PlayListItemExample';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { EmailShareButton } from 'react-share';
import clientContext from "../../../context/client/clientContext";
import TwitterIcon from '@mui/icons-material/Twitter';
const CategoryPage = ()=>{
    
    const params = useParams();
    
    const context = useContext(clientContext);
    const { category, getCategory, playListInCategory, imageHost } = context;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCategory(params.categoryname);
        setLoading(false);
        // eslint-disable-next-line
    }, [params.categoryname])

    
    return (
        <>
            <div style={{minHeight: '90vh'}} className="font-sans text-white mt-4 mb-4 ">
                <div className="md:mx-4 lg:mx-0 mt-4 mb-4">
                    <div className="flex flex-col sm:flex-row content-center w-full mx-auto 2xl:w-9/12 xl:w-10/12 xl:p-2 lg:w-9/12">
                        <div className="w-10/12 sm:w-1/2 mt-3 mx-auto max-h-[56] sm:mr-4">
                            {
                                !loading && category &&
                                <img src={`${imageHost}` + category.thumbnail} alt="Category Thumbnail" />
                            }
                        </div>
                        <div className='w-11/12 sm:w-1/2 mx-auto xl:mt-8'>
                            <h2 className="text-4xl text-bold mb-4 mt-4">
                                {
                                    !loading && category &&
                                    category.title
                                }
                            </h2>
                            <p className="text-lg mb-2 mr-4">
                                {
                                    !loading && category &&
                                    (
                                        category.description.length > 250 ?
                                        `${category.description.substring(0,250)} ...` : category.description
                                    )
                                }
                            </p>
                            {
                                !loading && category &&
                                <form className="rounded mt-4 lg:w-7/12 xl:w-6/12">
                                    <div className="flex flex-row lg:justify-around mb-4 gap-4 xl:gap-2">
                                        <h3 className="xl:w-5/12 mt-4 text-lg font-semibold text-white mb-4">
                                            Social Share:
                                        </h3>
                                        <FacebookShareButton
                                            className="xl:w-2/12"
                                            url={window.location.href}
                                            hashtag={"#girlsleap"}
                                            quote={`${category.title}`}
                                            description={`${category.description}`} >
                                            <div className="bg-[#182031] hover:bg-[#050c9c] w-[50px] h-[50px] flex items-center justify-center ">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                                                    height="50%" width="90%" fill="white"
                                                >
                                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                                                </svg>
                                            </div>
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            className='xl:w-2/12'
                                            quote={`${category.title}`}
                                            url={window.location.href}
                                            hashtags={["girlsleap", "alkeme"]}>
                                            <div className="bg-[#182031] hover:bg-[#050c9c]  w-[50px] h-[50px] flex items-center justify-center ">
                                                <TwitterIcon fontSize="large"/>
                                            </div>
                                        </TwitterShareButton>
                                        <EmailShareButton
                                            className='xl:w-2/12'
                                            quote={`${category.title}`}
                                            url={window.location.href}
                                            hashtags={[`${category.title}`, "girlsleap"]} >
                                            <div className="bg-[#182031] hover:bg-[#050c9c]  w-[50px] h-[50px] flex items-center justify-center ">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80%" height="80%">
                                                    <path d="M22 4H2C0.895 4 0 4.895 0 6v12c0 1.105.895 2 2 2h20c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 3.18L12 13.69 2 7.18V6l10 6.51L22 6v1.18z"/>
                                                </svg>
                                            </div>
                                        </EmailShareButton>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
                <hr className="w-10/12 mx-auto bg-white md:w-[95%] lg:w-[80%]"/>
                <div className="grid w-full p-3 2xl:w-9/12 lg:w-9/12 xl:w-10/12 sm:grid-cols-1 md:w-10/12 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        !loading && category &&
                        playListInCategory.map((item)=>{
                            return <div key={item._id}  className="cursor-pointer">
                                <PIE id={item._id} slug={item.slug} videos={item.videos.length} description={item.description} thumbnailUrl={item.thumbnail} title={item.title}/>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default CategoryPage;