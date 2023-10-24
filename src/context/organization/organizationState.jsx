import React, { useState } from "react";
import OrganizationContext from "./organizationContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
const OrganizationState = (props) => {
    let navigate = useNavigate();
    const host = "http://localhost:5000/api";

    const imageHost = "http://localhost:5000/";
    const [loggedInUser, setLoggedInUser] = useState();
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [progressInfo, setProgressInfo] = useState([])
    const [updatedEmployee, setUpdatedEmployee] = useState([])
    const [categories,setCategories] = useState([])
    const [playLists,setPlayLists] = useState([])
    const getUser = async () => {
        if (!localStorage.getItem('token')) {
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
        // console.log(json)
        if (json.user.role === "Org") {
            setLoggedInUser(json.user);
        }
        else {
            navigate('/');
        }
    }
    const getPackageForOrganization = async () => {
        const response = await fetch(`${host}/packages/get/org`, {
            method: 'GET'
        });
        const json = await response.json();
        if (json.success) {
            setPackages(json.package);
            // console.log(json.package)
            return json.package;
        } else {
            showToastMessage("Error retrieving packages!", "warning");
            return null;
        }

    }

    //Employees Section 
    const getUsers = async () => {
        // fetch all employee here
        const response = await fetch(`${host}/organization/get-employees`, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if (json.success) {
            setUsers(json.users);
        }
    }


    // Add A Employee
    const addUser = async (user) => {
        const saveUser = await axios({
            method: "POST",
            url: `${host}/organization/add-employee`,
            data: user,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = saveUser.data;
        console.log(json)
        if (json.success) {
            showToastMessage("Employee Added successfully!", "success");
            await getUsers();
            return true;
        } else {
            showToastMessage(json.error, "error")
            return false;
        }
    }

    //Update Employee
    const editUserC = async (editUser, id) => {
        const updateUser = await axios({
            method: "PATCH",
            url: `${host}/organization/update-employee/${id}`,
            data: editUser,
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "multipart/form-data"
            }
        });
        const json = updateUser.data;
        if (json.success) {
            showToastMessage("User updated Successfully!", "success");
            await getUsers();
        } else {
            showToastMessage(json.error, "error");
        }
    }


    const deleteUser = async (id) => {
        const response = await fetch(`${host}/organization/delete-employee/${id}`, {
            method: 'DELETE',
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        if (json.success) {
            await getUsers();
            showToastMessage("User deleted successfully!", "success");
        }
    }

   





    //Get All Categories By Organization ID
    const getAllCategories = async()=> {
        const response = await axios({
            url: `${host}/organization/all-categories`,
            method: "GET",
            headers:{
                "auth-token":localStorage.getItem("token")
            }
        })
        const json = await response.data;
        if (json.success) {
            // console.log("json",json)
            setCategories(json.categories);
        }
        else {
            showToastMessage(json.error, "error")
        }
    }

    //Assign Categories to employees
    const handleCategoryAdd = async (id, categories) => {
        const req = await axios({
            url: `${host}/organization/assign-category`,
            method: "POST",
            data: {
                id: id,
                categories: categories
            },
            headers: {
                "auth-token": localStorage.getItem("token")
            }
        })
        const json = req.data;
        if (json.success) {
            showToastMessage(json.message, "success")
            await getUsers()
            return true;
        }
        else {
            showToastMessage(json.error, "error")
            return false;
        }


    }
    //Get Categories Which are not assigned to user
    const getNotAssignedCategories = async (UserID) => {
        const req = await axios({
            url: `${host}/organization/categories`,
            method: "POST",
            data: { id: UserID },
            headers: {
                "auth-token": localStorage.getItem("token")
            }
        })
        const json = req.data;
        if (json.error) {
            showToastMessage(json.error, "error")
        } else {
            setCategories(json.categories)
            return true;
        }
        return true;
    }
    const handeleAssignRemoveCategory = async (UserID, VideoID) => {
        const req = await axios({
            url: `${host}/organization/remove-category`,
            method: "POST",
            data: { userId: UserID, categoryId: VideoID },
            headers: {
                "auth-token": localStorage.getItem("token")
            }
        })
        const json = req.data;
        if (json.success) {
            showToastMessage(json.message, "Success")
            setUpdatedEmployee(json.user)
            await getUsers()
            return true;
        } else {
            showToastMessage(json.error, "error")
        }
    }


    //Progress Report of Employee
    const getVideosProgress = async(userID) => {
        console.log(userID)
        const res = await axios({
          method:"POST",
          url:`${host}/organization/employee/progress-info`,
          data:{userID},
          headers:{
            "auth-token":localStorage.getItem("token")
          }
        })
        const json = res.data;
        console.log(json)
        if(json.success){
            setProgressInfo(json.progressInfo)
        }

    }

    const getPlayLists = async( ) => {
        const res = await axios({
            url:`${host}/organization/playlists`,
            method:"GET",
            headers:{
                "auth-token":localStorage.getItem("token")
            }
        })
        const json = res.data;
        if(json.success){
            console.log(json)
            setPlayLists(json.playlists)
        }
    }
    const showToastMessage = (message, type) => {
        toast(message, {
            type: type
        });
    };
    return (
        <>
            <OrganizationContext.Provider value={{ loggedInUser, getUser, imageHost, getUsers, getPackageForOrganization, users, addUser, showToastMessage, packages, handleCategoryAdd, editUserC, deleteUser, handeleAssignRemoveCategory, updatedEmployee, getNotAssignedCategories , getAllCategories,categories,getVideosProgress,progressInfo,getPlayLists,playLists}}>
                {props.children}
            </OrganizationContext.Provider>

        </>
    )
}

export default OrganizationState;