// ChatBubble.tsx
import React from 'react';

interface User {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    username: string;
  }

interface Sender {
    id?: number;
    profile_image?: string;
    total_points?: number;
    user?: User;
  }

interface chatMessage {
    after_outdated?: boolean;
    body: string;
    id?: number;
    sender: Sender;
    time_sent?: string;
  }

interface ChatBubbleProps {
  item: chatMessage;
  isCurrentUser: boolean;
  rounded:string;
  margin:string
}

const ChatBubble = React.memo(({ item, isCurrentUser,rounded,margin }: ChatBubbleProps) => {
  const alignmentClass = isCurrentUser ? "self-end bg-[#fab907] text-[#fff]" : "self-start bg-slate-300 text-neutral-900";
  return (
    <div className={`max-w-[45%] px-[16px] py-[8px] ${margin} ${rounded} ${alignmentClass}`}>
      <p className="text-[20px]">{item.body}</p>
    </div>
  );
});

export default ChatBubble;
