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
import { chatMessage } from "../type";
import { API_BASE_URL } from "../config";

export interface Message {
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
  const { sendJsonMessage, subscribe } = useWebSocketContext();

  const naviagte = useNavigate();

  const [isSwiped, setIsSwiped] = useState(false);

  const messageChat = useRef<HTMLSelectElement|null>(null);
  const chatBox = useRef<HTMLElement|null>(null)
  const messengersBox = useRef<HTMLDivElement|null>(null)

  

  // const location = useLocation()
  const [nextMessages, setNextMessages] = useState<string | null>(null);
  const [nextChats, setNextChats] = useState<string | null>(null);

  const [addNextChat, setAddNextChat] = useState<boolean>(false);
  const [addNextMessages, setAddNextMessages] = useState<boolean>(false);


  const [messages, setMessages] = useState<Message[]>([]);
  const [openChat, setOpenChat] = useState<string>("");
  const [chat, setChat] = useState<chatMessage[]>([]);

  // Same pattern as boxHeight above: read the initial value straight from localStorage instead of
  // setting it from inside the mount effect. setMessageTo is still called elsewhere as normal
  // (selecting a chat, the effect's own cleanup) - only this one "what's the starting value" read
  // moves.
  const [messageTo, setMessageTo] = useState<any|null>(() => {
    const localMessageTo = localStorage.getItem("MessageTo");
    return localMessageTo ? JSON.parse(localMessageTo) : null;
  });

  // Computed up front as the initial value (same formula setChatBoxHeight below uses) instead of
  // being set from inside the mount effect - avoids an extra render on mount for a value that's
  // knowable immediately. The resize listener further down still calls setChatBoxHeight()
  // imperatively on actual resize events, which is the correct/expected pattern (setState from
  // inside a subscribed callback), so that part is untouched.
  const [boxHeight, setBoxHeight] = useState<number>(() =>
    window.innerWidth > 768 ? window.innerHeight - 160 : window.innerHeight - 97
  );

  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();

  const chatInput = useRef<HTMLInputElement|null>(null);

