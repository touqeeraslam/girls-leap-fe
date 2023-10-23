import React from 'react'
import Spinner from '../Loading/Spinner2';
import { useContext } from "react";
import coachContext from "../../context/coach/coachContext";
import { useState } from 'react';
import { useEffect } from 'react';
import ButtonLoader from '../Loading/ButtonLoader';

const MyReplies = ()=> {

    const context = useContext(coachContext);

    const {replies, getReplies, deleteReply} = context;
    const [loading, setLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [replyIdToDelete, setReplyIdToDelete] = useState("");

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(replies.length === 0){
            getReplies();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])
    

    const replyDelete = async ()=>{
        if(replyIdToDelete.length > 0){
            setIsButtonDisabled(true);
            await deleteReply(replyIdToDelete);
            setShowDeleteModal(false);
            setReplyIdToDelete("");
            setIsButtonDisabled(false);
        }
    }

    
    return (
        <>
            <div className="container mt-4 w-full m-auto mb-8 min-h-screen">
                <div className="relative overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <h1 className="mt-2 font-serif text-2xl font-bold text-white">Replies</h1>
                    </div>
                    {
                        showDeleteModal ? 
                        <>
                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-xl font-semibold">
                                            Are you sure you want to delete this Reply?
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                        <button 
                                            onClick={()=>{
                                                setShowDeleteModal(false);
                                                setReplyIdToDelete("");
                                            }}
                                        className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isButtonDisabled}
                                            onClick={()=>{
                                                replyDelete();
                                            }}
                                            className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            {
                                                isButtonDisabled ? <ButtonLoader/> : "Confirm"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </> : null
                    }
                    {loading ?
                    <Spinner />            
                    :
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Comment
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Reply
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    replies.length > 0 && replies.map((comm)=>{
                                        return <tr key={comm._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {
                                                    comm.user.name ? comm.user.name : "User Not Found"
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    comm.comment.comment.length > 50 ? `${comm.comment.comment.substring(0,50)}...` : comm.comment.comment
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    comm.message
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={()=>{
                                                    setShowDeleteModal(true);
                                                    setReplyIdToDelete(comm._id);
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
        </>
    )
}

export default MyReplies;