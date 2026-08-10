// MessageItem.tsx
import React from 'react';
import { useAppSelector } from '../../ReduxStore/ReduxHooks';


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

 interface MessageItemProps {
  item: Message;
  isSelected: boolean;
  onClick: () => void;
  goToProfile: (e:React.MouseEvent<HTMLHeadingElement>) => void;
}

const MessageItem = React.memo(({ item, isSelected, onClick,goToProfile }: MessageItemProps) => {
  
  const currentUser = useAppSelector((state) => state.currentUser);
  const otherPlayer = item.player_accepting.id === currentUser.id ? item.player_inviting : item.player_accepting;
  // console.log(item.last_message?.sender.id == currentUser.id,"asdaf",item,currentUser);
  
  // Was: only isSelected got its own background - an unread (unseen) conversation looked
  // identical to a plain read one unless it happened to be the one currently open. isSelected
  // still wins if both are somehow true (e.g. reopening an unread chat before its read state
  // catches up locally).
  const isUnread = !item.read && item.last_message?.sender.id != currentUser.id;

  return (
    <div
      onClick={onClick}
      className={`flex h-[124px] lg:h-[132px] p-[20px] gap-[20px] hover:bg-[#161d2f8e] ${isSelected ? "bg-[#0a173a8e]" : isUnread ? "bg-[#1d2b4f]" : ""}`}
    >
      <img src={otherPlayer.profile_image} className="h-[100%] aspect-square rounded-[50%] shrink-0" alt="Profile" />
      <div className="flex flex-col gap-[10px] justify-center items-start min-w-0 flex-1">
        <div className="flex flex-col min-w-0 w-full">
          <h1
            className={`text-white truncate max-w-full cursor-pointer m-0 ${isUnread ? 'font-bold' : 'font-normal'} `}
            style={{ fontSize: window.innerWidth >= 768 ? 24 : 16, lineHeight: "normal" }}
            onClick={goToProfile}
          >{otherPlayer.user.username}</h1>
          <h2
            className={`truncate max-w-full !text-faint-white m-0 ${isUnread ? 'font-bold' : 'font-normal'} `}
            style={{ fontSize: 14, lineHeight: "normal" }}
          >
            ({otherPlayer.user.first_name} {otherPlayer.user.last_name})
          </h2>
        </div>
        <p className={`text-[14px] md:text-[18px] text-white truncate max-w-full ${isUnread ? 'font-bold' : 'font-normal'} `}>
          {item.last_message?item.last_message?.sender.id == currentUser.id ? "you: " : `${item.last_message?.sender.user.username}: `:""}
          {item.last_message?.body?item.last_message?.body:""}
        </p>
      </div>
    </div>
  );
});

export default MessageItem;
