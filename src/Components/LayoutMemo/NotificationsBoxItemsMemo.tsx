/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { memo } from "react";
import Cookies from "js-cookie";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
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

interface NotificationsBoxItemsProps {
    item: Message;
    i: number;
    goProfile: (e: any, id: number) => void;
    messageContent: (body: string) => string;
    timeAgo: (timestamp: string) => string;
    navigate: (path: string) => void;
    notifications: Message[];
    setNotifications: (notifications: Message[]) => void;
    setUnReadNotifications: (updater: (prev: number) => number) => void;
    setOpenResultBox: (openResultBox: boolean) => void;
}

const NotificationsBoxItemsMemo = memo(({item,i,goProfile,messageContent,timeAgo,navigate,notifications,setNotifications,setUnReadNotifications,setOpenResultBox}:NotificationsBoxItemsProps) => {
    const message = () => {
        switch (item.type) {
          case "INV":
            return "invited you";
          case "MSG":
            return "sent you a message.";
          case "REJ":
            return "rejected your invitation.";
          case "ACP":
            return "accepted your invitation.";
          case "GSE":
              return "enter the result of the game.";
          case "SPW":
            return item.body
          default:
            return "contacted you";
        }
      };

      const ReadNotifications = async()=>{
        const token = Cookies.get("token");
        // axios.put(`https://strikem.site/api/notifications/${item.id}/`,
        axios.put(`http://localhost:5100/api/notifications/${item.id}/`,
        {
          headers: { Authorization: `JWT ${token}` },
        },{})
      }

      const handleNotificationClick = () => {

        if (item.type == "INV") {
          navigate(`/matchmake`);
        } else if (item.type == "MSG") {
          navigate(`/messenger`);
          localStorage.setItem("matchUpId", item.extra);
        } else if (item.type == "REJ") {
          navigate(`/matchmake`);
        } else if (item.type == "ACP") {
          // The backend doesn't hand back a matchup id for ACP notifications directly (unlike MSG's
          // item.extra) - but accepting an invite creates the matchup in the same transaction as
          // this notification, so it's guaranteed to already exist by the time this is clickable.
          // Messenger.tsx looks it up by the other player's id instead of a matchup id.
          navigate(`/messenger`);
          localStorage.setItem("matchUpId", "");
          localStorage.setItem("openChatWithPlayerId", `${item.sent_by.id}`);
        } else if (item.type == "GSE") {
          localStorage.setItem("sessionId", item.extra);
          setOpenResultBox(true);
        }

        // Was: only the API call (ReadNotifications) ran - nothing updated the notifications array
        // or unReadNotifications count held by the parent, so the background/bold styling and the
        // header's red count badge both stayed stuck until the next full refetch. Mirrors the same
        // fix already applied to the chat list (Messenger.tsx's readChat).
        if (!item.read) {
          ReadNotifications();
          setNotifications(notifications.map((n) => n.id === item.id ? { ...n, read: true } : n));
          setUnReadNotifications((prev) => Math.max(0, prev - 1));
        }
      }

      return (
        <div
          className={` cursor-pointer flex items-center gap-[10px] w-[100%] h-[25%] ${
            notifications.length == 1?
            " rounded-[10px]"
            :
            i == notifications.length - 1
              ? ""
              : "border-b-[1px] border-b-[#243257d5] "
          } p-[12px] md:p-[14px] lg:p-4 ${item.read ? "" : "bg-[#1d2b4f]"} `}
          onClick={handleNotificationClick}
        >
          <img
            src={item?.sent_by?.profile_image}
            className={`h-[95%] aspect-square rounded-[50%] ${item.type == "GSE" || item.type == "SPW" && "hidden"} `}
            alt=""
            onClick={(e) => {
              goProfile(e, item.sent_by.id);
            }}
          />
          <div className="flex flex-col md:gap-[4px] ">
            <h1
              className="text-white"
              style={{ fontSize: window.innerWidth >= 768 ? 18 : 14, lineHeight: "normal", fontWeight: 400 }}
            >
              {item.type != "GSE" && item.type != "SPW" && item.sent_by.user.username} {message()}
            </h1>
            <div className="flex gap-[3px]  ">
              <p
                className={`${
                  item.type == "MSG" ? "" : " hidden "
                } text-[10px] md:text-[14px] text-white`}
              >
                {messageContent(item.body)}
              </p>
              <p
                className={`text-[10px] md:text-[14px] !text-muted-grey-2 `}
              >
                {" "}
                {timeAgo(item.timestamp)}{" "}
              </p>
            </div>
          </div>
        </div>
      );
});

export default NotificationsBoxItemsMemo;