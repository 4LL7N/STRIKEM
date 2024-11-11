import React from "react";

interface Invitation {
  id?: string;
  player_invited: {
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

const InvitationsCard = React.memo(
  ({
    i,
    length,
    item,
    acceptMatchMake,
    declineMatchMake,
  }: {
    i: number;
    length: number;
    item: Invitation;
    acceptMatchMake: (username: string) => void;
    declineMatchMake: (username: string) => void;
  }) => {
    return (
      <div
        className={`flex h-[50%] p-[20px] justify-between ${
          i != length - 1 || length < 5
            ? "border-b-[1px] border-b-[#243257d5]"
            : ""
        } `}
      >
        <div className="flex flex-col h-[100%] gap-[10%] justify-center items-center pr-[20px] mr-[20px] border-r-[1px] border-r-[#243257d5] min-w-[94px] md:min-w-[116px] ">
          <img
            src={item.player_inviting.profile_image}
            className="rounded-[50%] aspect-square h-[70%] "
            alt="image"
          />
          <h1 className="text-[12px] md:text-[16px] text-[#fff] ">
            {item.player_inviting.user.username}
          </h1>
        </div>
        <div className=" flex items-center w-full justify-between ">
          <h1 className=" text-[14px] md:text-[24px] lg:text-[20px] text-[#fff] ">
            {item.player_inviting.user.username} invited you
          </h1>
          <div className="flex flex-col justify-center h-[100%] gap-[10%] ">
            <button
              className="bg-[#fab907] px-[6px] py-[2px] md:px-[8px] md:py-[4px] lg:px-[6px] lg:py-[2px] text-[14px] md:text-[20px] lg:text-[17px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] "
              onClick={() => {
                acceptMatchMake(item.player_inviting.user.username);
              }}
            >
              ACCEPT
            </button>
            <button
              className="bg-red-600 px-[6px] py-[2px] md:px-[8px] md:py-[4px] lg:px-[6px] lg:py-[2px] text-[14px] md:text-[20px] lg:text-[17px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] "
              onClick={() => {
                declineMatchMake(item.player_inviting.user.username);
              }}
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default InvitationsCard;
