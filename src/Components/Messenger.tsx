/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";

import "./CSS/messenger.css";
import { FiSend } from "react-icons/fi";
import { useWebSocketContext } from "./Websocket";
import ChatBubble from "./MessengerMemo/ChatBubble";
import MessageItem from "./MessengerMemo/MessageItem";
import { useLocation } from "react-router-dom";

interface chatMessage {
    after_outdated?: boolean;
    body: string;
    id?: number;
    sender: Sender;
    time_sent?: string;
  }
  
  interface Sender {
    id?: number;
    profile_image: string;
    total_points: number;
    user: User;
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

    const location = useLocation()
    
  const [messages, setMessages] = useState<Message[]>();
  const [openChat,setOpenChat] = useState<string>('')
  const [chat,setChat] = useState<chatMessage[]>([])
    const [opponentUsername,setOpponentUsername] = useState<string>('')

  const messengerRef = useRef<any>();
    const chatInput = useRef<any>()

    const token = Cookies.get("token");
  const Fetch = async () => {
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
        let currentUser: any = localStorage?.getItem("currentUser");
          currentUser
            ? (currentUser = JSON.parse(currentUser))
            : (currentUser = null);
          const otherPlayer =
          response.data.results[0].player_accepting.id == currentUser?.id
              ? response.data.results[0].player_inviting
              : response.data.results[0].player_accepting;
            setOpponentUsername(otherPlayer.user.username)
      }
      const matchUpId = localStorage.getItem('matchUpId')
      const Chatresponse = await axios(
        `https://strikem.site/api/matchups/${matchUpId?matchUpId:openChat?openChat:response.data.results[0].id}/chat/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      setChat(Chatresponse.data.results)
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
        setChat(Chatresponse.data.results);
    } catch (err) {
        console.log(err);
    }
}, [token, setChat]);

  const getFormattedTime = useMemo(() => {
    const date = new Date();
  
    // Format date to `YYYY-MM-DDTHH:MM:SS.ssssss`
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
    let currentUser: any = localStorage?.getItem("currentUser");
          currentUser
            ? (currentUser = JSON.parse(currentUser))
            : (currentUser = null);
    if(currentUser && chatInput.current && chatInput.current.value){
    sendJsonMessage({
        'action': 'matchup',
       'message': chatInput.current.value,
       'username': currentUser.user.username,
       'opponent_username': opponentUsername,
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

    setTimeout(() => {
      messengerRef.current.style.height = `${
        window.innerHeight -
        messengerRef.current?.getBoundingClientRect().top -
        32
      }px`;
      if(location.state?.matchUpId){
        setOpenChat(location.state.matchUpId)
      }else{
      messages?setOpenChat(messages[0]?.id):null
      }
    }, 100);
  }, []);


  useEffect(()=>{
    console.log(lastJsonMessage)

    let currentUser: any = localStorage?.getItem("currentUser");
          currentUser
            ? (currentUser = JSON.parse(currentUser))
            : (currentUser = null);
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
  },[lastJsonMessage])

  const messagesList = useMemo(() => {
    return messages?.map((item: Message) => {
        return (
            <MessageItem
        key={item.id}
        item={item}
        isSelected={openChat === item.id}
        onClick={() => {
          setOpenChat(item.id);
          messagesFetch(item.id);
        }}
      />
        );
    });
}, [messages, openChat, messagesFetch]);

const chatMessages = useMemo(() => {
    
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser = currentUser ? JSON.parse(currentUser) : null;
    return chat?.map((item: chatMessage, i: number) => {

        const author = item?.sender.id === currentUser.id

        let rounded = "rounded-[40px]";
        if(author){
        if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
            rounded = chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
                ? "rounded-[40px_0px_0px_40px]"
                : "rounded-[40px_40px_0px_40px]";
        } else if (chat[i - 1] && chat[i].sender?.id === chat[i - 1]?.sender.id) {
            rounded = "rounded-[40px_0px_40px_40px]";
        }
        }else{
            if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
                rounded = chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
                    ? "rounded-[0px_40px_40px_0px]"
                    : "rounded-[40px_40px_40px_0px]";
            } else if (chat[i - 1] && chat[i].sender?.id === chat[i - 1]?.sender.id) {
                rounded = "rounded-[0px_40px_40px_40px]";
            }
        }

        const margin = i === 0
            ? "mt-[0px]"
            : chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
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
      ref={messengerRef}
      className="flex-grow flex    border-[1px] border-[#243257d5]  rounded-[20px] overflow-hidden "
    >
      <div className=" w-[35%] border-r border-r-[#243257d5]  h-[100%] overflow-y-auto chatScroll ">
        {messagesList}
      </div>
      <main className="flex flex-col w-[65%] overflow-hidden p-[10px] h-[100%] gap-[10px]">
        <section className="flex flex-col flex-grow justify-end w-[100%] h-[100%]  relative overflow-y-auto " >
            {chatMessages}
        </section>
        <div className="flex gap-[1%]  " >
            <div className="bg-slate-300 rounded-[40px] px-[16px] py-[8px] flex-grow " >
                <input ref={chatInput} className="w-[100%] bg-transparent outline-none text-neutral-900 text-[20px] " type="text" />
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
