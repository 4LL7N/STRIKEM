// ChatBubble.tsx
import React from "react";

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
  rounded: string;
  margin: string;
  timeAppear:boolean
}

const ChatBubble = React.memo(
  ({ item, isCurrentUser, rounded, margin,timeAppear }: ChatBubbleProps) => {
    const alignmentClass = isCurrentUser
      ? " bg-[#fab907] text-[#fff]"
      : " bg-slate-300 text-neutral-900";

    let formattedDate;
    if (item.time_sent) {
      const date = new Date(item.time_sent);

      // Format the date into a readable string
      formattedDate = date.toLocaleString("en-US", {
        year: "numeric", // e.g., "2024"
        month: "long", // e.g., "December"
        day: "numeric", // e.g., "4"
        hour: "2-digit", // e.g., "05"\
        minute: '2-digit',
        hour12: true, // 12-hour format, set to false for 24-hour format
      });

    }

    formattedDate?.replace("a",",")


    console.log(formattedDate)

    return (
      <div
        className={`w-[100%] relative flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } ${item.after_outdated && timeAppear ? ' pt-4 ' : ''} `}
      >
        { item.after_outdated && timeAppear && <p className=" text-gray-500 text-xs absolute left-[50%] translate-x-[-50%] translate-y-1/2 top-0 " >{formattedDate?.split(',')[1].split('at')[0]}/{formattedDate?.split(',')[0]}/{formattedDate?.split(',')[1].split('at')[1]}</p>}
        <div
          className={`max-w-[70%] px-[16px] py-[8px] ${margin} ${rounded} ${alignmentClass}`}
        >
          <p className="text-[20px]">{item.body}</p>
        </div>
      </div>
    );
  }
);

export default ChatBubble;
