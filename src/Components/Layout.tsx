/* eslint-disable @typescript-eslint/no-explicit-any */

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

import { useWebSocketContext } from "./Websocket";
// import { FaBell, FaRegIdCard, FaRegMessage } from "react-icons/fa6";
// import { IoLogoGameControllerB } from "react-icons/io";

import "./CSS/notification.css";
import axios from "axios";
import Cookies from "js-cookie";
// import { CiLogin, CiLogout } from "react-icons/ci";
import Login from "./Login";
import Signup from "./Signup";
import { jwtDecode } from "jwt-decode";
import Reservation from "./PoolMemo/Reservation";
import ResultBoxMemo from "./LayoutMemo/ResultBoxMemo";
// import NotificationsBoxItemsMemo from "./LayoutMemo/NotificationsBoxItemsMemo";
import InvitationAcceptMemo from "./LayoutMemo/InvitationAcceptMemo";
import { useAppDispatch, useAppSelector } from "../ReduxStore/ReduxHooks";
import { setUnReadMatchup, unReadMatchupIncrement } from "../ReduxStore/features/unReadMatchups";
import { setUserLogIn } from "../ReduxStore/features/userLogIn";
import { Message } from "../type";
import UploadRating from "./PoolMemo/UploadRating";
import { setCurrentUser } from "../ReduxStore/features/currentUser";
import AllReviews from "./PoolMemo/AllReviews";
import LayoutHeader from "./LayoutMemo/LayoutHeader";
import LoadingPage from "./LoadingPage";
import UserSettings from "./UsersMemo/UserSettings";
import LoginForgetPassword from "./LoginForgetPassword/LoginForgetPassword";

const NotificationsBoxItemsMemo = lazy(() => import("./LayoutMemo/NotificationsBoxItemsMemo"));









