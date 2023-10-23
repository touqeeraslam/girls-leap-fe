import { useState } from "react";
import clientContext from "./clientContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const host = "https://gl2.ithawks.pk/api";
// const host = "https://portal2.ithawks.pk/api";

// const host = "https://gl2.theitking.pk/api";
// const imageHost = "https://gl2.theitking.pk/";

const host = "http://localhost:5000/api";
const imageHost = "http://localhost:5000/";

// const imageHost = "https://gl2.ithawks.pk/";
// const imageHost = "https://portal2.ithawks.pk/";

const ClientState = (props) => {
  const [categories, setCategories] = useState([]);
  const [myList, setMyList] = useState([]);
  const [myContinueWatchingSection, setMyContinueWatchingSection] = useState(
    []
  );
  const [slides, setSlides] = useState([]);

  let navigate = useNavigate();

  // notifcation
  const showToastMessage = (message, type) => {
    toast(message, {
      type: type,
    });
  };

  // home page
  const getHomePageContent = async () => {
    const playlistinfo = await fetch(`${host}/categories/homepageleap`, {
      method: "GET",
    });
    const json = await playlistinfo.json();
    if (json.success) {
      setCategories(json.homePageContent);
    }
  };

  const getMyFavList = async () => {
    const response = await fetch(`${host}/mylist/getmylist`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setMyList(json.listItems);
    }
  };

  const getContinueSection = async () => {
    const response = await fetch(
      `${host}/continuesection/getmycontinuesection`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setMyContinueWatchingSection(json.filteredList);
    }
  };

  // home page hero section
  const getCarouselItems = async () => {
    const response = await fetch(`${host}/playlist/homepagelist`, {
      method: "GET",
    });
    const json = await response.json();
    if (json.success) {
      setSlides(json.playlists);
    }
  };

  // add to playlist
  const addToMyList = async (formData) => {
    const addToList = await axios({
      method: "POST",
      url: `${host}/mylist/addtolist`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = addToList.data;
    if (json.success) {
      showToastMessage("Added to My List!", "success");
      return true;
    } else {
      showToastMessage(json.error, "error");
      return false;
    }
  };

  // remove from playlist
  const removeFromMyList = async (id) => {
    const removeItem = await axios({
      method: "DELETE",
      url: `${host}/mylist/removeitem`,
      data: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = removeItem.data;
    if (json.success) {
      showToastMessage("Item removed from playlist", "success");
      return true;
    } else {
      showToastMessage(json.error, "error");
      return false;
    }
  };

  // playlist page
  const [playList, setPlayList] = useState(null);
  const [videosInPlaylist, setVideosInPlaylist] = useState([]);
  const [playListLocked, setPlayListLocked] = useState(false);
  const [playListViewCount, setPlayListViewCount] = useState(0);

  const getPlayList = async (slug) => {
    // playlist
    const response = await fetch(`${host}/playlist/getlist/${slug}`, {
      method: "GET",
    });
    const json = await response.json();
    if (json.success) {
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
    let checkAvailability = await axios({
      method: "GET",
      url: `${host}/playlist/check-availability/${slug}`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    setPlayListLocked(checkAvailability.data.success);
  };

  // category page
  const [category, setCategory] = useState(null);
  const [playListInCategory, setPlayListInCategory] = useState([]);

  const getCategory = async (slug) => {
    const getCat = await axios({
      method: "GET",
      url: `${host}/categories/getcategory/${slug}`,
    });

    const json = getCat.data;
    if (json.success) {
      setCategory(json.category);
      setPlayListInCategory(json.category.playlists);
    }
  };

  // video page
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [nextVideo, setNextVideo] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const checkAvailability = async (slug) => {
    const check = await axios({
      method: "GET",
      url: `${host}/videos/check-availability/${slug}`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const data = check.data;
    return data.success;
  };

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
      method: "get",
      url: `${host}/videos/getvideo/${slug}`,
    });

    const json = getVideoBySlug.data;

    if (json.success) {
      // remove the current video from the next videos
      json.video.playlist.videos = json.video.playlist.videos.filter((vid) => {
        return vid.slug !== slug;
      });

      setVideo(json.video);

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

  const addNewReply = async (message, id) => {
    if (message.length === 0) {
      showToastMessage("Empty message content!", "warning");
      return false;
    }

    const response = await fetch(`${host}/replies/reply/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: message,
      }),
    });
    const replyJson = await response.json();

    if (replyJson.success) {
      // append the reply to the comment by ID
      showToastMessage("Reply Posted Successfully!", "success");
      return replyJson.reply;
    } else {
      showToastMessage(replyJson.error, "error");
      return null;
    }
  };

  const handleVideoProgress = async (data, id) => {
    const updateVideoProgress = await axios({
      method: "PUT",
      url: `${host}/continuesection/update-progress/${id}`,
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

  const updateViewCount = async (slug) => {
    if (!localStorage.getItem("token")) {
      return;
    }
    await axios({
      method: "POST",
      url: `${host}/videos/update-view-count/${slug}`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
  };

  // profile page
  const [myProfileInformation, setMyProfileInformation] = useState(null);
  const [mySubscription, setMySubscription] = useState("");

  const getProfileData = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    // get profile information
    const getMyInfo = await axios({
      method: "POST",
      url: `${host}/auth/getuser`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = getMyInfo.data;
    if (json.success) {
      setMyProfileInformation(json.user);
    } else {
      navigate("/");
    }
  };

  const mySubscriptionInformation = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    let getSub = await axios({
      method: "GET",
      url: `${host}/auth/getSubscription`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let subData = getSub.data;
    if (subData.success) {
      setMySubscription(subData.type);
    } else {
      if (localStorage.getItem("token")) {
        showToastMessage("Failed to retrieve subscription!", "error");
      }
    }
  };

  const cancelSub = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    const cancelSubs = await axios({
      method: "POST",
      url: `${host}/subscription/cancel-subscription`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let res = cancelSubs.data;
    if (res.success) {
      showToastMessage(res.message, "success");
    }
  };

  const updateProfile = async (formData) => {
    const updateProf = await axios({
      method: "PUT",
      url: `${host}/users/updateprofile`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "auth-token": localStorage.getItem("token"),
      },
    });
    let result = updateProf.data;
    if (result.success) {
      setMyProfileInformation(result.updatedUser);
      showToastMessage(result.message, "success");
      return true;
    } else {
      showToastMessage(result.message, "error");
      return false;
    }
  };

  // notification section - profile page
  const [myNotificationState, setMyNotificationState] = useState({
    comment_reply: false,
    new_video: false,
    disable_all: true,
  });

  const onChangeNotification = (name, value) => {
    if (name === "disable_all") {
      if (value === true) {
        setMyNotificationState({
          comment_reply: false,
          new_video: false,
          disable_all: true,
        });
      } else {
        setMyNotificationState({
          comment_reply: true,
          new_video: true,
          disable_all: false,
        });
      }
    } else if (name === "comment_reply") {
      if (value === true) {
        setMyNotificationState({
          ...myNotificationState,
          comment_reply: true,
          disable_all: false,
        });
      } else {
        setMyNotificationState({
          ...myNotificationState,
          comment_reply: false,
        });
      }
    } else if (name === "new_video") {
      if (value === true) {
        setMyNotificationState({
          ...myNotificationState,
          new_video: true,
          disable_all: false,
        });
      } else {
        setMyNotificationState({
          ...myNotificationState,
          new_video: false,
        });
      }
    }
  };

  const getNotifications = async () => {
    const getNotificationInfo = await axios({
      method: "GET",
      url: `${host}/notifications/email-notifications`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let result = getNotificationInfo.data;
    if (result.success) {
      setMyNotificationState({
        comment_reply: result.notification.comment_reply_notifaction,
        new_video: result.notification.new_video_notification,
        disable_all: result.notification.disable_all,
      });
    }
  };

  const updateNotification = async () => {
    const data = new FormData();
    data.append("comment_reply", myNotificationState.comment_reply);
    data.append("new_video", myNotificationState.new_video);
    data.append("disable_all", myNotificationState.disable_all);

    const updateNotify = await axios({
      method: "PUT",
      data: data,
      url: `${host}/notifications/update-notification`,
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    let result = updateNotify.data;

    if (result.success) {
      showToastMessage(result.message, "success");
    } else {
      showToastMessage(result.message, "error");
    }
  };

  const updateName = (name) => {
    setMyProfileInformation({ ...myProfileInformation, name: name });
  };

  // my list page
  const [myListItems, setMyListItems] = useState([]);

  const getMyListItems = async () => {
    const getList = await axios({
      method: "GET",
      url: `${host}/mylist/getmylist`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = getList.data;
    if (json.success) {
      setMyListItems(json.listItems);
    }
  };

  // pricing page
  const [packages, setPackages] = useState([]);

  const getPackages = async () => {
    const response = await fetch(`${host}/packages/getall/`, {
      method: "GET",
    });
    const json = await response.json();
    if (json.success) {
      setPackages(json.allPackages);
    } else {
      showToastMessage("Failed to retrieve pricing details!", "error");
    }
  };

  // payment checkout page
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentCard, setDefaultPaymentCard] = useState("new");

  const changePaymentMethod = async (value) => {
    setDefaultPaymentCard(value);
  };

  const getPackageById = async (id) => {
    const getPackage = await axios({
      method: "GET",
      url: `${host}/packages/get-package/${id}`,
    });
    const data = getPackage.data;
    if (data.success) {
      setSelectedPackage(data.package);
    } else {
      showToastMessage(data.error, "error");
    }
  };

  const getUserCards = async () => {
    const cCards = await axios({
      method: "GET",
      url: `${host}/subscription/get-cards`,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });

    let result = cCards.data;
    if (result.success) {
      setPaymentMethods(result.cards);
      if (result.cards.length > 0) {
        const defaultCard = result.cards.filter((card) => {
          return card.default_method === true ? card._id : "new";
        });
        setDefaultPaymentCard(defaultCard[0]._id);
      } else {
        setDefaultPaymentCard("new");
      }
    } else {
      showToastMessage(result.error, "error");
    }
  };

  const confirmSubscription = async (card, expiry, cvc, method, package_id) => {
    const subConfirm = await axios({
      method: "POST",
      url: `${host}/subscription/subscribe/${package_id}`,
      data: JSON.stringify({
        card_number: card,
        card_expiry: expiry,
        card_cvc: cvc,
        paymentMethod: method,
      }),
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    let result = subConfirm.data;
    if (result.success) {
      showToastMessage(result.message, "success");
      return true;
    } else {
      showToastMessage(result.message, "error");
      return false;
    }
  };

  const confirmSubscriptionWithOldCard = async (package_id) => {
    const subConfirm = await axios({
      method: "POST",
      url: `${host}/subscription/subscribe/${package_id}`,
      data: JSON.stringify({
        defaultPaymentID: defaultPaymentCard,
      }),
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    let result = subConfirm.data;
    if (result.success) {
      showToastMessage(result.message, "success");
      return true;
    } else {
      showToastMessage(result.message, "error");
      return false;
    }
  };

  // navbar section
  const [navBarItems, setNavBarItems] = useState([
    { name: "BROWSE", href: "/", type: "page" },
  ]);
  const [user, setUser] = useState(null);

  const getNavItem = async () => {
    const saveItem = await axios({
      method: "GET",
      url: `${host}/navigation/get-active`,
    });
    let data = saveItem.data;
    if (data.success) {
      var i = 0;
      let newMenu = [{ name: "BROWSE", href: "/", type: "page" }];
      for (i = 0; i < data.items.length; i++) {
        newMenu.push({
          name: data.items[i].title,
          href: data.items[i].url,
          type: data.items[i].type,
        });
      }
      setNavBarItems(newMenu);
    }
  };

  const getUserLoggedIn = async () => {
    const response = await fetch(`${host}/auth/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      setUser(json.user);
    }
  };

  // coach page
  const [coach, setCoach] = useState(null);
  const [coachPlaylists, setCoachPlaylists] = useState([]);

  const getCoach = async () => {
    const getCoach = await axios({
      method: "GET",
      url: ``,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let response = getCoach.data;
    if (response.success) {
      setCoach(response.coach);
    } else {
      navigate("/");
    }
  };

  const getCoachLists = async () => {
    const getCoach = await axios({
      method: "GET",
      url: ``,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let response = getCoach.data;
    if (response.success) {
      setCoachPlaylists(response.playlists);
    } else {
      navigate("/");
    }
  };

  // utility
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  // video package
  const [videoPackage, setVideoPackage] = useState(null);

  const getVideoPackage = async (slug) => {
    const getVideoPackageBySlug = await axios({
      method: "get",
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

  // contact page
  const sendContactMail = async (formData) => {
    const contactUseMail = await axios({
      method: "post",
      url: `${host}/emailservice/contact-us`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = contactUseMail.data;

    if (data.success) {
      showToastMessage("Your message has been recieved!", "success");
      return true;
    } else {
      showToastMessage(data.error, "error");
      return false;
    }
  };

  return (
    <clientContext.Provider
      value={{
        categories,
        changePaymentMethod,
        getHomePageContent,
        myList,
        getMyFavList,
        myContinueWatchingSection,
        getContinueSection,
        slides,
        getCarouselItems,
        addToMyList,
        removeFromMyList,
        playList,
        videosInPlaylist,
        getPlayList,
        getProfileData,
        myProfileInformation,
        mySubscription,
        mySubscriptionInformation,
        video,
        loggedInUser,
        getLoggedInUser,
        getVideo,
        nextVideo,
        postComment,
        addNewReply,
        handleVideoProgress,
        userLoggedIn,
        updateViewCount,
        category,
        getCategory,
        playListInCategory,
        checkAvailability,
        getMyListItems,
        myListItems,
        playListLocked,
        defaultPaymentCard,
        timeout,
        packages,
        getPackages,
        confirmSubscriptionWithOldCard,
        playListViewCount,
        selectedPackage,
        getPackageById,
        paymentMethods,
        getUserCards,
        confirmSubscription,
        cancelSub,
        getNotifications,
        updateNotification,
        myNotificationState,
        updateProfile,
        imageHost,
        host,
        updateName,
        showToastMessage,
        onChangeNotification,
        getNavItem,
        navBarItems,
        user,
        getUserLoggedIn,
        getCoach,
        coach,
        coachPlaylists,
        getCoachLists,
        getVideoPackage,
        videoPackage,
        sendContactMail,
      }}
    >
      {props.children}
    </clientContext.Provider>
  );
};

export default ClientState;
