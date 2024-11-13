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

  return (
    <div
      onClick={onClick}
      className={`flex h-[20%] p-[20px] gap-[20px] hover:bg-[#161d2f8e] ${isSelected ? "bg-[#0a173a8e]" : ""}`}
    >
      <img src={otherPlayer.profile_image} className="h-[100%] aspect-square rounded-[50%]" alt="Profile" />
      <div className="flex flex-col gap-[10px] justify-center items-start">
        <div className="flex items-end">
          <h1 className="text-[20px] text-[#fff] mr-[2px] cursor-pointer " onClick={goToProfile} >{otherPlayer.user.username}</h1>
          <h2 className="text-[14px] text-[#ffffff57]">
            ({otherPlayer.user.first_name} {otherPlayer.user.last_name})
          </h2>
        </div>
        <p className="text-[14px] text-[#fff]">
          {item.last_message?.sender ? "you: " : `${otherPlayer.user.username}: `}
          {item.last_message?.body}
        </p>
      </div>
    </div>
  );
});

export default MessageItem;
