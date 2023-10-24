import React, { useState } from "react";
import EmployeeContext from "./employeeContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
const EmployeeState = (props) => {
  let navigate = useNavigate();
  const host = "http://localhost:5000/api";

  const imageHost = "http://localhost:5000/";
  const [loggedInUser, setLoggedInUser] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [video, setVideo] = useState([])
  const [categories, setCategories] = useState([])
  const [playList, setPlayList] = useState(null);
  const [videosInPlaylist, setVideosInPlaylist] = useState([]);
  const [playListViewCount, setPlayListViewCount] = useState(0);
  const [videoPackage, setVideoPackage] = useState(null);
  const [nextVideo, setNextVideo] = useState(null);



  const getLoggedInUser = async () => {
    const response = await fetch(`${host}/auth/getuser`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setLoggedInUser(json.user);
      setUserLoggedIn(true);
      return true;
    } else {
      return false;
    }
  };

  const getVideo = async (slug) => {
    const getVideoBySlug = await axios({
      method: "GET",
      url: `${host}/videos/getvideo/${slug}`,
    });
    // console.log("slug",slug)

    const json = getVideoBySlug.data;

    if (json.success) {
      // remove the current video from the next videos
      json.video.playlist.videos = json.video.playlist.videos.filter((vid) => {
        return vid.slug !== slug;
      });

      setVideo(json.video);
      // console.log("json.video",json.video)

      if (json.video.playlist.videos.length > 0) {
        setNextVideo(json.video.playlist.videos[0]);
      } else {
        setNextVideo(null);
      }
      if (localStorage.getItem("token")) {
        const formData = new FormData();
        formData.append("videoId", json.video._id);
        const addToMyList = await axios({
          method: "post",
          url: `${host}/continuesection/add-to-continue-section`,
          data: formData,
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
        const jsonContinue = addToMyList.data;
        if (jsonContinue.success === false) {
          showToastMessage("Error adding to Watch Section", "error");
        }
      } else {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };

  const getMyCategories = async () => {
    const response = await axios({
      method: "GET",
      url: `${host}/organization/employee/mycategories`,
      headers: {
        "auth-token": localStorage.getItem("token")
      }
    });
    const json = response.data;
    if (json.success) {
      setCategories(json.categories)
      return true;
    } else {
      return false;
    }
  };

  const getPlayList = async (slug) => {
    // playlist
    const response = await fetch(`${host}/playlist/getlist/${slug}`, {
      method: "GET",
    });
    const json = await response.json();
    if (json.success) {
      // console.log('playList', json)
      setPlayList(json.playlist);
      setVideosInPlaylist(json.playlist.videos);
      // iterate from videos to count views
      if (json.playlist.videos.length > 0) {
        const total = json.playlist.videos.reduce(
          (accumulator, video) => accumulator + video.views,
          0
        );
        setPlayListViewCount(total);
      }
    }
    // availability

  };

  const getVideoPackage = async (slug) => {
    const getVideoPackageBySlug = await axios({
      method: "GET",
      url: `${host}/videos/get-package/${slug}`,
    });

    const data = getVideoPackageBySlug.data;
    if (data.success) {
      setVideoPackage(data.packageModel);
    } else {
      if (data.status === 404) {
        navigate("/page-not-found-404");
      }
    }
  };
  
  const updateViewCount = async (slug) => {
    if (!localStorage.getItem("token")) {
      return;
    }
    await axios({
      method: "POST",
      url: `${host}/videos/employee/update-view-count/${slug}`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
  };

  const handleVideoProgress = async (data, id) => {
    // console.log(data,id)
    const updateVideoProgress = await axios({
      method: "PUT",
      url: `${host}/continuesection/update-progress/employee/${id}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const resData = updateVideoProgress.data;
    if (resData.success) {
      return true;
    }
  };

  const postComment = async (message, id) => {
    const postComment = await fetch(`${host}/comments/postcomment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        comment: message,
        video: id,
      }),
    });
    const json = await postComment.json();
    if (json.success) {
      showToastMessage("New Comment Posted", "success");
      video.comments.push(json.newComment);
      return true;
    } else {
      showToastMessage(json.error, "error");
      return false;
    }
  };

  const showToastMessage = (message, type) => {
    toast(message, {
      type: type
    });
  };
  return (
    <>
      <EmployeeContext.Provider value={{ loggedInUser,host,  imageHost, showToastMessage, getVideo, video, getMyCategories, categories, playList, getPlayList, videosInPlaylist, playListViewCount ,getVideoPackage , getLoggedInUser,userLoggedIn, videoPackage, nextVideo,updateViewCount, handleVideoProgress, postComment}}>
        {props.children}
      </EmployeeContext.Provider>

    </>
  )
}

export default EmployeeState;