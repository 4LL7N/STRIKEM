import { memo, useCallback, useRef } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { FaBell, FaRegIdCard, FaRegMessage } from "react-icons/fa6";

import Cookies from "js-cookie";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setUserLogIn } from "../../ReduxStore/features/userLogIn";
import { Link, useNavigate } from "react-router-dom";
import { LayoutHeaderProps } from "../../type";
import { IoLogoGameControllerB } from "react-icons/io";


const LayoutHeader = memo(({setNotificationsOpen,setNotifications,headerHeight,unReadNotifications,setLogOut,userLogIn,setLoginBox,setSignUpBox}:LayoutHeaderProps) => {

    const navigate = useNavigate();
      const header = useRef<HTMLElement>(null);
    

    const unReadMatchUps = useAppSelector((state) => state.unreadMatchUps);
    const currentUser = useAppSelector((state) => state.currentUser);
      const dispatch = useAppDispatch();

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

       const logOut = () => {
          dispatch(setUserLogIn(false));
          Cookies.set("token", "logout", {
            secure: true,
            sameSite: "Strict",
          });
          navigate("/home");
          window.location.reload();
        };


    return(
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
                setLogOut(false);
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
                !userLogIn||
                location.pathname.includes("Pools")
                  ? "hidden"
                  : "lg:block"
              } `}
              onClick={() => {
                fetchNoti();setNotificationsOpen((prev: boolean) => !prev);
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
            } gap-[32px] ${!userLogIn && "hidden"} `}
          >
            <Link
              to={"/messenger"}
              className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] relative "
              onClick={() => {
                location.pathname != "/messenger" && localStorage.setItem("matchUpId", "");
              }}
            >
              <div className={` ${!unReadMatchUps && 'hidden'}  ${ location.pathname == "/messenger" || location.pathname.includes("Pools") || location.pathname.includes("users")? '' :'lg:hidden'} flex  items-center justify-center rounded-[50%] bg-red-600 w-[70%] h-[70%] absolute right-[-10%] top-[-10%] z-40 `} >
                <p className="text-[12px] text-white " >{unReadMatchUps}</p>
              </div>
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
            className={`flex ${location.pathname.includes('Pool') || location.pathname == '/messenger' || location.pathname.includes("users") ? '' :'lg:flex-col'} items-center gap-[12px] ${!userLogIn && "hidden"} `}
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
                fetchNoti();setNotificationsOpen(prev => !prev);
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
              className={` ${!userLogIn && "hidden"}  bg-[#243257d5] rounded-[6px] w-[24px] h-[24px] lg:w-[32px] lg:h-[32px] flex items-center justify-center `}
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
            } gap-[10px] md:gap-[14px] ${userLogIn && "hidden"} `}
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
    )
})

export default LayoutHeader;