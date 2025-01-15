/* eslint-disable @typescript-eslint/no-explicit-any */
// MessageItem.tsx
import React from 'react';

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
    read:boolean
  }
  

interface MessageItemProps {
  item: Message;
  isSelected: boolean;
  onClick: () => void;
  goToProfile: (e:any) => void;
}

const MessageItem = React.memo(({ item, isSelected, onClick,goToProfile }: MessageItemProps) => {
  const currentUser = JSON.parse(localStorage?.getItem("currentUser") || '{}');
  const otherPlayer = item.player_accepting.id === currentUser.id ? item.player_inviting : item.player_accepting;
  console.log(item.last_message?.sender.id == currentUser.id,"asdaf",item,currentUser);
  
  return (
    <div
      onClick={onClick}
      className={`flex h-[124px] lg:h-[132px] p-[20px] gap-[20px] hover:bg-[#161d2f8e] ${isSelected ? "bg-[#0a173a8e]" : ""}`}
    >
      <img src={otherPlayer.profile_image} className="h-[100%] aspect-square rounded-[50%]" alt="Profile" />
      <div className="flex flex-col gap-[10px] justify-center items-start">
        <div className="flex items-end">
          <h1 className={` text-[16px] md:text-[24px] text-[#fff] mr-[2px] cursor-pointer ${item.last_message?.sender.id == currentUser.id ?'font-normal': item.read?'font-normal':'font-bold'} `} onClick={goToProfile} >{otherPlayer.user.username}</h1>
          <h2 className={` text-[14px]  text-[#ffffff57] ${item.last_message?.sender.id == currentUser.id ?'font-normal': item.read?'font-normal':'font-bold'} `}>
            ({otherPlayer.user.first_name} {otherPlayer.user.last_name})
          </h2>
        </div>
        <p className={`text-[14px] md:text-[18px] text-[#fff] ${item.last_message?.sender.id == currentUser.id ?'font-normal': item.read?'font-normal':'font-bold'} `}>
          {item.last_message?.sender.id == currentUser.id ? "you: " : `${item.last_message?.sender.user.username}: `}
          {item.last_message?.body?item.last_message?.body:""}
        </p>
      </div>
    </div>
  );
});

export default MessageItem;