function Layout(props: {
  search: string;
  setSearch: (search: string) => void;
  usersSearch: string;
  setUsersSearch: (usersSearch: string) => void;
  setLogOut: any;
  logOut: boolean;
  acceptInvitation: number;
  setAcceptInvitation: (acceptInvatation: number) => void;
}) {
  const { sendJsonMessage, lastJsonMessage, subscribe } =
    useWebSocketContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Message[]>();
  const [unReadNotifications, setUnReadNotifications] = useState<number>(0);
  

  const [loginBox, setLoginBox] = useState<boolean>(false);
  const [signUpBox, setSignUpBox] = useState<boolean>(false);

  const [resize,setResize] = useState<boolean>(false)



  const [openResultBox, setOpenResultBox] = useState<boolean>(false);
  const yourPointsInput = useRef<HTMLInputElement | null>(null);
  const [yourPoints, setYourPoints] = useState<number>(0);
  const opponentsPointsInput = useRef<HTMLInputElement | null>(null);
  const [opponentsPoints, setOpponentsPoints] = useState<number>(0);

  const reservationBox = useAppSelector((state) => state.reservationBox);
  const userLogIn = useAppSelector((state) => state.userLogIn);
  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const allReviewsBox = useAppSelector((state) => state.allReviewsBox);
  const uploadRatingBox = useAppSelector((state) => state.uploadRatingBox);
  const dispatch = useAppDispatch();

  const timeAgo = useCallback((timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();

    const minutes = Math.floor(diffInMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  }, []);

  const messageContent = useCallback((body: string): string => {
    return body?.length > 22 ? `${body.slice(0, 22)}...` : body;
  }, []);

  // Was 3 useState values (contentW/contentH/headerHeight) set imperatively by a callback that
  // got invoked from 3 separate effects (on mount, on window resize via the `resize` toggle
  // below, and on route change) - same computation, same inputs, same 3 triggers, just expressed
  // as a value derived during render instead of state pushed in from outside. `resize` still
  // exists as the plain toggle it always was; it's just a useMemo dependency now instead of a
  // useEffect dependency, so window.innerWidth/innerHeight get re-read exactly when they used to.
  const layoutDimensions = useMemo(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isSpecialPage =
      location.pathname.includes("users") ||
      location.pathname === "/messenger" ||
      location.pathname.includes("Pools") ||
      location.pathname === "/matchmake";

    const contentW =
      viewportWidth >= 1024 && !isSpecialPage
        ? `${viewportWidth - 191}px`
        : "100%";

    let contentH: string;
    if (viewportWidth < 768) {
      contentH = `${viewportHeight - 77}px`;
    } else if (viewportWidth < 1024) {
      contentH = `${viewportHeight - 140}px`;
    } else {
      contentH = `${viewportHeight - 24}px`;
    }

    // `${window.innerHeight - 137}px`;
    const headerHeight =
      isSpecialPage || viewportWidth < 1024 ? 100 : window.innerHeight - 65;

    return { contentW, contentH, headerHeight };
  }, [location.pathname, resize]);

  


  

  const goProfile = (e: any, id: number) => {
    setNotificationsOpen(false);
    e.stopPropagation();
    id && navigate(`/users/${id}`);
  };

 

  const isTokenExpired = (token:string) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if(decoded.exp){ // Current time in seconds
        return decoded.exp > currentTime
        }
        return false // Check if the token is expired
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat as expired if decoding fails
    }
};

  useEffect(() => {
    // divSize();
    // headerResize()
    const token = Cookies.get("token");
    // console.log(token);
    
    if (token && token != "logout" && isTokenExpired(token)) {
      dispatch(setUserLogIn(true));

      const FetchCurrentUser = async () => {
        try {
          if (token && token != "logout") {
            const currentUserResponse = await axios.get(
              // "https://strikem.site/users/current-user",
              "http://localhost:5100/users/current-user",
              {
                headers: { Authorization: `JWT ${token}` },
              }
            );
            dispatch(setCurrentUser(currentUserResponse.data));
          }
        } catch (err) {
          console.error(err);
        }
      };

      const FetchUnreadNotifications = async () => {
        try {
          const [unreadMatchUps,unreadNotifications] = await Promise.all([
            // axios.get("https://strikem.site/api/unread-matchups/",
            axios.get("http://localhost:5100/api/unread-matchups/",
              {
                headers: { Authorization: `JWT ${token}` },
              }
            ),
            // axios.get("https://strikem.site/api/unread-notifications/",
            axios.get("http://localhost:5100/api/unread-notifications/",
              {
                headers: { Authorization: `JWT ${token}` },
              }
            )
          ])
          // console.log(unreadNotifications.data.unread);
          // console.log(unreadMatchUps.data.unread);


          setUnReadNotifications(unreadNotifications.data.unread);
          // setUnReadMatchUps(unreadMatchUps.data.unread);
          dispatch(setUnReadMatchup(unreadMatchUps.data.unread))
        } catch (err) {
          console.error(err);
        }
      };

      FetchCurrentUser();
      FetchUnreadNotifications();
    }
    window.addEventListener("resize", () => {
      setResize((i)=>!i)
    });
  }, []);

  useEffect(() => {
    if (location.pathname.includes("Pool")) {
      // location.state is only set when navigating in-app via <Link>/navigate(url, {state}) - a
      // direct URL load or a refresh on a Pool page has no state at all, and reading .slug off
      // null crashed the whole app (this is what was happening - not anything to do with the pool
      // table map itself). Pool.tsx's own mount effect re-fetches the poolhouse fresh from the API
      // in that case; skip this WS init message rather than crash when state isn't there yet.
      if (location.state?.slug) {
        sendJsonMessage({
          protocol: "initial",
          action: "poolhouse",
          poolhouseName: location.state.slug,
        });
      }
    } else if (location.pathname === "/messenger") {
      sendJsonMessage({
        protocol: "initial",
        action: "matchup",
      });
    } else if (location.pathname === "/matchmake") {
      sendJsonMessage({
        protocol: "initial",
        action: "matchmake",
      });
    } else {
      sendJsonMessage({
        protocol: "initial",
        action: "base",
      });
    }
  }, [location.pathname, sendJsonMessage]);
  
  
  // const ResultBox = () => {
    
  //   const timer = setInterval(() => {
      
  //     setOpenResultBox((prev:number):number => {
  //       const nextValue = Math.min(prev + 0.1, 100);
  //       const roundedValue = Math.round(nextValue * 10) / 10; 
  //       if (roundedValue === 100) {
  //         clearInterval(timer);
  //       }else if(prev == -1){
  //         clearInterval(timer);
  //         return 0
  //       }        
  //       return roundedValue;
  //     });
  //   }, 10);
    
  //   setTimeout(() => {
  //     clearInterval(timer);
  //     setOpenResultBox(0)
  //   }, 10000);
    
  // };
  
  useEffect(() => {
    const unsubscribe = subscribe((data: any) => {
      if(data?.protocol == "now_free") {
        localStorage.setItem("sessionId", data.game_session_id);
        setOpenResultBox(true);
      }
      if(data?.update_message_count) {
        dispatch(unReadMatchupIncrement());
        // setUnReadMatchUps((prev:number):number => prev + 1);
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const AllRead = async () => {
    const token = Cookies.get("token");
    try {
      await axios.put(
        // "https://strikem.site/api/mark-all-read/",
        "http://localhost:5100/api/mark-all-read/",
        {},
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      
    } catch (err) {
      console.error(err);
    }
  }

    const handleAllRead = ()=>{
      AllRead()
    }

  const notificationsList = useMemo(() => {

    if (!notificationsOpen) return null;

    

    return(
      <div
          className={` overflow-hidden absolute top-[80px] md:top-[110px] p-[16px] pt-[24px] right-[50px] md:right-[100px] ${
            location.pathname == "/messenger" ||
            location.pathname.includes("users") || 
            location.pathname.includes("Pools")
              ? " lg:top-[150px] lg:right-[150px]"
              : " lg:top-[70px] lg:left-[150px]"
          } w-[260px] md:w-[340px] h-[260px] md:h-[380px] bg-[#10141E] border-[1px] border-[#243257d5] rounded-[20px] z-[80] transform transition-all duration-500 ease-in-out delay-200 ${
            notificationsOpen ? "opacity-100 " : "opacity-0 "
          }`}
        >
          <p className="text-[12px] absolute top-[6px] right-[20px] z-[100] text-white " onClick={handleAllRead} >Mark all read</p>
          <div className="flex flex-col w-full h-full overflow-y-auto notificationsScroll relative rounded-[10px] ">
          
            {notifications?.map((item: Message, i: number) => {
              return <NotificationsBoxItemsMemo key={i} item={item} i={i} goProfile={goProfile} messageContent={messageContent} timeAgo={timeAgo} navigate={navigate}  notifications={notifications} setOpenResultBox={setOpenResultBox} />
            })}
          </div>
        </div>
    )
  },[
    notifications,
    notificationsOpen,
    location.pathname,
    goProfile,
    messageContent,
    timeAgo,
    navigate,
  ])


  

  return (
    <>
    {/* <button className="bg-white " onClick={ResultBox} >asdwe</button> */}
      
        {loginBox && <Login loginBox={loginBox} setLoginBox={setLoginBox} setSignUpBox={setSignUpBox} />}    
        {userSettingsBox.open ?userSettingsBox.settingsPage == "emailCheck" || userSettingsBox.settingsPage == "loginCodeCheck" || userSettingsBox.settingsPage == "loginSetPassword" ?<LoginForgetPassword/>:null:null}  
        {signUpBox && <Signup signUpBox={signUpBox} setSignUpBox={setSignUpBox} setLoginBox={setLoginBox} />}
        {uploadRatingBox && <UploadRating uploadRatingBox={uploadRatingBox} />}
        {allReviewsBox.open && <AllReviews allReviewsBox={allReviewsBox} />}
        {location.state && <Reservation reservationBox={reservationBox} PoolInfo={location.state} />}
        {/* Was: a separate branch rendering UserSettingsPage.tsx bare (no modal/backdrop wrapper at
            all - just a floating <section>) for "emailCode"/"setPassword", instead of routing them
            through the properly-wrapped <UserSettings/> modal below like every other settingsPage
            value. That's what showed as an unstyled white box when clicking "Edit profile" on an
            account with no password yet (which dispatches settingsPage:"emailCode"). Removed - both
            states are now in the list below instead, and UserSettings.tsx's own routing (see the
            fix there) sends them to SetPasswordBox.tsx, which already correctly handles them. */}
        {userSettingsBox.open ?userSettingsBox.settingsPage == "settings" || userSettingsBox.settingsPage == "change username" || userSettingsBox.settingsPage == "change profile" || userSettingsBox.settingsPage == "change user" || userSettingsBox.settingsPage == "change password" || userSettingsBox.settingsPage == "forget password" || userSettingsBox.settingsPage == "delete account" || userSettingsBox.settingsPage == "Profile from Profile" || userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "setPassword" ? <UserSettings/>:null:null}
        
      <div
        className={`w-[100vw] ${
          reservationBox ?
          userLogIn?
              window.innerHeight < 992?
              "h-[992px] md:h-screen"
              :
              "h-screen "
            :
              window.innerHeight < 565?
              "h-[565px] md:h-screen"
              :
              "h-screen "
          :
          ((location.pathname == "/matchmake" ||
            location.pathname == "/messenger") &&
            window.innerWidth > 1024) ||
           signUpBox 
            ? "h-screen"
            : "min-h-screen"
        } relative overflow-hidden md:overflow-auto bg-[#10141E] flex flex-col md:p-[25px] ${
          location.pathname.includes("users") ||
          location.pathname == "/messenger" ||
          location.pathname.includes("Pools")
            ? " md:pt-[24px] lg:p-[32px]"
            : " lg:flex-row lg:gap-[39px] lg:p-[32px] lg:pr-[36px] "
        }`}
      >
        <ResultBoxMemo yourPointsInput={yourPointsInput} yourPoints={yourPoints} opponentsPointsInput={opponentsPointsInput} opponentsPoints={opponentsPoints} setYourPoints={setYourPoints} setOpponentsPoints={setOpponentsPoints} windowWidth={window.innerWidth} openResultBox={openResultBox} setOpenResultBox={setOpenResultBox} />
        <InvitationAcceptMemo acceptInvitation={props.acceptInvitation} setAcceptInvitation={props.setAcceptInvitation} lastJsonMessage={lastJsonMessage} />
        <Suspense fallback={<LoadingPage />} >
          <LayoutHeader setNotificationsOpen={setNotificationsOpen} setNotifications={setNotifications} headerHeight={layoutDimensions.headerHeight} unReadNotifications={unReadNotifications} setLogOut={props.setLogOut} userLogIn={userLogIn} setLoginBox={setLoginBox} setSignUpBox={setSignUpBox} />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          {notificationsList}
        </Suspense>
        <div
          style={
            location.pathname == "/messenger"
              ?window.innerWidth < 1024
                ? { width: layoutDimensions.contentW, height: layoutDimensions.contentH } // content fix
                : { width: layoutDimensions.contentW, height: "100%" }
              : { width: layoutDimensions.contentW }
          }
          className={` ${
            location.pathname == "/matchmake" ||
            location.pathname == "/messenger"
              ? "h-full"
              : ""
          } flex flex-col `}
        >
          <div
            className={` flex ml-[16px] my-[24px] md:ml-[0] md:my-[33px] ${
              location.pathname.includes("users") ||
              location.pathname == "/messenger" ||
              location.pathname.includes("Pools") ||
              location.pathname == "/matchmake"
                ? " hidden "
                : ""
            } `}
          >
            <img
              className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]"
              src="/images/icon-search.svg"
            />
            <input
              className="bg-transparent focus:outline-none text-white text-[16px] font-light md:text-[24px] "
              type="text"
              placeholder="Search for movies"
              onChange={
                location.pathname == "/matchmake"
                  ? (event) => {props.setUsersSearch(event.target.value)}
                  : (event) => {props.setSearch(event.target.value)}
            }
            />
          </div>
          <div
            className={`flex ${
              location.pathname == "/messenger" ? "h-[100%]" : "flex-grow"
            } `}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
