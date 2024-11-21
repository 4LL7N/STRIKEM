/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate} from "react-router-dom"
import { Link } from "react-router-dom"

import { useWebSocketContext } from "./Websocket";
import { FaBell, FaRegMessage } from "react-icons/fa6";
import { IoLogoGameControllerB } from "react-icons/io";
import axios from "axios";
import Cookies from 'js-cookie';


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



function Layout(props:{search:string,setSearch:(search:string)=>void,usersSearch:string,setUsersSearch:(usersSearch:string)=>void,setLogOut:any,logOut:boolean,acceptInvatation:number,setAcceptInvatation:(acceptInvatation:number)=>void}){
    const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [notificationsOpen,setNotificationsOpen] = useState<boolean>(false)
    const [notifications,setNotifications] = useState<Message[]>()


    const currentUser = useMemo(() => {
      return localStorage.getItem("currentUser") 
        ? JSON.parse(localStorage.getItem("currentUser")!) 
        : null;
    }, []);

    const header = useRef<any>();
    const [contentW, setContentW] = useState<string>();
    const [headerHeight,setHeaderHeight] = useState<number>(100)

    const divSize = () => {
      const viewportWidth = window.innerWidth;
      if (location.pathname.includes('users') || location.pathname === "/messenger" || location.pathname.includes("Pools") || location.pathname === "/matchmake") {
        setContentW(`100%`);
      } else {
        if (viewportWidth >= 1024) {
          setContentW(`${viewportWidth - 167}px`);
        } else {
          setContentW(`100%`);
        }
      }
      window.addEventListener('resize',()=>{
        headerResize()
      })
    };
  
    const headerResize = () =>{
      const headerheight = window.innerHeight - 64
      if(location.pathname.includes('users')  || location.pathname == '/messenger'  || location.pathname.includes('Pools') || location.pathname == '/matchmake'){
          setHeaderHeight(100)
      }else{
        if(window.innerWidth >= 1024 && !location.pathname.includes('Pools') ){
          setHeaderHeight(headerheight)
        }else{
          setHeaderHeight(100)
        }
      }
    }
    
    const fetchNoti = useCallback(async () => {
      const token = Cookies.get('token');
      console.log(token)
      try {
        const response = await axios.get(
          "https://strikem.site/api/notifications/",
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        setNotifications(response.data.results)
        console.log(response.data.results)
  
      } catch (err) {
        console.error(err);
      }
    }, [])

    const goProfile = (e:any,id:number) =>{
      setNotificationsOpen(false)
      e.stopPropagation()
      navigate(`/users/${id}`)
    }

    useEffect(() => {
      divSize();
      headerResize()
      window.addEventListener('resize', ()=>{headerResize()} )
      fetchNoti()
    }, []);

    useEffect(()=>{
      headerResize()
    },[location])
  
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
      }else{

        sendJsonMessage({
            protocol: "initial",
            action: "base",
          });
      }
    }, [location.pathname, sendJsonMessage]);
  
    useEffect(() => {
      console.log("Last message layout:", lastJsonMessage);
    }, [lastJsonMessage]);
  
    return(
        <>
        <div className={`w-[100vw] ${location.pathname == '/matchmake' && window.innerWidth > 1024 ?'h-screen':'min-h-screen'} relative overflow-hidden md:overflow-auto bg-[#10141E] flex flex-col md:p-[25px] ${location.pathname.includes('users') || location.pathname == '/messenger' || location.pathname.includes('Pools') ?' md:pt-[24px] lg:p-[32px]':' lg:flex-row lg:gap-[39px] lg:p-[32px] lg:pr-[36px] '}`} >
            <div className={` flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[60%] transition-transform duration-1000  ${props.acceptInvatation?' translate-y-[0] ':' translate-y-[-200%] '} bg-[#161d2f] `} >
                <div className="flex justify-between items-center" >
                <p className="flex self-center text-[14px] text-[#fff] ml-2 " >invitation accepted go to chat</p>
                <div className="flex items-center gap-[10px]" >
                    <button className=" bg-[#fab907] rounded-[20px] px-[8px] py-[4px] text-[14px] text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] " onClick={lastJsonMessage?.protocol == 'handling_invite_response'?()=>{navigate('/messenger');localStorage.setItem('matchupId',lastJsonMessage.matchup_id);props.setAcceptInvatation(-1)}:()=>{}} >Chat</button>
                    <button className=" bg-red-600  rounded-[20px] px-[8px] py-[4px]  text-[14px] text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] " onClick={()=>{props.setAcceptInvatation(-1)}} >Ignore</button>
                </div>
                </div>
                <div style={{width:`${props.acceptInvatation}%`}} className={`h-1 rounded-[4px] bg-[#fab907] mx-2 ${props.acceptInvatation == 0?'hidden':''} `} />
            </div>
            <header ref={header} style={window.innerWidth > 1024?location.pathname.includes('users') || location.pathname == '/messenger'  || location.pathname.includes('Pools')?{height:`${headerHeight}px`}:location.pathname == '/matchmake'?{height:`${headerHeight}%`}:{height:`${headerHeight}px`}:{}} className={`w-[100%] bg-[#161D2F] p-[16px] flex items-center justify-between md:rounded-[10px] md:px-[20px] z-50 ${location.pathname.includes('users') || location.pathname == '/messenger'  || location.pathname.includes('Pools') ? ' md:mb-[24px] lg:mb-[48px] ':`lg:flex-col  lg:max-w-[96px] lg:px-[28px] lg:pt-[35.4px] lg:pb-[32px] `}`}>
                <div className="flex flex-col items-center gap-[20px] " >
                <Link to={location.pathname == '/home'?"/login":'/home'} className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] ' onClick={() => {props.setLogOut(false);localStorage.setItem('matchUpId','')} } />
                <FaBell style={{color:'#fab907'}} className="w-[32px] h-[32px] hidden lg:block " onClick={()=>{setNotificationsOpen(!notificationsOpen)}}  />
                </div>
                <div className={`flex ${location.pathname == '/messenger' || location.pathname.includes('users') || location.pathname.includes('Pools')?"":'lg:flex-col'} gap-[32px] `} >
                <Link to={'/messenger'} className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] " onClick={()=>{localStorage.setItem('matchUpId','')}} ><FaRegMessage style={{color:'#fab907',width:'100%',height:'100%'}} /></Link>
                <Link to={'/matchmake'} className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] " onClick={()=>{localStorage.setItem('matchUpId','')}}  ><IoLogoGameControllerB  style={{color:'#fab907',width:'100%',height:'100%'}} /></Link>
                </div>
                <div className="flex items-center gap-[12px] " >
                <FaBell style={{color:'#fab907'}} className="w-[20px] h-[20px] lg:hidden " onClick={()=>{setNotificationsOpen(!notificationsOpen)}} />
                <img className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:min-w-[40px] lg:min-h-[40px] rounded-[50%] " src={currentUser.profile_image} onClick={()=>{ navigate('/users/me');localStorage.setItem('matchUpId','') }} />
                </div>
            </header>
                <div  className={` overflow-hidden absolute top-[80px] md:top-[110px] lg:top-[70px] right-[50px] md:right-[100px] lg:right-0 lg:left-[150px] w-[260px] md:w-[340px] h-[260px] md:h-[380px] bg-[#10141E] border border-white rounded-[20px] z-40 transform transition-all duration-500 ease-in-out ${
   notificationsOpen  
      ? "opacity-100 "
      : "opacity-0 "
  }`} >
    <div className="flex flex-col w-full h-full overflow-y-auto " >
    {notifications?.map((item:Message,i:number)=>{

      const message = (()=>{
        switch(item.type){
          case "INV":
            return 'invited you'
          case "MSG":
            return "sent you a message.";
          case "REJ":
            return "rejected your invitation.";
          case "ACP":
            return "accepted your invitation.";
          default:
            return "contacted you";
        }
      })
      const timeAgo = (timestamp: string): string => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInMs = now.getTime() - past.getTime(); // Difference in milliseconds
      
        const minutes = Math.floor(diffInMs / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
      
        // Return appropriate time difference
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
      };
      
      const body = (body:string) : string =>{
        if(body?.length > 22){
          return `${body.slice(0,22)}...`
        }else{
          return body
        }
      }
      console.log(item)

      return(
        <div key={item.id} className={` cursor-pointer flex items-center gap-[10px] w-[100%] h-[25%] ${i == notifications.length-1? '':'border-b-[1px] border-b-white' } p-[10px] ${item.read?"":'bg-[#1d2537]'} `} onClick={item.type == "INV"?()=>{navigate(`/matchmake`)}:item.type == "MSG"?()=>{navigate(`/messenger`),localStorage.setItem('matchUpId',item.extra)}:()=>{''}} >
          <img src={item.sent_by.profile_image} className="h-[95%] aspect-square rounded-[50%] " alt="" onClick={(e)=>{goProfile(e,item.sent_by.id)}} />
          <div className="flex flex-col md:gap-[4px] " >
            <h1 className="text-[14px] md:text-[18px] text-[#fff] " >{item.sent_by.user.username} {message()}</h1>
            <div className="flex gap-[3px]  " >
            <p className={`${item.type == 'MSG'?"":" hidden "} text-[10px] md:text-[14px] text-[#fff]`} >{body(item.body)}</p>
            <p className={`text-[10px] md:text-[14px] text-[#7e7e7e] `} > {timeAgo(item.timestamp)} </p>
            </div>
          </div>
        </div>
      )
    })}
    
    </div>
                </div>
            <div style={location.pathname == '/messenger' && window.innerWidth < 768?{width:contentW,height:window.innerHeight-57}:{width:contentW}}  className={` ${location.pathname == '/matchmake' ?'h-full':''} flex flex-col `}  >
                <div className={` flex ml-[16px] my-[24px] md:ml-[0] md:my-[33px] ${location.pathname.includes('users') || location.pathname == '/messenger' || location.pathname.includes('Pools') || location.pathname == '/matchmake' ?" hidden ":''} `} ><img className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]" src="/images/icon-search.svg"  /><input className="bg-transparent focus:outline-none text-[#FFF] text-[16px] font-light md:text-[24px] " type="text" placeholder="Search for movies" onChange={(event) =>{location.pathname == '/matchmake'? props.setUsersSearch(event.target.value) : props.setSearch(event.target.value)}} /></div>
                <div className="flex flex-grow" >
                    <Outlet />
                    </div>
            </div>
        </div>
        </>
    )
}

export default Layout