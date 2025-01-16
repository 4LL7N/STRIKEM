/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useWebSocketContext } from "./Websocket";
import { FaBell, FaRegIdCard, FaRegMessage } from "react-icons/fa6";
import { IoLogoGameControllerB } from "react-icons/io";

import "./CSS/notification.css";
import axios from "axios";
import Cookies from "js-cookie";
import { CiLogin, CiLogout } from "react-icons/ci";
import Login from "./Login";
import Signup from "./Signup";
import { jwtDecode } from "jwt-decode";
import Reservation from "./PoolMemo/Reservation";
import ResultBoxMemo from "./LayoutMemo/ResultBoxMemo";
import NotificationsBoxItemsMemo from "./LayoutMemo/NotificationsBoxItemsMemo";
import InvitationAcceptMemo from "./LayoutMemo/InvitationAcceptMemo";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  id: number;
}

interface SentBy {
  id: number;
  profile_image: string;
  total_points: number;
  user: User;
}

interface Message {
  id: number;
  body: string;
  type: string;
  timestamp: string; // Use `Date` instead if you'd like to work with Date objects.
  read: boolean;
  player: number;
  sent_by: SentBy;
  extra: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface Player {
  id: number;
  games_played: number;
  games_won: number;
  inviting_to_play: boolean;
  opponents_met: number;
  profile_image: string;
  total_points: number;
  user: User;
}

function Layout(props: {
  search: string;
  setSearch: (search: string) => void;
  usersSearch: string;
  setUsersSearch: (usersSearch: string) => void;
  setLogOut: any;
  logOut: boolean;
  acceptInvatation: number;
  setAcceptInvatation: (acceptInvatation: number) => void;
}) {
  const { sendJsonMessage, lastJsonMessage, logedIn, setLogedIn ,reservationBox} =
    useWebSocketContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Message[]>();
  const [unReadNotifications, setUnReadNotifications] = useState<number>();

  const [loginBox, setLoginBox] = useState<boolean>(false);
  const [signUpBox, setSignUpBox] = useState<boolean>(false);

  const [resize,setResize] = useState<boolean>(false)

  const [currentUser, setCurrentUser] = useState<Player>();

  const header = useRef<any>();
  const [contentW, setContentW] = useState<string>();
  const [contentH, setContentH] = useState<string>();
  const [headerHeight, setHeaderHeight] = useState<number>(100);

  const [openResultBox, setOpenResultBox] = useState<boolean>(false);
  const yourPointsInput = useRef<HTMLInputElement | null>(null);
  const [yourPoints, setYourPoints] = useState<number>(0);
  const opponentsPointsInput = useRef<HTMLInputElement | null>(null);
  const [opponentsPoints, setOpponentsPoints] = useState<number>(0);


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

  const FetchCurrentUser = async () => {
    const token = Cookies.get("token");
    try {
      if (token && token != "logout") {
        const currentUserResponse = await axios.get(
          "https://strikem.site/users/current-user",
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );        
        setCurrentUser(currentUserResponse.data);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(currentUserResponse.data)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateLayout = useCallback((pathname:string) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isSpecialPage =
      pathname.includes("users") ||
      pathname === "/messenger" ||
      pathname.includes("Pools") ||
      pathname === "/matchmake";
    setContentW(
      viewportWidth >= 1024 && !isSpecialPage
        ? `${viewportWidth - 191}px`
        : "100%"
    );

    if (viewportWidth < 768) {
      setContentH(`${viewportHeight - 77}px`);
      
    } else if (viewportWidth < 1024) {
      setContentH(`${viewportHeight - 140}px`);
    } else {
      setContentH(`${viewportHeight - 24}px`);
    }

    // `${window.innerHeight - 137}px`;
    setHeaderHeight(
      isSpecialPage || viewportWidth < 1024 ? 100 : window.innerHeight - 65
    );
    
  }, [location.pathname]);

  const fetchNoti = useCallback(async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        "https://strikem.site/api/notifications/",
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      setNotifications(response.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const FetchUnreadNotifications = useCallback(async () => {
    const token = Cookies.get("token");
    try {
      const unreadResponse = await axios.get(
        "https://strikem.site/api/unread-matchups/",
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      setUnReadNotifications(unreadResponse.data.unread);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const goProfile = (e: any, id: number) => {
    setNotificationsOpen(false);
    e.stopPropagation();
    id && navigate(`/users/${id}`);
  };

  const logOut = () => {
    setLogedIn(false);
    Cookies.set("token", "logout", {
      secure: true,
      sameSite: "Strict",
    });
    navigate("/home");
    window.location.reload();
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
      setLogedIn(true);
      FetchCurrentUser();
      FetchUnreadNotifications();
    }
    updateLayout(location.pathname);
    window.addEventListener("resize", () => {
      // headerResize();
      // updateLayout();
      setResize((i)=>!i)
    });
  }, []);

  useEffect(()=>{
    updateLayout(location.pathname)
  },[resize])

  useEffect(() => {
    updateLayout(location.pathname)
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("Pool")) {
      sendJsonMessage({
        protocol: "initial",
        action: "poolhouse",
        poolhouseName: location.state.slug,
      });
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
    // console.log(lastJsonMessage);
    if (lastJsonMessage && lastJsonMessage?.protocol == "now_free") {
      localStorage.setItem("sessionId", lastJsonMessage.game_session_id);
      setOpenResultBox(true);
    }
  }, [lastJsonMessage]);

  const AllRead = async () => {
    const token = Cookies.get("token");
    try {
      await axios.put(
        "https://strikem.site/api/mark-all-read/",
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
              // console.log(item);
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
      <div
        className={` flex flex-col items-center justify-center  w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 absolute z-50 transform transition-all duration-300 ${
          loginBox ? "" : "hidden"
        } `}
      >
        <Login setLoginBox={setLoginBox} setSignUpBox={setSignUpBox} />
      </div>
      <div
        className={` flex flex-col items-center justify-center  w-[100vw] h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 absolute z-50 transform transition-all duration-300 ${
          signUpBox ? "" : "hidden"
        } `}
      >
        <Signup setSignUpBox={setSignUpBox} setLoginBox={setLoginBox} />
      </div>
      <div
        className={` flex flex-col items-center justify-center  w-[100vw] ${logedIn?window.innerHeight < 992?"h-[992px] md:h-screen ":"h-screen":window.innerHeight < 565?"h-[565px] md:h-screen ":"h-screen"} px-[20px] bg-[#10141E] bg-opacity-90 absolute z-50 transform transition-all duration-300 ${
          reservationBox && location.state? "" : "hidden"
        }  `}
      >
        {location.state && <Reservation reservationBox={reservationBox} PoolInfo={location.state} />}
      </div>
      <div
        className={`w-[100vw] ${
          reservationBox ?
            logedIn?
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
          loginBox || signUpBox 
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
        <InvitationAcceptMemo acceptInvatation={props.acceptInvatation} setAcceptInvatation={props.setAcceptInvatation} lastJsonMessage={lastJsonMessage} />
        <header
          ref={header}
          style={
            window.innerWidth > 1024
              ? location.pathname.includes("users") ||
                location.pathname == "/messenger" ||
                location.pathname.includes("Pools")
                ? { height: `${headerHeight}px` }
                : location.pathname == "/matchmake"
                ? { height: `${headerHeight}%` }
                : { height: `${headerHeight}px` }
              : {}
          }
          className={`w-[100%] bg-[#161D2F] p-[16px] flex items-center justify-between md:rounded-[10px] md:px-[20px] z-40 ${
            location.pathname.includes("users") ||
            location.pathname == "/messenger" ||
            location.pathname.includes("Pools")
              ? " md:mb-[24px] "
              : `lg:flex-col  lg:max-w-[96px] lg:px-[28px] lg:pt-[35.4px] lg:pb-[32px] `
          }`}
        >
          <div
            className={` flex ${
              location.pathname == "/messenger" ||
              location.pathname.includes("users") ||
              location.pathname.includes("Pools")
                ? "flex-row"
                : "lg:flex-col"
            } items-center gap-[20px] `}
          >
            
            <Link
              to={"/home"}
              className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] '
              onClick={() => {
                props.setLogOut(false);
                localStorage.setItem("matchUpId", "");
              }}
            />
            <div className="relative " >
            <div className={` ${ location.pathname == "/messenger" || location.pathname.includes("users") || location.pathname.includes("Pools")? '' :!unReadNotifications ?'hidden':'lg:flex '} hidden items-center justify-center rounded-[50%] bg-red-600 w-[70%] h-[70%] absolute right-[-10%] top-[-10%] z-40 `} >
                <p className="text-[12px] text-white " >{unReadNotifications}</p>
              </div>
            <FaBell
              style={{ color: "#fab907" }}
              className={` w-[32px] h-[32px] hidden ${
                location.pathname == "/messenger" ||
                location.pathname.includes("users") ||
                !logedIn||
                location.pathname.includes("Pools")
                  ? "hidden"
                  : "lg:block"
              } `}
              onClick={() => {
                fetchNoti();setNotificationsOpen(!notificationsOpen);
              }}
            />
            </div>
          </div>
          <div
            className={`flex ${
              location.pathname == "/messenger" ||
              location.pathname.includes("users") ||
              location.pathname.includes("Pools")
                ? ""
                : "lg:flex-col"
            } gap-[32px] ${!logedIn && "hidden"} `}
          >
            <Link
              to={"/messenger"}
              className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] "
              onClick={() => {
                localStorage.setItem("matchUpId", "");
              }}
            >
              <FaRegMessage
                style={{ color: "#fab907", width: "100%", height: "100%" }}
              />
            </Link>
            <Link
              to={"/matchmake"}
              className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] "
              onClick={() => {
                localStorage.setItem("matchUpId", "");
              }}
            >
              <IoLogoGameControllerB
                style={{ color: "#fab907", width: "100%", height: "100%" }}
              />
            </Link>
          </div>
          <div
            className={`flex ${location.pathname.includes('Pool') || location.pathname == '/messenger' || location.pathname.includes("users") ? '' :'lg:flex-col'} items-center gap-[12px] ${!logedIn && "hidden"} `}
          >
            <div className="relative" >
              <div className={` ${!unReadNotifications && 'hidden'}  ${ location.pathname == "/messenger" || location.pathname.includes("Pools") || location.pathname.includes("users")? '' :'lg:hidden'} flex  items-center justify-center rounded-[50%] bg-red-600 w-[70%] h-[70%] absolute right-[-10%] top-[-10%] z-40 `} >
                <p className="text-[12px] text-white " >{unReadNotifications}</p>
              </div>
            <FaBell
              style={{ color: "#fab907" }}
              className={` w-[20px] h-[20px] md:w-[32px] md:h-[32px] ${
                location.pathname == "/messenger" ||
                location.pathname.includes("users") || location.pathname.includes("Pools")
                  ? "block"
                  : "lg:hidden"
              }  `}
              onClick={() => {
                fetchNoti();setNotificationsOpen(!notificationsOpen);
              }}
            />
            </div>
            <img
              className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] rounded-[50%] "
              src={currentUser?.profile_image}
              onClick={() => {
                navigate("/users/me");
                localStorage.setItem("matchUpId", "");
              }}
            />
            <button
              className={` ${!logedIn && "hidden"}  bg-[#243257d5] rounded-[6px] w-[24px] h-[24px] lg:w-[32px] lg:h-[32px] flex items-center justify-center `}
              onClick={logOut}
            >
              <CiLogout
                style={{ color: "white", width: "80%", height: "80%" }}
                className={``}
              />
            </button>
          </div>
          <div
            className={` flex ${
              location.pathname.includes("Pool") || location.pathname.includes("users") || location.pathname == "/messenger"
                ? "lg:gap-[20px] items-center"
                : "lg:flex-col justify-center "
            } gap-[10px] md:gap-[14px] ${logedIn && "hidden"} `}
          >
            <button
              className={` px-[10px] py-[5px]  bg-[#243257d5] rounded-[20px]  ${
                location.pathname.includes("Pool")|| location.pathname.includes("users")
                  ? ""
                  : " lg:w-[32px] lg:h-[32px] lg:flex lg:p-0 lg:rounded-[6px] "
              }  lg:items-center lg:justify-center `}
              onClick={() => {
                setLoginBox(true);
              }}
            >
              <p
                className={` text-white text-[12px] md:text-[16px]  ${
                  location.pathname.includes("Pool")|| location.pathname.includes("users")
                    ? "lg:text-[20px]"
                    : " lg:hidden  "
                } `}
              >
                Log In
              </p>
              <CiLogin
                style={{ color: "white", width: "80%", height: "80%" }}
                className={`hidden ${
                  location.pathname.includes("Pool")|| location.pathname.includes("users") ? "" : " lg:block "
                } `}
              />
            </button>

            <button
              className={` px-[10px] py-[5px]  bg-[#243257d5] rounded-[20px]  ${
                location.pathname.includes("Pool")|| location.pathname.includes("users")
                  ? ""
                  : " lg:w-[32px] lg:h-[32px] lg:flex lg:p-0 lg:rounded-[6px] "
              }  lg:items-center lg:justify-center `}
              onClick={() => {
                setSignUpBox(true);
              }}
            >
              <p
                className={` text-white text-[12px] md:text-[16px]  ${
                  location.pathname.includes("Pool")|| location.pathname.includes("users")
                    ? "lg:text-[20px]"
                    : " lg:hidden  "
                } `}
              >
                Sign Up
              </p>
              <FaRegIdCard
                style={{ color: "white", width: "80%", height: "80%" }}
                className={`hidden ${
                  location.pathname.includes("Pool")|| location.pathname.includes("users") ? "" : " lg:block "
                } `}
              />
            </button>
          </div>
        </header>
        {notificationsList}
        <div
          style={
            location.pathname == "/messenger"
              ?window.innerWidth < 1024
                ? { width: contentW, height: contentH } // content fix
                : { width: contentW, height: "100%" }
              : { width: contentW }
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
              className="bg-transparent focus:outline-none text-[#FFF] text-[16px] font-light md:text-[24px] "
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
