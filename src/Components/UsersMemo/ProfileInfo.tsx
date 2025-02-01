import React from 'react'
import UserStats from './UserStats';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username:string;
  }

interface Profile {
    games_played: number;
    games_won: number;
    id: number;
    inviting_to_play: boolean;
    opponents_met: number;
    profile_image: string;
    total_points: number;
    user:User
  }

const ProfileInfo = ({ userInfo }: { userInfo: Profile | null }) => (
    <div className="flex w-[100%] gap-[30px] items-center justify-start px-[10px] ">
        <div className='flex flex-col items-center gap-[5px]' >
      <img
        src={userInfo?.profile_image}
        alt="profile"
        className="w-[130px] md:w-[256px] lg:w-[256px] aspect-square rounded-[50%] mx-[10px]"
      />
       <h1 className="text-[#fff] text-[20px] md:text-[32px] lg:text-[48px] md:hidden">
            {userInfo?.user.username}
          </h1>
          <p className="text-[#7e7e7e] text-[14px] md:text-[20px] lg:text-[32px] md:hidden ">
            ({userInfo?.user.first_name} {userInfo?.user.last_name})
          </p>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="w-[100%] justify-start items-end hidden md:flex ">
          <h1 className="text-[#fff] text-[20px] md:text-[32px] lg:text-[48px]">
            {userInfo?.user.username}
          </h1>
          <p className="text-[#7e7e7e] text-[14px] md:text-[20px] lg:text-[32px]">
            ({userInfo?.user.first_name} {userInfo?.user.last_name})
          </p>
        </div>
        <UserStats userInfo={userInfo} />
      </div>
    </div>
  );

export default ProfileInfo