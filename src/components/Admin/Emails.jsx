import { useEffect, useState } from "react";
import LoadingSpinner from '../Loading/Spinner';
import { useContext } from "react";
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from "../Loading/ButtonLoader";

const EmailsTab = ()=>{
    
    const context = useContext(adminContext);

    const { showToastMessage, emails, getEmails, sendEmailReply } = context;

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [replyContent, setReplyContent] = useState("");
    const [replySubject, setReplySubject] = useState("");
    const [emailID, setEmailId] = useState("");

    useEffect(() => {
        setLoading(true);
        if(emails.length === 0){
            getEmails();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])

    const replyEmail = async(e)=>{
        e.preventDefault();

        if(replyContent.length === 0){
            showToastMessage("Email reply can not be empty!","warning");
            return;
        }
        
        if(replySubject.length === 0){
            showToastMessage("Email subject can not be empty!","warning");
            return;
        }

        if(emailID.length === 0){
            showToastMessage("Invalid email selected!","warning");
            return;
        }
        

        setIsButtonDisabled(true);
        setIsLoading(true);
        let formData = new FormData();

        formData.append("replyContent", replyContent);
        formData.append("replySubject", replySubject);
        formData.append("emailId",emailID);

        await sendEmailReply(formData);

        setIsButtonDisabled(false);
        setIsLoading(false);

        closeModal();
    }

    const closeModal = ()=>{
        setShowModal(false);
        setReplyContent("");
        setReplySubject("");
    }

    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl text-white font-bold">Contact Us - Emails</h1>
                                {showModal ? (
                                    <>
                                        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Email Reply
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form onSubmit={replyEmail} className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Subject
                                                                </label>
                                                                <input 
                                                                    value={replySubject} 
                                                                    onChange={(event)=>{
                                                                        setReplySubject(event.target.value);
                                                                    }}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="name" type="text" name="name" placeholder="Subject"/>
                                                            </div>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Reply
                                                                </label>
                                                                <textarea 
                                                                    value={replyContent} 
                                                                    onChange={(event)=>{
                                                                        setReplyContent(event.target.value);
                                                                    }}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="name" type="text" name="name" placeholder="Reply Content..."></textarea>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <button 
                                                                    disabled={isButtonDisabled}
                                                                    type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        isLoading ? (
                                                                            <ButtonLoader/>
                                                                        ) : "Reply"
                                                                    }
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
                            <LoadingSpinner />            
                            :
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="flex flex-row px-6 py-3">
                                                Name 
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Created On
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Message
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            emails.length > 0 && 
                                            emails.map((email)=>{
                                                return <tr>
                                                    <td className="flex flex-row px-6 py-3">
                                                        {email.name} 
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {email.email} 
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {email.created_on}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {email.message}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <button onClick={()=>{
                                                            setEmailId(email._id);
                                                            setShowModal(true);
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Reply </button> 
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
            }
        </>
    );

}

export default EmailsTab;