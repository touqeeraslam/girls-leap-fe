import { useState } from "react";
import coachContext from "./coachContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";


// const host = "https://portal2.ithawks.pk/api";
// const host = "https://gl2.ithawks.pk/api";

// const host = "https://gl2.theitking.pk/api";
// const imageHost = "https://gl2.theitking.pk/";

const host = "http://localhost:5000/api";
const imageHost = "http://localhost:5000/";

// const imageHost = "https://portal.ithawks.pk/";
// const imageHost = "https://gl2.ithawks.pk/";


const CoachState = (props)=>{

    const [loggedInUser, setLoggedInUser] = useState();

    let navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [videos, setVideos] = useState([]);
    const [playLists, setPlayLists] = useState([]);
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);

    // notification
    const showToastMessage = (message,type) => {
        toast(message, {
            type: type
        });
    };

    // navbar
    const getCoach = async ()=>{
        const response = await fetch(`${host}/auth/getuser`, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        if(json.user.role === "coach"){   
            setLoggedInUser(json.user);
        }else{
            navigate('/');
        }
    }

    // video section
    const getVideos = async ()=>{
        const response = await fetch(`${host}/videos/getvideos`, {
            method: 'GET',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if(json.success){
            setVideos(json.videos);
        }
    }

    const addVideo = async(formData)=>{
        const saveVideo = await axios({
            method: "POST",
            url: `${host}/videos/addvideo`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = saveVideo.data;
        
        if(json.success === true){
            showToastMessage("Video added successfully!","success");
            getVideos();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const updateVideo = async(formData,id)=>{
        const updateVideo = await axios({
            method: "PUT",
            url: `${host}/videos/updatevideo/${id}`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = updateVideo.data;
        if(json.success){
            showToastMessage("Video Updated successfully!","success");
            getVideos();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const deleteVideo = async(id)=>{
        const response = await fetch(`${host}/videos/deletevideo/${id}`, {
            method: 'DELETE',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if(json.success){
            showToastMessage("Video removed successfuly!","success");
            getVideos();
        }else{
            showToastMessage(json.error,"error")
        }

        return true;
    }

    // playlist section
    const getPlaylists = async()=>{
        const playlists = await fetch(`${host}/playlist/getplaylists`,{
            method: "GET",
            headers:{
                "auth-token": localStorage.getItem('token')
            }
        });
        const listsJson = await playlists.json();
        console.log(listsJson);
        if(listsJson.success){
            setPlayLists(listsJson.playlists);
        }
    }
    
    const addPlayList = async (formData)=>{

        const saveList = await axios({
            method: "POST",
            url: `${host}/playlist/addplaylist`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });

        const json = saveList.data;
        
        if(json.success){
            showToastMessage("Playlist Added successfully!","success");
            getPlaylists();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const updatePlaylist = async(formData,id)=>{
        const updateList = await axios({
            method: "PUT",
            url: `${host}/playlist/updateplaylist/${id}`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });

        const json = updateList.data;

        if(json.success){
            showToastMessage("Playlist updated successfully!","success");
            getPlaylists();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const deletePlaylist = async(id)=>{

        const delPlayList = await axios({
            method: "Delete",
            url: `${host}/playlist/deleteplaylist/${id}`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        })
        
        const json = delPlayList.data;

        if(json.success){
            showToastMessage("Playlist removed successfully","success");
            getPlaylists();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    // comment section
    const getMyComments = async()=>{
        const commentsOnMyVids = await axios({
            method: "GET",
            url: `${host}/comments/commentsonmyvid`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = commentsOnMyVids.data;
        console.log(json);
        if(json.success){
            setComments(json.comments);
        }
    }

    const addNewComment = async(formData)=>{

        const postComment = await axios({
            method: "POST",
            url: `${host}/comments/postcomment`,
            data: formData,
            headers: {
                "Content-Type" : "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        
        const json = postComment.data;
        if(json.success){
            showToastMessage("Comment Posted Successfully","success");
            getMyComments();
            return true;
        }else{
            showToastMessage(json.error,"error")
            return false;
        }
    }

    const deleteCommentByID = async(id)=>{

        const delComment = await axios({
            method: "DELETE",
            url: `${host}/comments/deletecomment/${id}`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });

        const json = delComment.data;

        if(json.success){
            getMyComments();
            showToastMessage("Comment removed successfully!","success");
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    // reply section
    const getReplies = async ()=>{
        const getReps = await axios({

            method:"GET",
            url: `${host}/replies/get-all-replies`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        let json = getReps.data;
        if(json.success){
            setReplies(json.repliesFiltered);
        }
    }

    const addReply = async(message,comment)=>{

        const data = new FormData();

        data.append("message",message);

        const postReply = await axios({
            method: "POST",
            url: `${host}/replies/reply/${comment}`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });

        const replyJson = postReply.data;
        console.log(replyJson);
        if(replyJson.success){
            getMyComments();
            showToastMessage("Reply posted successfully","success");
            return true;
        }else{
            showToastMessage(replyJson.error,"error");
            return false;
        }
    }

    const deleteReply = async(id)=>{
        const response = await fetch(`${host}/replies/delete/${id}`, {
            method: 'DELETE'
        });
        const json = await response.json();
        if(json.success){
            getReplies();
            showToastMessage("Reply deleted successfully!","success");
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    // get categories
    const getCategories = async ()=>{
        const categories = await fetch(`${host}/categories/getcategories`,{
            method: "GET",
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const catJson = await categories.json();
        if(catJson.success){
            setCategories(catJson.categories);
        }
    }

    return <coachContext.Provider value={{getCoach,loggedInUser, categories, getCategories, videos, getVideos, addVideo, updateVideo, deleteVideo, 
        comments, getMyComments, addNewComment, deleteCommentByID, replies, getReplies, addReply, deleteReply, imageHost, showToastMessage,
        playLists, getPlaylists, addPlayList, updatePlaylist, deletePlaylist}}>
        {props.children}
    </coachContext.Provider>

}

export default CoachState