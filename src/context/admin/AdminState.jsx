import { useState } from 'react';
import AdminContext from './adminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const host = "https://gl2.ithawks.pk/api";
// const host = "https://portal2.ithawks.pk/api";

// const host = "https://gl2.theitking.pk/api";
// const imageHost = "https://gl2.theitking.pk/";

// const host = "http://localhost:5000/api";
// const imageHost = "http://localhost:5000/";

const imageHost = "https://gl2.ithawks.pk";
// const imageHost = "https://portal2.ithawks.pk/";


const AdminState = (props)=>{

    let navigate = useNavigate();

    const [loggedInUser, setLoggedInUser] = useState();
    const [users, setUsers] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [categories, setCategories] = useState([]);
    const [playLists, setPlaylists] = useState([]);
    const [videos, setVideos] = useState([]);
    const [navigationItems, setNavigationItems] = useState([]);
    const [comments, setComments] = useState([]);
    const [packages, setPackages] = useState([]);

    const showToastMessage = (message,type) => {
        toast(message, {
            type: type
        });
    };

    // sidebar section
    const getUser = async ()=>{
        if(!localStorage.getItem('token')){
            navigate('/');
            return;
        }

        const response = await fetch(`${host}/auth/getuser`, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });

        const json = await response.json();
        if(json.user.role === "admin" ){
            setLoggedInUser(json.user);
        }
        else{
            navigate('/');
        }
    }

    // Users Section
    const getUsers = async ()=>{
        // fetch all users here
        const response = await fetch(`${host}/users/getusers`, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if(json.success){
            setUsers(json.users);
        }
    }

    const addUser = async(user)=>{
        const saveUser = await axios({
            method: "POST",
            url: `${host}/auth/create-user`,
            data: user,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = saveUser.data;
        if(json.success){
            showToastMessage("User added successfully!","success");
            getUsers();
            return true;
        }else{
            showToastMessage(json.error,"error")
            return false;
        }
    }

    const editUserC = async (editUser,id)=>{
        const updateUser = await axios({
            method: "PUT",
            url: `${host}/users/updateuser/${id}`,
            data: editUser,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = updateUser.data;
        if(json.success){
            showToastMessage("User updated Successfully!", "success");
            getUsers();
        }else{
            showToastMessage(json.error, "error");
        }
    }

    const deleteUser = async (id)=>{
        const response = await fetch(`${host}/users/deleteuser/${id}`, {
            method: 'DELETE',
            headers: {
              "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if(json.success){
            getUsers();
            showToastMessage("User deleted successfully!","success");
        }
    }

    const getCoaches = async()=>{
        const coaches = await axios({
            method: "GET",
            url: `${host}/users/getCoaches`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const data = coaches.data;
        if(data.success){
            setCoaches(data.users);
        }
    }

    // categories section
    const getcategories = async ()=>{
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

    const addCategory = async(formData)=>{
        const addCategory = await axios({
            method: "POST",
            url: `${host}/categories/addcategory`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = addCategory.data;
        if(json.success){
            showToastMessage("Category Added Successfully!","success");
            categories.push(json.category);
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const editCategoryById = async(formData,id)=>{
        const updateCategory = await axios({
            method: "PUT",
            url: `${host}/categories/updatecategory/${id}`,
            data: formData,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = updateCategory.data;
        if(json.success){
            showToastMessage("Category Modified Successfully!","success");
            getcategories();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const deleteCategoryById = async(id)=>{
        const response = await fetch(`${host}/categories/deletecategory/${id}`,{
            method: "DELETE",
            headers: {
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
        if(json.success){
            showToastMessage("Category removed successfully!","success");
            getcategories();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    // playlist section
    const getPlayLists = async()=>{
        const response = await fetch(`${host}/playlist/getlists`, {
            method: 'GET'
        });
        const json = await response.json();
        if(json.success){
            setPlaylists(json.playLists);
        }
    }

    const addNewList = async(data)=>{
        const saveList = await axios({
            method: "POST",
            url: `${host}/playlist/addplaylist`,
            data: data,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = saveList.data;
        if(json.success){
            getPlayLists();
            showToastMessage("Playlist Added successfully!","success");
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const updateListById = async(data,id)=>{
        const updateList = await axios({
            method: "PUT",
            url: `${host}/playlist/updateplaylist/${id}`,
            data: data,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });

        const json = updateList.data;

        if(json.success){
            showToastMessage("Playlist updated successfully!","success");
            getPlayLists();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const deleteListById = async(id)=>{
        const response = await fetch(`${host}/playlist/deleteplaylist/${id}`, {
            method: 'DELETE',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if(json.success){
            showToastMessage("Playlist removed successfully","success");
            getPlayLists();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }
    
    // videos section
    const getVideos = async()=>{
        const response = await fetch(`${host}/videos/getallvideos`, {
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

    const addNewVideo = async(data)=>{
        const saveVideo = await axios({
            method: "POST",
            url: `${host}/videos/addvideo`,
            data: data,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = saveVideo.data;
        if(json.success){
            showToastMessage("Video added successfully!","success");
            getVideos();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const updateVideoById = async(data,id)=>{
        const updateVideo = await axios({
            method: "PUT",
            url: `${host}/videos/updatevideo/${id}`,
            data: data,
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

    const deleteVideoById = async(id)=>{
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
            return true;
        }else{
            showToastMessage(json.error,"error")
            return false;
        }
    }

    // packages section
    const getPackages = async ()=>{
        const response = await fetch(`${host}/packages/getalls`, {
            method: 'GET'
        });
        const json = await response.json();
        if(json.success){
            setPackages(json.allPackages);
        }
    }

    const addNewPackage = async(data)=>{
        const addP = await axios({
            method: "POST",
            url: `${host}/packages/createpackage`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });

        const json = addP.data;
        if(json.success){
            getPackages();
            showToastMessage("Package added successfully!","success");
            return true;
        }else{
            showToastMessage(json.error,"error");
            return true;
        }
    }

    const updatePackageById = async(data,id)=>{
        const updatePackage = await axios({
            method: "PUT",
            url: `${host}/packages/updatepackage/${id}`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },                
        });

        const result = updatePackage.data;

        if(result.success){
            showToastMessage("Package Updated Successfully!", "success");
            getPackages();
            return true;
        }else{
            showToastMessage(result.error, "error");
            return false;
        }
    }

    const deletePackageById = async(id)=>{
        const response = await fetch(`${host}/packages/delete/${id}`, {
            method: 'DELETE',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        
        const json = await response.json();
        if(json.success){
            showToastMessage("Package removed successfully!","success")
            getPackages();
            return true;
        }else{
            showToastMessage(json.error,"error")
            return false;
        }
    }

    // navigation items section
    const getAllNavItems = async()=>{
        const saveItem = await axios({
            method: "GET",
            url: `${host}/navigation/get-active`,
        });
        let data = saveItem.data;
        if(data.success){
            setNavigationItems(data.items);
        }else{
            showToastMessage(data.error,"error");
        }
    }

    const addNewNavigationItem = async(data)=>{
        const saveItem = await axios({
            method: "POST",
            url: `${host}/navigation/add-nav-item`,
            data: data,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        });
        let result = saveItem.data;
        if(result.success){
            showToastMessage("Nav item added successfully!","success");
            getAllNavItems();
            return true;
        }else{
            showToastMessage(data.error,"error");
            return false;
        }
    }

    const updateNavItemById = async(data,id)=>{
        const updateItem = await axios({
            method: "PUT",
            url: `${host}/navigation/update-item/${id}`,
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        let dataJson = updateItem.data;
        if(dataJson.success){
            showToastMessage("Navigation item updated successfully!","success")
            getAllNavItems();
            return true;
        }else{
            showToastMessage(dataJson.error,"error")
            return false;
        }
    }

    const deleteNavItemById = async(id)=>{
        const saveItem = await axios({
            method: "post",
            url: `${host}/navigation/hide-item/${id}`,
        });
        let data = saveItem.data;
        if(data.success){
            showToastMessage("Navigation item removed!","success");
            getAllNavItems();
            return true;
        }else{
            showToastMessage(data.error,"error")
            return false;
        }
    }

    // comments section
    const getAllComments = async()=>{
        const getRes = await axios({
            method: 'GET',
            url: `${host}/comments/getall`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = getRes.data;
        if(json.success){
            setComments(json.comments);
        }else{
            showToastMessage("Failed to retrieve comments!","error")
        }
    }

    const addNewComment = async(data)=>{
        const addC = await axios({
            method: "post",
            url: `${host}/comments/postcomment`,
            data: data,
            headers: {
                "Content-Type" : "application/json",
                "auth-token": localStorage.getItem('token')
            },
        });

        const json = addC.data;
        if(json.success){
            showToastMessage("New comment posted!","success");
            getAllComments();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const deleteCommentById = async(id)=>{
        const delComment = await axios({
            method: 'DELETE',
            url: `${host}/comments/deletecomment/${id}`,
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = delComment.data;
        if(json.success){
            showToastMessage("Comment removed successfully!","success");
            getAllComments();
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    // replies section
    const [replies, setReplies] = useState([]);

    const getAllReplies = async ()=>{
        const response = await axios({
            method: "GET",
            url: `${host}/replies/getall`
        });
        
        const data = response.data;
        if(data.success){
            setReplies(data.repliesFiltered);
        }else{
            showToastMessage("Error getting replies!","error");
        }
    }

    const deleteReply = async (id)=>{
        const response = await fetch(`${host}/replies/delete/${id}`, {
            method: 'DELETE'
        });
        const json = await response.json();
        if(json.success){
            getAllReplies();
            showToastMessage("Reply deleted successfully!","success");
            return true;
        }else{
            showToastMessage(json.error,"error");
            return false;
        }
    }

    const addNewReply = async(data,id)=>{
        const addReply = await axios({
            method: 'POST',
            url: `${host}/replies/reply/${id}`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const replyJson = addReply.data;
        if(replyJson.success){
            getAllComments();
            showToastMessage("Reply posted successfully!","success");
            return true;
        }else{
            showToastMessage(replyJson.error,"error");
            return false;
        }
    }

    // admin home page
    const [payments, setPayments] = useState([]);

    const setPaymentsData = (data)=>{
        setPayments(data);
    }

    const getAllPayments = async()=>{
        const getAllPayments = await axios({
            method: "GET",
            url: `${host}/payments/get-all-payments`,
            headers: {
                "auth-token" : localStorage.getItem('token')
            }
        });
        let data = getAllPayments.data;
        if(data.success){
            setPayments(data.payments);
        }
    }

    // emails tab
    const [emails, setEmails] = useState([]);

    const getEmails = async ()=>{
        const contactUseMail = await axios({
            method: 'get',
            url: `${host}/emailservice/contact-mails`,
            headers: {
                "auth-token" : localStorage.getItem('token')
            }
        });
        
        const data = contactUseMail.data;
            
        if(data.success){
            setEmails(data.emails);
        }
    }

    const sendEmailReply = async (formData)=>{
        const emailReply = await axios({
            method: 'POST',
            url: `${host}/emailservice/reply-email`,
            data: formData,
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        }); 
        
        const data = emailReply.data;
        
        if(data.success){
            showToastMessage("Email reply has been sent!","success");
        }else{
            showToastMessage(data.error,"error");
        }
    }


    return <AdminContext.Provider value={{addUser, users, getUsers, editUserC, deleteUser, getUser, loggedInUser, getAllPayments, payments, 
            packages, getPackages, addNewPackage, updatePackageById, deletePackageById, 
            videos, getVideos, updateVideoById, deleteVideoById, addNewVideo,
            playLists, getPlayLists, addNewList, updateListById, deleteListById,
            coaches, getCoaches, imageHost,setPaymentsData,
            comments, getAllComments, addNewComment, deleteCommentById,
            replies, getAllReplies, deleteReply, addNewReply,
            categories, getcategories, editCategoryById, deleteCategoryById, addCategory,
            navigationItems, getAllNavItems, addNewNavigationItem, updateNavItemById, deleteNavItemById, showToastMessage,
            emails, getEmails, sendEmailReply
        }}>
        {props.children}
    </AdminContext.Provider>
}

export default AdminState;