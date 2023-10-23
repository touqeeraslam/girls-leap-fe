import React, { useContext, useState } from 'react';
import clientContext from '../../../context/client/clientContext';

const Comment =  ({comment,user})=> {

    const [showReplySection, setShowReplySection] = useState(false);
    const [message, setMessage] = useState("");

    const context = useContext(clientContext);
    const { addNewReply, imageHost } = context;

    const replySection = ()=>{
        setShowReplySection(true);
    }

    const addReply = async (id)=>{
        if(message.length >= 1){
            const sendReply = await addNewReply(message,id);
            if(sendReply !== null){
                comment.replies.push(sendReply);
                setShowReplySection(false);
            }
        }
    }

    const onChange = (e)=>{
        setMessage(e.target.value);
    }
    
    return (
        <div>
            <div className="flex w-full flex-col border rounded-md">
                <div className="p-3">
                    <div className="flex gap-3 items-center">
                        <img src={comment.user && comment.user.profile_picture ? `${imageHost}` + comment.user.profile_picture : "/images/profile.png"} alt=""
                            className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"/>
                        <h3 className="font-bold text-white">
                            {comment.user ? comment.user.name : 'User'}
                            <br/>
                        </h3>
                    </div>
                    <p className="text-white-600 mt-2">
                        {comment.comment}
                    </p>
                    {
                        localStorage.getItem('token') ?
                        <button className="text-right text-gray-500" onClick={()=>{replySection()}} >
                            Reply
                        </button> : null
                    }
                </div>
            </div>
            {
                showReplySection &&
                <div>
                    <div className="w-full px-3 mb-2 mt-6 flex flex-row">
                        {
                            user && user.profile_picture ?
                            <img
                                className="h-9 w-9 rounded-full mr-2"
                                src={`${imageHost}` + user.profile_picture}
                                alt=""
                            /> :
                            <img
                                className="h-9 w-9 rounded-full mr-2"
                                src={'/images/profile.png'}
                                alt=""
                            />       
                        }
                        <textarea className="text-black bg-gray-100 rounded border border-gray-400 resize-none w-full h-16 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
                            name="message" id="message" value={message} onChange={onChange} placeholder="Comment..." required></textarea>
                    </div>
                    <div className="w-full flex justify-end px-3 my-3 gap-4">
                        <button type="submit"className='px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 text-lg'
                            onClick={()=>{setShowReplySection(false)}}
                        >
                            Cancel
                        </button>
                        <button type="submit"className='px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 text-lg'
                            onClick={()=>{addReply(comment._id)}}
                        >
                            Leave Reply
                        </button>
                    </div>
                </div>
            }
            {
                comment.replies.length > 0 ?
                comment.replies.map((reply)=>{
                    return  <div key={reply._id}>
                        <div className="text-gray-300 font-bold pl-14">|</div>
                        <div className="flex justify-between border ml-5  rounded-md">
                            <div className="p-3">
                                {
                                    reply.user ?
                                    <div className="flex gap-3 items-center">
                                        <img src={reply.user.profile_picture ? `${imageHost}` + reply.user.profile_picture : "/images/profile.png"}
                                            alt=""
                                                className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"/>
                                        <h3 className="font-bold">
                                            {reply.user ? reply.user.name: "User not Found"}
                                            <br/>
                                        </h3>
                                    </div> : <div className="flex gap-3 items-center">
                                        <img src={"/images/profile.png"}
                                            alt=""
                                                className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"/>
                                        <h3 className="font-bold">
                                            {"User not Found"}
                                            <br/>
                                        </h3>
                                    </div>
                                }
                                <p className="text-gray-white mt-2">
                                    {reply.message}
                                </p>
                            </div>
                        </div>
                    </div>
                }) : null
            }
        </div>
    )
}

export default Comment