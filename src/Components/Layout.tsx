/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate} from "react-router-dom"
import { Link } from "react-router-dom"

import { useWebSocketContext } from "./Websocket";



function Layout(props:{search:string,setSearch:(search:string)=>void,usersSearch:string,setUsersSearch:(usersSearch:string)=>void,setLogOut:any,logOut:boolean,acceptInvatation:number,setAcceptInvatation:(acceptInvatation:number)=>void}){
    const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();
    const navigate = useNavigate();
    const location = useLocation();
    const header = useRef<any>();
    const [contentW, setContentW] = useState<string>();
    const [resize,setResize]=useState(false)

    const divSize = () => {
      const viewportWidth = window.innerWidth;
      if (location.pathname === "/user" || location.pathname === "/messenger" || location.pathname.includes("Pools")) {
        setContentW(`100%`);
      } else {
        if (viewportWidth >= 1024) {
          setContentW(`${viewportWidth - 96 - 39}px`);
        } else {
          setContentW(`100%`);
        }
      }
      window.addEventListener('resize',()=>{
        setResize(!resize)
      })
    };
  
    useEffect(() => {
      divSize();
    }, []);
  
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
        <div className={`w-[100vw] ${location.pathname == '/matchmake'?'h-screen':'min-h-screen'} relative overflow-hidden bg-[#10141E] flex flex-col md:p-[25px] ${location.pathname == '/user' || location.pathname == '/messenger' || location.pathname.includes('Pools') ?' md:pt-[24px] lg:p-[32px]':' lg:flex-row lg:gap-[39px] lg:p-[32px] lg:pr-[36px] '}`} >
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
            <header ref={header} className={`w-[100%] bg-[#161D2F] p-[16px] flex items-center justify-between md:rounded-[10px] md:px-[20px] ${location.pathname == '/user' || location.pathname == '/messenger'  || location.pathname.includes('Pools') ? ' md:mb-[24px] lg:mb-[48px] lg:h-[100px] ':`lg:flex-col  lg:max-w-[96px] ${location.pathname == '/matchmake'?'lg:h-[100%]':'lg:h-[960px]'} lg:px-[28px] lg:pt-[35.4px] lg:pb-[32px] `}`}>
                <Link to={location.pathname == '/home'?"/login":'/home'} className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/public/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] ' onClick={() => props.setLogOut(false) } />
                {/* <div className="w-[133.5px] flex items-center justify-between lg:flex-col lg:w-[20px] gap-y-[40px]">
                    <Link to="home" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-home.svg")]  ${pageSwitch == 1? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `}  onClick={() => setPageSwitch(1)} />
                    <Link to="movies" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-movie.svg")] ${pageSwitch == 2? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(2)} />
                    <Link to="series"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-tv.svg")] ${pageSwitch == 3? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(3)} />
                    <Link to="bookmarked"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-bookmark.svg")] ${pageSwitch == 4? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(4)} />
                </div> */}
                <Link to={'/messenger'} className="w-[20px] h-[20px] bg-[#fff] "  />
                <Link to={'/matchmake'} className="w-[20px] h-[20px] bg-[#fff] "  />
                <img className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:min-w-[40px] lg:min-h-[40px]" src="/images/image-avatar.png" onClick={()=>{ navigate('/user') }} />
            </header>
            <div style={{maxWidth:contentW}} className={` ${location.pathname == '/matchmake'?'h-full':''} flex-grow `}  >
                <div className={` flex ml-[16px] my-[24px] md:ml-[0] md:my-[33px] ${location.pathname == '/user' || location.pathname == '/messenger' || location.pathname.includes('Pools') ?" hidden ":''} `} ><img className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]" src="/images/icon-search.svg"  /><input className="bg-transparent focus:outline-none text-[#FFF] text-[16px] font-light md:text-[24px] " type="text" placeholder="Search for movies" onChange={(event) =>{location.pathname == '/matchmake'? props.setUsersSearch(event.target.value) : props.setSearch(event.target.value)}} /></div>
                
                    <Outlet />
                
            </div>
        </div>
        </>
    )
}

export default Layout