import { React, useContext, useEffect, useState } from "react";
import Spinner from "../Loading/Spinner";
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from "../Loading/ButtonLoader";

const Comments = () => {

    const context = useContext(adminContext);

    const { comments, getAllComments, showToastMessage, addNewComment, deleteCommentById, videos, getVideos, addNewReply} = context;

    const [loading, setLoading] = useState();
    const [showModal, setShowModal] = useState(false);
    const [isNew, setIsNew] = useState(true);

    const [delModal, setDelModal] = useState(false);
    const [delComment, setDelComment] = useState("");

    const [replyComment, setReplyComment] = useState({
        message: "",
        comment_id: ""
    });

    const [replyModal, setReplyModal] = useState(false);
    const [commentToReply, setCommentToReply] = useState("");

    const [reply, setReply] = useState({
        message: ""
    });

    const [comment, setComment] = useState({
        message: "",
        video: ""
    });

    const [editComment, setEditComment] = useState({
        _id: "",
        message: "",
        video: ""
    });

    const addOrUpdateComments = async (e)=>{
        e.preventDefault();
        setLoading(true);
        // validations
        if(comment.message.length === 0){
            showToastMessage("Comment message can not be empty","warning")
            return;
        }

        if(comment.message.length === 0){
            showToastMessage("Please select a video for new comment!","warning")
            return;
        }

        const data = new FormData();

        data.append("comment",comment.message);
        data.append("video",comment.video);

        let addResult = await addNewComment(data);
        if(addResult){
            closeModal();
        }
        setLoading(false);
    }

    const onChange = (e)=>{
        setComment({...comment, [e.target.name] : e.target.value});
        setEditComment({...editComment, [e.target.name] : e.target.value});
        setReplyComment({...replyComment, [e.target.name] : e.target.value});
    }   

    const closeModal = ()=>{
        setEditComment({
            _id: "",
            message: "",
            video: ""
        });
        setReplyComment({
            message: "",
            comment_id: ""
        });
        setComment({
            message: "",
            video: ""
        })
        setReplyModal(false);
        setShowModal(false);
        setIsNew(true);
    }
    
    const deleteComment = async()=>{
        if(delComment.length > 0){
            setLoading(true);
            let delResult = await deleteCommentById(delComment);
            if(delResult){
                setDelModal(false);
            }
            setDelComment("");
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        if(comments.length === 0){
            getAllComments();
        }
        if(videos.length === 0){
            getVideos();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])


    const addReply = async (e,id)=>{
        e.preventDefault();
        setLoading(true);
        if(commentToReply.length === 0){
            console.log("invalid comment ID");
            return;
        }

        if(reply.message.length >= 1){
            let data = new FormData();
            data.append("message",reply.message);
            let replyResult = await addNewReply(data,id);
            if(replyResult){
                closeReplyModal();
            }
        }else{
            showToastMessage("Reply message can not be empty!","warning");
        }
        setLoading(false);
    }

    const closeReplyModal = ()=>{
        setReplyModal(false);
        setReply({
            message: ""
        })
    }

    return (
    <>
        <div>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                    <div className="mb-4">
                        <h1 className="mt-2 font-serif text-2xl font-bold text-white">Comments</h1>
                        <div className="flex justify-end">
                            <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                onClick={()=>{setShowModal(true)}}
                            >
                                <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                <span className="ml-3">Create</span>
                            </button>
                        </div>
                        {
                            delModal ? 
                            <>
                            <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                            <h3 className="text-xl font-semibold">
                                                Are you sure you want to delete this Comment?
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                            <button 
                                                onClick={()=>{
                                                    setDelModal(false);
                                                    setDelComment("");
                                                }}
                                            className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                Cancel
                                            </button>
                                            <button
                                                disabled={loading}
                                                onClick={()=>{
                                                    deleteComment();
                                                }}
                                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                {
                                                    loading ? <ButtonLoader/> : "Confirm"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </> : null
                        }
                        {
                            replyModal &&
                            <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                Reply
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                onClick={() => closeModal()} > x </button>
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <form className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                        Reply Content
                                                    </label>
                                                    <textarea onChange={(e)=>{setReply({message: e.target.value})}} value={reply.message} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                        id="message" type="text" name="message" placeholder="Reply Content..."/>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                        disabled={loading}
                                                        onClick={(e)=>{addReply(e,commentToReply)}} >
                                                        {
                                                            loading ? <ButtonLoader/> : "Add Reply"
                                                        }
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {showModal ? (
                            <>
                                <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                <h3 className="text-3xl font-semibold">
                                                    Comment
                                                </h3>
                                                <button
                                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                    onClick={() => closeModal()} > x </button>
                                            </div>
                                            <div className="relative p-6 flex-auto">
                                                <form onSubmit={addOrUpdateComments} className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                            Comment
                                                        </label>
                                                        <input onChange={onChange} value={comment.message} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="message" type="text" name="message" placeholder="Comment Content..."/>
                                                    </div>
                                                    {
                                                        isNew ?
                                                        <div className="mb-6">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                Video
                                                            </label>
                                                            <select  id="video" name="video" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                {
                                                                    videos.map((video)=>{
                                                                        return <option key={video._id} value={video._id}>{video.title}</option>
                                                                    })
                                                                }
                                                            </select>

                                                        </div> : null
                                                    }
                                                    <div className="flex items-center justify-between">
                                                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                            </>
                            ) : null}
                    </div>
                    {loading ?
                    <Spinner />            
                    :
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        User Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Video Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Content
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Replies
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    comments.length > 0 && comments.map((comm)=>{
                                        return <tr key={comm._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {
                                                    comm.user ? comm.user.name : "User Not Found"
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    comm.video ? comm.video.title : "Video Not Found"
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    comm.comment.length > 50 ? `${comm.comment.substring(0,50)}...` : comm.comment
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    comm.replies.length
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={()=>{
                                                    // reply
                                                    setCommentToReply(comm._id);
                                                    setReplyModal(true);
                                                }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Reply </button> 
                                                <span className="mx-1">
                                                    |
                                                </span>
                                                <button onClick={()=>{
                                                    setDelModal(true);
                                                    setDelComment(comm._id)
                                                }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Delete </button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default Comments