/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";

import "./CSS/messenger.css";
import { FiSend } from "react-icons/fi";
import { useWebSocketContext } from "./Websocket";
import ChatBubble from "./MessengerMemo/ChatBubble";
import MessageItem from "./MessengerMemo/MessageItem";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

interface chatMessage {
    after_outdated?: boolean;
    body: string;
    id?: number;
    sender: Sender;
    time_sent?: string;
  }
  
  interface Sender {
    id?: number;
    profile_image?: string;
    total_points?: number;
    user?: User;
  }
  
  interface User {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    username: string;
  }
  

interface Message {
  id: string;
  last_message: {
    body: string;
    sender: {
      id: number;
      profile_image: string;
      total_points: number;
      user: {
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        username: string;
      };
    };
  };
  player_accepting: {
    id: number;
    profile_image: string;
    total_points: number;
    user: {
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      username: string;
    };
  };
  player_inviting: {
    id: number;
    profile_image: string;
    total_points: number;
    user: {
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      username: string;
    };
  };
}

function Messenger() {

    const {sendJsonMessage, lastJsonMessage} = useWebSocketContext()

    const naviagte = useNavigate()

    // const handlers = useSwipeable({
    //   onSwipedLeft: () => {window.innerWidth < 1024?setIsSwiped(false):null},  // Slide out on left swipe
    //   onSwipedRight: () => {window.innerWidth < 1024?setIsSwiped(true):null},  // Slide in on right swipe
    //   trackTouch: true,
    //   trackMouse: false,
    // });

    const [isSwiped, setIsSwiped] = useState(false);

    const messageChat = useRef<any>()

    const currentUser = useMemo(() => {
      return localStorage.getItem("currentUser") 
        ? JSON.parse(localStorage.getItem("currentUser")!) 
        : null;
    }, []);

    const location = useLocation()
    
  const [messages, setMessages] = useState<Message[]>();
  const [openChat,setOpenChat] = useState<string>('')
  const [chat,setChat] = useState<chatMessage[]>([])

    const [messageTo,setMessageTo] = useState<any>()

    const chatInput = useRef<any>()

    const token = Cookies.get("token");
  const Fetch = async () => {
    const matchUpId = localStorage.getItem('matchUpId')
    try {
      const response = await axios("https://strikem.site/api/matchups/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      setMessages(response.data.results);
      if(response.data.results.length > 0 ){
      if(!openChat){
        setOpenChat(response.data.results[0].id)
        console.log(response.data)
          let otherPlayer =
          response.data.results[0].player_accepting.id == currentUser?.id
              ? response.data.results[0].player_inviting
              : response.data.results[0].player_accepting;
          if(matchUpId){
            const findMatuchUp = response.data.results.find((item:any)=>item.id == matchUpId)
            otherPlayer =
            findMatuchUp.player_accepting.id == currentUser?.id
              ? findMatuchUp.player_inviting
              : findMatuchUp.player_accepting;
          }else if(openChat){
            const findMatuchUp = response.data.results.find((item:any)=>item.id == openChat)
            otherPlayer =
            findMatuchUp.player_accepting.id == currentUser?.id
              ? findMatuchUp.player_inviting
              : findMatuchUp.player_accepting;
          }else{
            otherPlayer =
          response.data.results[0].player_accepting.id == currentUser?.id
              ? response.data.results[0].player_inviting
              : response.data.results[0].player_accepting;
          }
            

            setMessageTo(otherPlayer)
      }
      const Chatresponse = await axios(
        `https://strikem.site/api/matchups/${matchUpId?matchUpId:openChat?openChat:response.data.results[0].id}/chat/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      const chatData = Chatresponse.data.results
      console.log(chatData)

      setChat(chatData)
      localStorage.setItem('matchUpId','')
    }
    } catch (err) {
      console.log(err);
    }
  };

  const messagesFetch = useCallback(async (id: string) => {
    try {
        const Chatresponse = await axios(
            `https://strikem.site/api/matchups/${id}/chat/`,
            { headers: { Authorization: `JWT ${token}` } }
        );
        const chatData = Chatresponse.data.results.reverse()
        setChat(chatData);
    } catch (err) {
        console.log(err);
    }
}, [token, setChat]);

  const getFormattedTime = useMemo(() => {
    const date = new Date();
  
    const formattedDate = date.toISOString().slice(0, -1); // Remove trailing "Z"
  
    // Get timezone offset in `+HH:MM` format
    const offset = -date.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const sign = offset >= 0 ? '+' : '-';
  
    return `${formattedDate}${sign}${hours}:${minutes}`;
  }, []);
  

  const sendMessage = () =>{
    
    if(currentUser && chatInput.current && chatInput.current.value && chatInput.current.value.trim()){
      console.log('senddddd')
    sendJsonMessage({
        'action': 'matchup',
       'message': chatInput.current.value,
       'username': currentUser.user.username,
       'opponent_username': messageTo.user.username,
       'matchup_id': openChat,
    })
    const user = {...currentUser.user}
    const chatContent = [...chat]
    chatContent.push({
        body:chatInput.current.value,
        sender:{
            id:currentUser.id,
            profile_image:currentUser.profile_image,
            total_points:currentUser.total_points,
            user,
        },
        time_sent:getFormattedTime
    })
    setChat(chatContent)
    chatInput.current.value = ""
}
  }

  useEffect(() => {
    Fetch();
    const messengerBox = document.getElementById("messengerBox")
    
    

    if(window.innerWidth >= 1024){
    setTimeout(() => {
      if(messengerBox)
      messengerBox.style.height = `${
        window.innerHeight -
        messengerBox?.getBoundingClientRect().top -
        32
      }px`;
      if(location.state?.matchUpId){
        setOpenChat(location.state.matchUpId)
      }else{
      messages?setOpenChat(messages[0]?.id):null
      }
    }, 100);
  }else{
    setTimeout(() => {
      if(messengerBox)
      messengerBox.style.height = `${
        window.innerHeight -
        messengerBox?.getBoundingClientRect().top -
        10
      }px`;
      if(location.state?.matchUpId){
        setOpenChat(location.state.matchUpId)
      }else{
      messages?setOpenChat(messages[0]?.id):null
      }
    }, 100);
    window.addEventListener('resize',()=>{
      if(window.innerWidth >= 1024){
        if(messengerBox)
          messengerBox.style.height = `${
            window.innerHeight -
            messengerBox?.getBoundingClientRect().top -
            32
          }px`;
          
      }else{
        if(messengerBox)
        messengerBox.style.height = `${
          window.innerHeight -
          messengerBox?.getBoundingClientRect().top -
          10
        }px`;
      }})
  }
  if(messageChat.current){
    messageChat.current.scrollTop = messageChat.current.scrollHeight
}
  }, []);
  useLayoutEffect(() => {
    if (messageChat.current) {
      messageChat.current.scrollTop = messageChat.current.scrollHeight;
    }
  }, []);


  useEffect(()=>{
    // console.log(lastJsonMessage)
    if(lastJsonMessage){
      const lastMessage = {
        body:lastJsonMessage.message,
        sender:{
          id:lastJsonMessage.sender_player_id,
        },
        time_sent:lastJsonMessage?.getFormattedTime
      }
      const chatContent = [lastMessage,...chat]
    setChat(chatContent)
  }
  },[lastJsonMessage])

  const messagesList = useMemo(() => {
    return messages?.map((item: Message) => {
      const otherPlayer =
            item.player_accepting.id == currentUser?.id
              ? item.player_inviting
              : item.player_accepting;
      // console.log(item)
        return (
            <MessageItem
        key={item.id}
        item={item}
        isSelected={openChat === item.id}
        onClick={() => {
          setOpenChat(item.id);
          messagesFetch(item.id);
          setMessageTo(otherPlayer)
          window.innerWidth < 1024?setIsSwiped(false):null
          sendJsonMessage({
            'action': 'change_matchup',
           'matchup_id': item.id,
        })
        }}
        goToProfile={(e)=>{
          e.stopPropagation()
          localStorage.setItem('matchUpId','')
          naviagte(`/users/${otherPlayer.id}`)
        }}
      />
        );
    });
}, [messages, openChat, messagesFetch]);

const chatMessages = useMemo(() => {
    
    
    return chat?.map((item: chatMessage, i: number) => {

        const author = item?.sender.id === currentUser.id

        let rounded = "rounded-[40px]";
        if(author){
        if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
            rounded = chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
                ? "rounded-[40px_0px_0px_40px]"
                : "rounded-[40px_0px_40px_40px]";
        } else if (chat[i - 1] && chat[i].sender?.id === chat[i - 1]?.sender.id) {
            rounded = "rounded-[40px_40px_0px_40px]";
        }
        }else{
            if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
                rounded = chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
                    ? "rounded-[0px_40px_40px_0px]"
                    : "rounded-[0px_40px_40px_40px]";
            } else if (chat[i - 1] && chat[i].sender?.id === chat[i - 1]?.sender.id) {
                rounded = "rounded-[40px_40px_40px_0px]";
            }
        }

        const margin = i === chat.length
            ? "mt-[0px]"
            : chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id
                ? "mt-[2px]"
                : "mt-[7px]";

        return (
            <ChatBubble
          key={i}
          item={item}
          isCurrentUser={author}
          rounded={rounded}
          margin={margin}
        />
        );
    });
}, [chat]);

  return (
    <section
      // ref={messengerRef}
      id="messengerBox"
      className="lg:flex-grow flex flex-col lg:flex-row m-[10px] w-[100%] border-[1px] border-[#243257d5]  rounded-[20px] overflow-hidden relative "
    >
      <div
        className={` lg:hidden absolute top-0 left-0 z-50 transition-transform duration-1000 ease-in-out ${
          isSwiped ? 'translate-x-0' : '-translate-x-full'
        } w-full h-full bg-[#10141E] text-white `}
      >
        {messagesList}
      </div>
      <div className="lg:flex lg:flex-col hidden w-[35%] border-r border-r-[#243257d5]  h-[100%] overflow-y-auto chatScroll ">
        {messagesList}
      </div>
      <div className="flex justify-between items-center w-[100%] h-[84px] border-b-[1px] border-b-[#243257d5] p-[10px] lg:hidden " >
          <div className="flex items-center text-[#fff] h-full  " >
          <FaArrowLeft style={{color:'white',width:'32px',height:'32px'}} onClick={()=>{setIsSwiped((i)=>!i)}} />
          </div>
        <div className="flex gap-[10px] h-[100%] " >
        <div className=" flex flex-col h-[100%] justify-evenly items-end " >
          <h1 className="text-[#fff] text-[16px] cursor-pointer " onClick={()=>{naviagte(`/users/${messageTo.id}`);localStorage.setItem('matchUpId','')}} >{messageTo?.user.username}</h1>
          <h2 className="text-[#ffffff57] text-[16px] " >({messageTo?.user.first_name} {messageTo?.user.last_name})</h2>
        </div>
        <div className="h-[100%]" >
          <img src={messageTo?.profile_image} className="h-[64px] aspect-square rounded-[50%] " alt="" />
        </div>
        </div>
      </div>      
      <main className="flex flex-col w-[100%] lg:w-[65%] overflow-hidden p-[10px] h-[100%] gap-[10px]">
        <section ref={messageChat} className="flex flex-col-reverse flex-grow  w-[100%] h-[500px] relative overflow-y-auto chatScroll " >
            {chatMessages}
        </section>
        <div className="flex gap-[1%]  " >
            <div className="bg-slate-300 rounded-[40px]  px-[16px] py-[8px] flex-grow " >
                <input ref={chatInput} className="w-[100%] bg-transparent outline-none text-neutral-900 text-[16px] lg:text-[20px] " type="text" />
            </div>
            <button className="flex items-center justify-center rounded-[40px] w-[48px] h-[40px]  " onClick={()=>{sendMessage()}} >
                <FiSend style={{color:'#fab907',width:'33px',height:'33px'}} />
            </button>
        </div>
      </main>
    </section>
  );
}

export default Messenger;
