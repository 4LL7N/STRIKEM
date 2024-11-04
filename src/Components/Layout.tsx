/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate} from "react-router-dom"
import { Link } from "react-router-dom"
// import useWebSocket from "react-use-websocket";
// import Cookies from 'js-cookie';


function Layout(props:{search:string,setSearch:(search:string)=>void,usersSearch:string,setUsersSearch:(usersSearch:string)=>void,setLogOut:any,logOut:boolean}){
    // const [pageSwitch, setPageSwitch] = useState<number>(1)
    const navigate = useNavigate()
    const location = useLocation()
    // const token = Cookies.get('token')

    // const onMessage = (event) => {
        // console.log('Received message directly from onMessage:', event.data);
        // Handle message here
    //   };

    const socketUrl = `wss://strikem.site/ws/matchmake/`
//     const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl
//        , {
//         onMessage,
//     onOpen: () => console.log('WebSocket connection opened'),
//     onClose: (event) => console.log('WebSocket connection closed:', event),
//     onError: (event) => console.error('WebSocket error:', event),
//     shouldReconnect: (closeEvent) => true,
// }
//     );
//     console.log(readyState)
    // const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([])

    const header = useRef<any>()
    const [contentW,setContentW] = useState<string>()


    const divSize = () => {
        const viewportWidth = window.innerWidth; 
        if(location.pathname == '/user' || location.pathname == '/messenger' || location.pathname.includes('Pools')  ){
            
            setContentW(`100%`);
        }else{
            if( viewportWidth >= 1024){
                setContentW(`${viewportWidth - 96 - 39}px`);
            }else{
                setContentW(`100%`);
            }
        }
    }

    useEffect(()=>{
        divSize()

    },[])

    const [websocket , setWebsocket ] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        setWebsocket(ws)
        ws.onopen = () => {
          console.log('WebSocket connected');
          ws.send('Hello, WebSocket!');
        };
    
        ws.onmessage = (event) => {
          console.log('Received message:', event.data);
        //   setMessageHistory(event.data);
        };
    
        ws.onclose = () => console.log('WebSocket disconnected');
    
        return () => ws.close();
      }, [socketUrl]);

      useEffect(()=>{
        divSize()
      },[location.pathname])

    // console.log(lastMessage?.data);
    // useEffect(() => {
    //     console.log(lastMessage?.data);

        
        
    //     if (lastMessage !== null) {
    //         console.log(messageHistory)
    //         setMessageHistory((prev) => prev.concat(lastMessage));
    //     }

        // const interval = setInterval(() => {
            // console.log('Last message:', lastMessage);
        //   }, 1000);
        
        // return () => clearInterval(interval);

    //   }, [lastMessage]);

    //   const handleClickSendMessage = () => { sendMessage('Hello, WebSocket!');console.log('message') };

    const handleClickSendMessage = () => {websocket?.send('hello')};
    return(
        <>
        <div className={`w-[100vw] min-h-screen overflow-hidden bg-[#10141E] flex flex-col md:p-[25px] ${location.pathname == '/user' || location.pathname == '/messenger' || location.pathname.includes('Pools') ?' md:pt-[24px] lg:p-[32px]':' lg:flex-row lg:gap-[39px] lg:p-[32px] lg:pr-[36px] '}`} >
            <header ref={header} className={`w-[100%] bg-[#161D2F] p-[16px] flex items-center justify-between md:rounded-[10px] md:px-[20px] ${location.pathname == '/user' || location.pathname == '/messenger'  || location.pathname.includes('Pools') ? ' md:mb-[24px] lg:mb-[48px] lg:h-[100px] ':`lg:flex-col  lg:max-w-[96px] ${location.pathname == '/matchup'?'lg:min-h-[100%]':'lg:h-[960px]'} lg:px-[28px] lg:pt-[35.4px] lg:pb-[32px] `}`}>
                <Link to={location.pathname == '/home'?"/login":'/home'} className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/public/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] ' onClick={() => props.setLogOut(false) } />
                {/* <div className="w-[133.5px] flex items-center justify-between lg:flex-col lg:w-[20px] gap-y-[40px]">
                    <Link to="home" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-home.svg")]  ${pageSwitch == 1? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `}  onClick={() => setPageSwitch(1)} />
                    <Link to="movies" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-movie.svg")] ${pageSwitch == 2? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(2)} />
                    <Link to="series"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-tv.svg")] ${pageSwitch == 3? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(3)} />
                    <Link to="bookmarked"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-bookmark.svg")] ${pageSwitch == 4? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(4)} />
                </div> */}
                <div className="w-[20px] h-[20px] bg-[#fff] " onClick={()=>{handleClickSendMessage()}}  />
                <img className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:min-w-[40px] lg:min-h-[40px]" src="/images/image-avatar.png" onClick={()=>{ navigate('/user') }} />
            </header>
            <div style={{maxWidth:contentW}} className=" flex-grow "  >
                <div className={` flex ml-[16px] my-[24px] md:ml-[0] md:my-[33px] ${location.pathname == '/user' || location.pathname == '/messenger' || location.pathname.includes('Pools') ?" hidden ":''} `} ><img className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]" src="/images/icon-search.svg"  /><input className="bg-transparent focus:outline-none text-[#FFF] text-[16px] font-light md:text-[24px] " type="text" placeholder="Search for movies" onChange={(event) =>{location.pathname == '/matchup'? props.setUsersSearch(event.target.value) : props.setSearch(event.target.value)}} /></div>
                <Outlet />
            </div>
        </div>
        </>
    )
}

export default Layout