  const token = Cookies.get("token");
  const MatchUpId = localStorage.getItem("matchUpId"); 
  const messagesFetch = useCallback(
    async (id: string) => {
      try {
        const Chatresponse = await axios(
          `${API_BASE_URL}/api/matchups/${id}/chat/`,
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
            // This used to only flip `read` in local state, so the sidebar looked read but the
            // server's shared Read flag on the matchup was never actually updated - the header
            // badge stayed stuck unread and the next page load reverted the sidebar too. Mirror
            // readChat()'s real persistence (PUT read-matchup + decrement the badge) whenever
            // sending a message is what's clearing a conversation that was actually unread.
            if (!chat.read) {
              axios
                .put(
                  `${API_BASE_URL}/api/read-matchup/${chat.id}/`,
                  {},
                  { headers: { Authorization: `JWT ${token}` } }
                )
                .catch((err) => console.log(err));
              dispatch(unReadMatchupDecrement());
            }
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
      `${API_BASE_URL}/api/read-matchup/${id}/`,
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
    const Fetch = async () => {
      try {
        const response = await axios(`${API_BASE_URL}/api/matchups/`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setNextMessages(response.data.next);
        setMessages(response.data.results);
        if (response.data.results.length > 0) {
          if(MatchUpId){
            messagesFetch(MatchUpId);
          } else {
            // Set by an "ACP" (invitation accepted) notification click - there's no matchup id
            // handy there (unlike MSG's item.extra), only the other player's id, so find the
            // matchup that pairs them with the current user instead. The matchup is guaranteed to
            // already exist by the time this notification is clickable - it's created in the same
            // backend transaction as the notification itself.
            const openWithPlayerId = localStorage.getItem("openChatWithPlayerId");
            if (openWithPlayerId) {
              const match = response.data.results.find((m: Message) =>
                `${m.player_accepting.id}` == openWithPlayerId || `${m.player_inviting.id}` == openWithPlayerId
              );
              if (match) {
                const otherPlayer = match.player_accepting.id === currentUser.id ? match.player_inviting : match.player_accepting;
                setOpenChat(match.id);
                localStorage.setItem("matchUpId", match.id);
                messagesFetch(match.id);
                setMessageTo(otherPlayer);
                localStorage.setItem("MessageTo", JSON.stringify(otherPlayer));
              }
              localStorage.setItem("openChatWithPlayerId", "");
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    Fetch();

    window.addEventListener("resize", () => {
      setChatBoxHeight();
    });

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
      const addChats = async () => {
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
      };
      addChats();
    }
  }, [addNextChat]);

  useEffect(()=>{
    if (addNextMessages) {
      const addMessages = async () => {
        if (!nextMessages) return;
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
      };
      addMessages();
    }
  },[addNextMessages])

  useEffect(() => {
    const unsubscribe = subscribe((data: any) => {
      // sendMessage() already adds the message to chat/messages optimistically the instant you
      // hit send, before the server round-trip. The backend then broadcasts it back to the
      // sender too, so without this guard it gets added a second time here - this is what was
      // causing the duplicate bubble.
      if (data.sender_player_id == currentUser.id) return;

      if (data.matchup_id == MatchUpId) {
        const lastMessage = {
          body: data.message,
          sender: {
            id: data.sender_player_id,
          },
          time_sent: data?.getFormattedTime,
        };
        const chatContent = [lastMessage, ...chat];
        setChat(chatContent);

        if (messages.length == 0) return;
        const MessagesList: any = [...messages];
        for (let i = 0; i < MessagesList?.length; i++) {
          if (MessagesList[i].id == data.matchup_id) {
            const [chat] = MessagesList.splice(i, 1);

            chat.last_message = {body:data.message,sender:{id:data.sender_player_id,user:{username:data.username}}};
            chat.read = false;
            MessagesList.splice(0, 0, chat);
          }
        }

        setMessages(MessagesList);
      } else {
        if (messages.length == 0) return;
        const MessagesList: any = [...messages];
        for (let i = 0; i < MessagesList?.length; i++) {
          if (MessagesList[i].id == data.matchup_id) {
            const [chat] = MessagesList.splice(i, 1);

            chat.last_message = {body:data.message,sender:{id:data.sender_player_id,user:{username:data.username}}};
            chat.read = false;
            MessagesList.splice(0, 0, chat);
          }
        }
        setMessages(MessagesList);
      }
    });
    return unsubscribe;
    // Re-subscribes (fresh closure) whenever chat/messages/MatchUpId change, matching the
    // freshness the old useEffect(..., [lastJsonMessage]) got "for free" (a new effect closure is
    // created every render either way - the old version just gated *invocation* on
    // lastJsonMessage changing, while this gates *re-subscription* on these instead, since
    // subscribe() itself never changes and would otherwise pin this to a stale mount-time
    // closure forever).
  }, [subscribe, chat, messages, MatchUpId]);

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
            // Was: a comma-operator expression that dispatched unReadMatchupDecrement()
            // unconditionally on every click, regardless of whether readChat() (the actual
            // backend "mark as read" call) even ran - so the badge count would drop locally
            // without the server's own count ever actually changing, then reappear on refresh.
            // Also dropped the "skip readChat if I sent the last message" shortcut - confirmed
            // live that a conversation can still be server-side unread even when its last message
            // is mine, so that shortcut could leave a genuinely-unread conversation stuck unread
            // forever. Now: only mark as read (both the API call and the local counter) when the
            // conversation wasn't already read.
            if (!item.read) {
              readChat(item.id);
              dispatch(unReadMatchupDecrement());
            }
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
        <div className="flex items-center text-white h-full  ">
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
              className="text-white text-[16px] md:text-[24px] cursor-pointer "
              onClick={() => {
                naviagte(`/users/${messageTo.id}`);
                localStorage.setItem("matchUpId", "");
              }}
            >
              {messageTo?.user.username}
            </h1>
            <h2 className="!text-faint-white text-[16px] md:text-[24px] ">
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
              <p className="text-[24px] !text-brand-gold" >Chose chat</p>
                            
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
