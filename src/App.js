import './App.css';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from './components/Authentication/Login';
import { Fragment } from 'react';
import ClientHome from './components/Home/HomePage/ClientHome';
import HomePage from './components/Admin/HomePage';
import UsersTab from './components/Admin/UsersTab';
import HomePageCoach from './components/Coach/HomePageCoach';
import MyVideos from './components/Coach/MyVideos';
import Categories from './components/Admin/Categories';
import Videos from './components/Admin/Videos';
import PlayList from './components/Admin/PlayList';
import PlayListPage from './components/Home/Playlist/PlayListPage';
import ViewVideo from './components/Home/Video/VideoView';
import Main from './components/Home/Main';
import HomeAdmin from './components/Admin/HomeAdmin';
import Home from "./components/Coach/Home";
import ScrollToTop from './components/Home/Scrolltotop';
import MyPlaylists from './components/Coach/MyPlaylists';
import Comments from './components/Admin/Comments';
import SignupForm from './components/Authentication/SignupForm';
import Packages from './components/Admin/Packages';
import CategoryPage from './components/Home/Playlist/CategoryPage';
import MyList from './components/Home/Playlist/MyList';
import CoachComments from './components/Coach/Comments';
import EmailVerification from './components/Authentication/EmailVerification';
import Navbar from './components/Admin/Navbar';
import PageNotFound from './components/PageNotFound';
import ContinueVideo from './components/Home/Video/ContinueVideo';
import Replies from './components/Admin/Replies';
import MyReplies from './components/Coach/Replies';
import ProfilePage from './components/Home/ProfilePage/ProfilePage';
import PaymentForm from './components/Home/PaymentPage/PaymentForm';
import Checkout from './components/Home/PaymentPage/Checkout';
import AuthHome from './components/Authentication/Auth';
import ResetPassword from './components/Home/Extras/ResetPassword';
import FAQ from './components/Home/Extras/FAQ';
import Trailer from './components/Home/Video/FreeTrailer';
import ContactUs from './components/Home/HomePage/ContactUs';
import EmailsTab from './components/Admin/Emails';
import HomeOrganization from './components/Organization/HomeOrganization';
import HomePageOrganization from './components/Organization/HomePage';
import UsersTabOrganization from './components/Organization/UsersTab';
import MyCategories from './components/Organization/MyCategories'
import AssignVideosOrganization from './components/Organization/ManageVideos';
import HomeEmployee from './components/Employee/HomeEmployee';
import HomePageEmployee from './components/Employee/HomePage';
import ViewVideoEmployee from './components/Employee/VideoView';
import PlayListPageEmployee from './components/Employee/PlayListPage'
function App() {
  return (
    <>
      {/* a context API on top that will be wrapper around the whole application */}
      <Router>
        <ScrollToTop/>    
        <Fragment>
          <Switch>
            <Route exact path="/" element={<Main/>}>
              <Route index element={<ClientHome/>}/>
              <Route path="/my-list" element={<MyList/>}/>
              <Route path="/playlist/:playlistname" element={<PlayListPage/>}/>
              <Route path="/category/:categoryname" element={<CategoryPage/>}/>
              <Route path=":playlistname/videos/:videoname" element={<ViewVideo/>}/>
              <Route path="/video/:videoname" element={<ContinueVideo/>}/>
              <Route path="/trailer/:videoname" element={<Trailer/>}/>
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="/pricing" element={<PaymentForm/>}/>
              <Route path="/checkout/:package_id" element={<Checkout/>}/>
              <Route path="/faq" element={<FAQ/>}/>
              <Route path='/contact-us' element={<ContactUs />}/>
            </Route>
            

            <Route exact path="/auth" element={<AuthHome/>}>
              <Route index path="login" element={<Login/>}/>
              <Route path="signup/:package?" element={<SignupForm/>}/>
              <Route path="users/:id/verify/:token" element={<EmailVerification/>}/>
              <Route path="reset-password" element={<ResetPassword/>}/>
            </Route>

            <Route path="/admin" element={<HomeAdmin/>}>
              <Route index element={<HomePage/>} />
              <Route exact path="users" element={<UsersTab/>} />
              <Route exact path="categories" element={<Categories/>} />
              <Route exact path="videos" element={<Videos/>} />
              <Route exact path="playlist" element={<PlayList/>} />
              <Route exact path="comments" element={<Comments/>} />
              <Route exact path="packages" element={<Packages/>} />
              <Route exact path="navigation-items" element={<Navbar/>} />
              <Route exact path="comment-replies" element={<Replies/>} />
              <Route exact path="emails" element={<EmailsTab/>} />
            </Route>
            
            <Route path="/coach" element={<Home/>}>
              <Route index element={<HomePageCoach/>} />
              <Route exact path="myvideos"  element={<MyVideos/>}/>
              <Route exact path="myplaylists"  element={<MyPlaylists/>}/>
              <Route exact path="comments"  element={<CoachComments/>}/>
              <Route exact path="replies"  element={<MyReplies/>}/>
            </Route>

            <Route  path='/organization' element={<HomeOrganization />}>
              <Route index element={<HomePageOrganization />}></Route>
              <Route path='users' element={<UsersTabOrganization />}></Route>
              <Route path='my-categories' element={<MyCategories />}></Route>
              <Route path='assign-categories' element={<AssignVideosOrganization />}></Route>
            </Route>

            <Route path='/employee' element={<HomeEmployee />}>
              <Route index element={<HomePageEmployee />}></Route>
              <Route path="playlist/:playlistname" element={<PlayListPageEmployee/>}/>
              <Route path="playlist/videos/:videoname" element={<ViewVideoEmployee/>}/>
            </Route>
            
            <Route path='*' element={<PageNotFound />}/>

          </Switch>
        </Fragment>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />
      </Router>
    </>
  );
}

export default App;
