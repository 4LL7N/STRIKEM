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
        <div className="flex flex-col justify-center items-center gap-[6px] min-w-[74px] max-w-[35%] md:min-w-[96px] ">
          <img
            src={item.player_accepting.profile_image}
            className="rounded-[50%] h-[40px] md:h-[56px] aspect-square shrink-0"
            alt="image"
          />
          <h1 className="text-white w-full truncate" style={{ textAlign: "center", fontSize: window.innerWidth >= 768 ? 16 : 12, lineHeight: "normal", fontWeight: 400 }}>
            {item.player_accepting.user.username}
          </h1>
        </div>
        <div className="flex flex-col gap-[5px] items-center w-[100%] "></div>
        <div className="flex flex-col justify-center items-center gap-[6px] min-w-[74px] max-w-[35%] md:min-w-[96px] ">
          <img
            src={item.player_inviting.profile_image}
            className="rounded-[50%] aspect-square h-[40px] md:h-[56px] shrink-0"
            alt="image"
          />
          <h1 className="text-white w-full truncate" style={{ textAlign: "center", fontSize: window.innerWidth >= 768 ? 16 : 12, lineHeight: "normal", fontWeight: 400 }}>
            {item.player_inviting.user.username}
          </h1>
        </div>
      </div>
    );
  }
);

export default MatchMakesCard;
