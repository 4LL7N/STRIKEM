import React from 'react'
import UserStats from './UserStats';
import { useAppDispatch, useAppSelector } from '../../ReduxStore/ReduxHooks';
import { setSetPasswordPage} from '../../ReduxStore/features/userSettingsBox';

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

const ProfileInfo = React.memo(({ userInfo }: { userInfo: Profile | null }) => {
 
  const currentUser = useAppSelector((state) => state.currentUser);
  console.log(userInfo);
  console.log(currentUser);
  
  
  const dispatch = useAppDispatch();
  
  return(
    <div className="flex w-[100%] gap-[30px] items-center justify-start px-[10px] ">
        <div className='flex flex-col items-center gap-[5px]' >
          <div className='relative flex flex-col group ' >
      <img
        src={userInfo?.profile_image}
        alt="profile"
        className="w-[130px] md:w-[256px] lg:w-[256px] aspect-square rounded-[50%] "
      />
      <div className=" absolute top-0 left-0 w-full h-full flex justify-center items-end cursor-pointer z-[10] rounded-[50%] hover:bg-[#0000006c] " onClick={(e)=>{e.stopPropagation();dispatch(setSetPasswordPage({open:true,settingsPage:"Profile from Profile"}))}} style={{opacity:0,transition: 'opacity 0.3s'}}  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'} >
    <span className="text-white bg-[#5a5a5a] text-[10px] md:text-[16px] px-[8px] py-[4px] rounded-[20px] translate-y-[120%] "  >Change profile picture</span>  
  </div>
      </div>
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
  )});

export default ProfileInfo