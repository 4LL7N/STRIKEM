/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import useWebSocket from "react-use-websocket";
import Cookies from 'js-cookie';


function Layout(props:{search:undefined|string,setSearch:any,setLogOut:any,logOut:boolean}){
    // const [pageSwitch, setPageSwitch] = useState<number>(1)
    const navigate = useNavigate()
    const token = Cookies.get('token')

    // const socketUrl = `wss://strikem.site/ws/poolhouses/billiard-club-rio/`
    // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl
    //    , {
    // onOpen: () => console.log('WebSocket connection opened'),
    // onClose: (event) => console.log('WebSocket connection closed:', event),
    // onError: (event) => console.error('WebSocket error:', event),
    // shouldReconnect: (closeEvent) => true,
// }
    // );
    // console.log(readyState)
    // const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([])

    const header = useRef<any>()
    const [contentW,setContentW] = useState<string>()

    const [socket, setSocket] = useState<any>();

    useEffect(()=>{
        if (header.current) {
            const viewportWidth = window.innerWidth; // Get 100vw width
            const headerWidth = header.current.offsetWidth; // Get header width
            setContentW(`${viewportWidth - headerWidth}px`);
          }

          const ws = new WebSocket('wss://strikem.site/ws/poolhouses/billiard-club-rio/')

          ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
            // setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };

    },[])

    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         console.log(lastMessage);
    //         console.log(messageHistory)
    //       setMessageHistory((prev) => prev.concat(lastMessage));
    //     }
    //   }, [lastMessage]);

    //   const handleClickSendMessage = () => sendMessage('Hello');

    const handleClickSendMessage = () => {socket.send('hello')};
    return(
        <>
        <div className="w-[100vw] overflow-hidden bg-[#10141E] flex flex-col md:p-[25px] lg:flex-row lg:gap-[39px] lg:p-[32px] lg:pr-[36px]" >
            <header ref={header} className="w-[100%] bg-[#161D2F] p-[16px] flex items-center justify-between md:rounded-[10px] md:px-[20px] lg:flex-col lg:max-w-[96px] lg:h-[960px] lg:px-[28px] lg:pt-[35.4px] lg:pb-[32px]">
                <Link to="/login" className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/public/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] ' onClick={() => props.setLogOut(false) } />
                {/* <div className="w-[133.5px] flex items-center justify-between lg:flex-col lg:w-[20px] gap-y-[40px]">
                    <Link to="home" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-home.svg")]  ${pageSwitch == 1? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `}  onClick={() => setPageSwitch(1)} />
                    <Link to="movies" className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-movie.svg")] ${pageSwitch == 2? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(2)} />
                    <Link to="series"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-tv.svg")] ${pageSwitch == 3? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(3)} />
                    <Link to="bookmarked"  className={` w-[16px] h-[16px] bg-no-repeat bg-[length:16px_16px] bg-[url("/images/icon-category-bookmark.svg")] ${pageSwitch == 4? "opacity-100":"opacity-50"} md:w-[20px] md:h-[20px] md:bg-[length:20px_20px] `} onClick={() => setPageSwitch(4)} />
                </div> */}
                <div className="w-[20px] h-[20px] bg-[#fff] " onClick={()=>{handleClickSendMessage}}  />
                <img className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[40px] lg:h-[40px]" src="/images/image-avatar.png" onClick={()=>{ navigate('/user') }} />
            </header>
            <div style={{maxWidth:contentW}}  >
                <div className="flex ml-[16px] my-[24px] md:ml-[0] md:my-[33px]" ><img className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]" src="/images/icon-search.svg"  /><input className="bg-transparent focus:outline-none text-[#FFF] text-[16px] font-light md:text-[24px] " type="text" placeholder="Search for movies" onChange={(event) => props.setSearch(event.target.value)} /></div>
                <Outlet />
            </div>
        </div>
        </>
    )
}

export default Layout