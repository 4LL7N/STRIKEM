import React from "react";

interface Message {
  id: string;
  last_message?: {
    body: string;
  };
  player_accepting: {
    id?: number;
    profile_image: string;
    total_points?: number;
    user: {
      email?: string;
      first_name?: string;
      id?: number;
      last_name?: string;
      username: string;
    };
  };
  player_inviting: {
    id?: number;
    profile_image: string;
    total_points?: number;
    user: {
      email?: string;
      first_name?: string;
      id?: number;
      last_name?: string;
      username: string;
    };
  };
}

const MatchMakesCard = React.memo(
  ({ i, length, item }: { i: number; length: number; item: Message }) => {
    return (
      <div
        className={`flex p-[20px] h-[50%] justify-between ${
          i != length - 1 || length < 5
            ? "border-b-[1px] border-b-[#243257d5]"
            : ""
        } `}
      >
        <div className="flex flex-col h-[100%] gap-[10%] justify-center items-center  min-w-[74px] md:min-w-[96px] ">
          <img
            src={item.player_accepting.profile_image}
            className="rounded-[50%] h-[70%] aspect-square "
            alt="image"
          />
          <h1 className="text-[12px] md:text-[16px] text-[#fff] ">
            {item.player_accepting.user.username}
          </h1>
        </div>
        <div className="flex flex-col gap-[5px] items-center w-[100%] "></div>
        <div className="flex flex-col h-[100%] gap-[10%] justify-center items-center  min-w-[74px] md:min-w-[96px] ">
          <img
            src={item.player_inviting.profile_image}
            className="rounded-[50%] aspect-square h-[70%] "
            alt="image"
          />
          <h1 className="text-[12px] md:text-[16px] text-[#fff] ">
            {item.player_inviting.user.username}
          </h1>
        </div>
      </div>
    );
  }
);

export default MatchMakesCard;
