import React from 'react'
import { useAppDispatch } from '../../ReduxStore/ReduxHooks';
import { setUserSettingsBoxOpen } from '../../ReduxStore/features/userSettingsBox';

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

const UserStats = React.memo(({ userInfo }: { userInfo: Profile | null }) => {

  const dispatch = useAppDispatch()

  return(
    <div className="flex flex-col md:flex-row gap-[5px]  md:gap-0 mt-[15px]">
      <div className="flex-1 flex-col">
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Games: {userInfo?.games_played}
        </p>
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Wins: {userInfo?.games_won}
        </p>
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Loses: {userInfo?.games_played && userInfo?.games_played - userInfo?.games_won}
        </p>
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Meets: {userInfo?.opponents_met}
        </p>
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Points: {userInfo?.total_points}
        </p>
      </div>
      <div className="flex-col flex-1">
        <p className="text-[#fff] text-[14px] md:text-[18px] lg:text-[24px]">
          Email: {userInfo?.user.email}
        </p>
        <button className="rounded-[10px] px-[8px] py-[6px] text-[#fff] bg-[#fab907] mt-[5px]" onClick={()=>{dispatch(setUserSettingsBoxOpen()),console.log("setting open")}}>
          Edit profile
        </button>
      </div>
    </div>
  )});

  export default UserStats