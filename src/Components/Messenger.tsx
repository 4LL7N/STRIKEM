/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";

import "./CSS/messenger.css";
import { FiSend } from "react-icons/fi";
import { useWebSocketContext } from "./Websocket";
import ChatBubble from "./MessengerMemo/ChatBubble";
import MessageItem from "./MessengerMemo/MessageItem";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegMessage } from "react-icons/fa6";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAppDispatch, useAppSelector } from "../ReduxStore/ReduxHooks";
import { unReadMatchupDecrement } from "../ReduxStore/features/unReadMatchups";

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
  read: boolean;
}

function Messenger() {
  const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();

  const naviagte = useNavigate();

  const [isSwiped, setIsSwiped] = useState(false);

  const messageChat = useRef<any>();
  const chatBox = useRef<any>();
  const messengersBox = useRef<any>();

  

  // const location = useLocation()
  const [nextMessages, setNextMessages] = useState<string | null>(null);
  const [nextChats, setNextChats] = useState<string | null>(null);

  const [addNextChat, setAddNextChat] = useState<boolean>(false);
  const [addNextMessages, setAddNextMessages] = useState<boolean>(false);


  const [messages, setMessages] = useState<Message[]>([]);
  const [openChat, setOpenChat] = useState<string>("");
  const [chat, setChat] = useState<chatMessage[]>([]);

  const [messageTo, setMessageTo] = useState<any|null>(null);

  const [boxHeight, setBoxHeight] = useState<number>(0);

  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();

  const chatInput = useRef<any>();

  const token = Cookies.get("token");
  const MatchUpId = localStorage.getItem("matchUpId"); 
  const Fetch = async () => {
    
   
    try {
      const response = await axios("https://strikem.site/api/matchups/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      setNextMessages(response.data.next);
      setMessages(response.data.results);
      if (response.data.results.length > 0) {
        
         
        if(MatchUpId){
          messagesFetch(MatchUpId);
        }
       
      }
    } catch (err) {
      console.log(err);
    }
  };



  const messagesFetch = useCallback(
    async (id: string) => {
      try {
        const Chatresponse = await axios(
          `https://strikem.site/api/matchups/${id}/chat/`,
          { headers: { Authorization: `JWT ${token}` } }
        );
        const chatData = Chatresponse.data.results;
        const nextChatsEndpoint = Chatresponse.data.next;
        
        
        setNextChats(nextChatsEndpoint);
        setChat(chatData);
      } catch (err) {
        console.log(err);
      }
    },
    [token, setChat]
  );


  const sendMessage = () => {
    if (
      currentUser &&
      chatInput.current &&
      chatInput.current.value &&
      chatInput.current.value.trim()
    ) {
      sendJsonMessage({
        action: "matchup",
        message: chatInput.current.value,
        username: currentUser.user.username,
        opponent_username: messageTo.user.username,
        matchup_id: MatchUpId,
      });
      console.log(chat);
      
      dayjs.extend(utc);
      dayjs.extend(timezone);
      dayjs.extend(customParseFormat);

// Get the current time with timezone offset
      const currentTime = dayjs().tz(dayjs.tz.guess()).format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ');

      const user = { ...currentUser.user };
      const newMessage = {
        after_outdated:false,
        body: chatInput.current.value,
        sender: {
          id: currentUser.id,
          profile_image: currentUser.profile_image,
          total_points: currentUser.total_points,
          user,
        },
        time_sent: currentTime,
      };
      console.log(dayjs().diff(chat[0].time_sent,"minute"),dayjs().diff(chat[0].time_sent,"minute") >=20,"123123");
      
      if(chat.length == 0 || dayjs().diff(chat[0].time_sent,"minute") >=20) {
        console.log("asdasd");
        
        newMessage.after_outdated = true;
      }
      
      const chatContent = [newMessage, ...chat];
      setChat(chatContent);

      if(messages.length == 0) {
        chatInput.current.value = ""
        return;
      } 
      
      const MessagesList: any = [...messages];
        for (let i = 0; i < MessagesList?.length; i++) {
          if (MessagesList[i].id == MatchUpId) {
            const [chat] = MessagesList.splice(i, 1);
            const newChat = {...chat}
            
            newChat.last_message = {body:chatInput.current.value,sender:{id:currentUser.id,user:{username:currentUser.user.username}}};
            // ?chat.last_message.body = chatInput.current.value:null
            newChat.read = true;
            
            MessagesList.splice(0, 0, newChat);
            
          }
        }
        
        setMessages(MessagesList);
      chatInput.current.value = "";

    }
  };

  const setChatBoxHeight = () => {
    if(window.innerWidth > 768){
    setBoxHeight(window.innerHeight - 160);
    }else{      
      setBoxHeight(window.innerHeight - 97);
    }
  };

  const readChat = async (id: string) => {
    await axios.put(
      `https://strikem.site/api/read-matchup/${id}/`,
      {},
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );
    const allChats = messages && [...messages];
    allChats?.forEach((item) => {
      if (item.id == id) item.read = true;
    });
    setMessages(allChats);
  };

  const addChats = async () => {
    
    if (nextChats) {
      try {
        const ChatResponse = await axios(nextChats, {
          headers: { Authorization: `JWT ${token}` },
        });
        
        const chatData = ChatResponse.data.results;
        const nextChatsEndpoint = ChatResponse.data.next;
        const newChat = [...chat,...chatData];
        setNextChats(nextChatsEndpoint);
        setChat(newChat);
        
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addMessages = async () => {
    
    if (nextMessages) {
      try {
        const MessagesResponse = await axios(nextMessages, {
          headers: { Authorization: `JWT ${token}` },
        });
        const messagesData = MessagesResponse.data.results;
        const newMessages = [...messages,...messagesData];
        setMessages(newMessages);
      } catch (err) {
        console.log(err);
      }
    }
  };


  const handleChatScroll = (e: any) => {
    const target = e.target as HTMLElement;

    const onTopOne= (target.scrollHeight - -target.scrollTop) -2 < target.clientHeight;
    if (onTopOne ) {
      setAddNextChat(true);
    } else {
      setAddNextChat(false);
    }
  };

  const handleMessagesScroll = (e: any) => {
    const target = e.target as HTMLElement;
    
    const onBottomOne =
      Math.floor(target.scrollHeight - target.scrollTop) ==
      target.clientHeight;
    const onBottomTwo =
      Math.floor(target.scrollHeight - -target.scrollTop) ==
      target.clientHeight - 1;      
    if (onBottomOne || onBottomTwo){
      setAddNextMessages(true)
    }else{
      setAddNextMessages(false)
    }
  };

  useEffect(() => {
    Fetch();

    setChatBoxHeight();

    window.addEventListener("resize", () => {
      setChatBoxHeight();
    });

    
    const localMessageTo = localStorage.getItem("MessageTo");
    localMessageTo ? setMessageTo(JSON.parse(localMessageTo)) : null;

    if (messageChat.current && messengersBox.current) {
      messageChat.current.scrollTop = messageChat.current.scrollHeight;
      messageChat.current.addEventListener("scroll", handleChatScroll);
      messengersBox.current.addEventListener("scroll", handleMessagesScroll);
    }

    return () => {
      setMessageTo(null)
      localStorage.removeItem("MessageTo");
    }
  }, []);


  useLayoutEffect(() => {
    if (messageChat.current) {
      messageChat.current.scrollTop = messageChat.current.scrollHeight;
    }
  }, []);

  useEffect(() => {    
    
    if (addNextChat && nextChats) {
      addChats();
    }
  }, [addNextChat]);

  useEffect(()=>{
    if (addNextMessages) {
      addMessages();
    }
  },[addNextMessages])

  useEffect(() => {
    
    if (lastJsonMessage) {
      console.log(lastJsonMessage);
      
      if (lastJsonMessage.matchup_id == MatchUpId) {
        const lastMessage = {
          body: lastJsonMessage.message,
          sender: {
            id: lastJsonMessage.sender_player_id,
          },
          time_sent: lastJsonMessage?.getFormattedTime,
        };
        const chatContent = [lastMessage, ...chat];
        setChat(chatContent);
        
        if (messages.length == 0) return;
        const MessagesList: any = [...messages];
        for (let i = 0; i < MessagesList?.length; i++) {
          if (MessagesList[i].id == lastJsonMessage.matchup_id) {
            const [chat] = MessagesList.splice(i, 1);
            
            chat.last_message = {body:lastJsonMessage.message,sender:{id:lastJsonMessage.sender_player_id,user:{username:lastJsonMessage.username}}};
            chat.read = false;
            MessagesList.splice(0, 0, chat);
          }
        }

        setMessages(MessagesList);
      } else {
        if (messages.length == 0) return;
        const MessagesList: any = [...messages];
        for (let i = 0; i < MessagesList?.length; i++) {
          if (MessagesList[i].id == lastJsonMessage.matchup_id) {
            const [chat] = MessagesList.splice(i, 1);
            
            chat.last_message = {body:lastJsonMessage.message,sender:{id:lastJsonMessage.sender_player_id,user:{username:lastJsonMessage.username}}};
            chat.read = false;
            MessagesList.splice(0, 0, chat);
          }
        }
        setMessages(MessagesList);
      }
    }
  }, [lastJsonMessage]);

  const messagesList = useMemo(() => {
    return messages?.map((item: Message) => {
      const otherPlayer =
        item.player_accepting?.id == currentUser?.id
          ? item.player_inviting
          : item.player_accepting;
      
      return (
        <MessageItem
          key={item.id}
          item={item}
          isSelected={openChat === item.id}
          onClick={() => {
            setOpenChat(item.id);
            localStorage.setItem("matchUpId", `${item.id}`);
            messagesFetch(item.id);
            setMessageTo(otherPlayer);
            localStorage.setItem("MessageTo", JSON.stringify(otherPlayer));
            if (window.innerWidth < 1024) {
              setIsSwiped(false);
            }
            sendJsonMessage({
              action: "change_matchup",
              matchup_id: item.id,
            });
            item.last_message?.sender?.id === currentUser?.id || item.read?null: readChat(item.id),dispatch(unReadMatchupDecrement());
          }}
          goToProfile={(e) => {
            e.stopPropagation();
            localStorage.setItem("matchUpId", "");
            naviagte(`/users/${otherPlayer.id}`);
          }}
        />
      );
    });
  }, [messages, openChat, messagesFetch]);

  const chatMessages = useMemo(() => {
    return chat?.map((item: chatMessage, i: number) => {
      const author = item?.sender?.id === currentUser?.id;

      let rounded = "rounded-[40px]";
      // let timeAppear = false
      if (author) {
        if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
          rounded =
            chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
              ?
                item.after_outdated
                  ?
                    chat[i-1].after_outdated
                      ?
                        "rounded-[40px_40px_40px_40px]"
                      :
                        "rounded-[40px_40px_0px_40px]"
                  : 
                    chat[i-1].after_outdated
                      ?
                        "rounded-[40px_0px_40px_40px]"
                      :
                        "rounded-[40px_0px_0px_40px]"
              : 
                item.after_outdated
                  ?
                    "rounded-[40px_40px_40px_40px]"
                  :
                    "rounded-[40px_0px_40px_40px]";
        } else if (
          chat[i - 1] &&
          chat[i].sender?.id === chat[i - 1]?.sender.id
        ) {
          rounded = 
            chat[i-1].after_outdated
              ?
                "rounded-[40px_40px_40px_40px]"
              :
                "rounded-[40px_40px_0px_40px]";
        }
      } else {
        if (chat[i + 1] && chat[i]?.sender.id === chat[i + 1]?.sender.id) {
          rounded =
            chat[i - 1] && chat[i]?.sender.id === chat[i - 1]?.sender.id
              ? 
                item.after_outdated
                  ?
                    chat[i-1].after_outdated
                      ?
                        "rounded-[40px_40px_40px_40px]"
                      :
                        "rounded-[40px_40px_40px_0px]"
                  :
                    chat[i-1].after_outdated
                      ?
                        "rounded-[0px_40px_40px_40px]"
                      :
                        "rounded-[0px_40px_40px_0px]"
              : 
                item.after_outdated
                  ?
                    "rounded-[40px_40px_40px_40px]"
                  :  
                    "rounded-[0px_40px_40px_40px]";
        } else if (
          chat[i - 1] &&
          chat[i].sender?.id === chat[i - 1]?.sender.id
        ) {
          rounded = 
            chat[i-1].after_outdated
              ?
                "rounded-[40px_40px_40px_40px]"
              :
                "rounded-[40px_40px_40px_0px]";
        }
      }

     

      const margin =
        i === chat.length - 1
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
          // timeAppear={timeAppear}
        />
      );
    });
  }, [chat]);

 

  return (
    <section
      style={{ height: `${boxHeight}px` }}
      className="lg:flex-grow flex flex-col lg:flex-row m-[10px] w-[100%] border-[1px] border-[#243257d5]  rounded-[20px] overflow-hidden relative  "
    >
      <div
        className={` lg:hidden absolute top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          isSwiped ? "translate-x-0" : "-translate-x-full"
        } w-full h-full bg-[#10141E] text-white `}
      >
        {messagesList}
      </div>
      <div
        ref={messengersBox}
        className="lg:flex lg:flex-col hidden w-[35%] border-r border-r-[#243257d5]  overflow-y-auto chatScroll  "
      >
        {messagesList}
      </div>
      <div className="flex justify-between items-center w-[100%] h-[84px] md:h-[128px] border-b-[1px] border-b-[#243257d5] p-[10px] md:p-[16px] lg:hidden ">
        <div className="flex items-center text-[#fff] h-full  ">
          <FaArrowLeft
            style={{ color: "white" }}
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
            onClick={() => {
              setIsSwiped((i) => !i);
            }}
          />
        </div>
        {messageTo ?
        <div className="flex gap-[10px] h-[100%] ">
          <div className=" flex flex-col h-[100%] justify-evenly items-end ">
            <h1
              className="text-[#fff] text-[16px] md:text-[24px] cursor-pointer "
              onClick={() => {
                naviagte(`/users/${messageTo.id}`);
                localStorage.setItem("matchUpId", "");
              }}
            >
              {messageTo?.user.username}
            </h1>
            <h2 className="text-[#ffffff57] text-[16px] md:text-[24px] ">
              ({messageTo?.user.first_name} {messageTo?.user.last_name})
            </h2>
          </div>
          <div className="h-[100%]">
            <img
              src={messageTo?.profile_image}
              className="h-[64px] md:h-[96px] aspect-square rounded-[50%] "
              alt=""
            />
          </div>
        </div>
        :null}
      </div>
      <main
        ref={chatBox}
        className="flex flex-col w-[100%] lg:w-[65%] overflow-hidden p-[10px] h-[100%] gap-[10px]"
      >
        <section
          ref={messageChat}
          // style={{ height: `${chatHeight}px` }}
          className="flex flex-col-reverse flex-grow  w-[100%] relative overflow-y-auto chatScroll "
        >
          {!MatchUpId && !messageTo ? (
            <div className="flex flex-col justify-center items-center h-[100%]  ">
              <FaRegMessage style={{ color: "#fab907", width: "118px", height: "118px" }}/>
              <p className="text-[24px] text-[#fab907]" >Chose chat</p>
                            
            </div>
          ) : null}
          {chatMessages}
        </section>
        { MatchUpId && messageTo ?
          <div className="flex gap-[1%] h-[46px] ">
          <div className="bg-slate-300 rounded-[40px]  px-[16px] py-[8px] flex-grow ">
            <input
              ref={chatInput}
              className="w-[100%] bg-transparent outline-none text-neutral-900 text-[16px] lg:text-[20px] "
              type="text"
            />
          </div>
          <button
            className="flex items-center justify-center rounded-[40px] w-[48px] h-[40px]  "
            onClick={() => {
              sendMessage();
            }}
          >
            <FiSend
              style={{ color: "#fab907", width: "33px", height: "33px" }}
            />
          </button>
        </div>
        :null}
      </main>
    </section>
  );
}

export default Messenger;
