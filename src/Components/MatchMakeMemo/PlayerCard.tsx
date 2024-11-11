import React from "react";
import { CiStar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface Profile {
  games_played: number;
  games_won: number;
  id: number;
  inviting_to_play: boolean;
  opponents_met: number;
  profile_image: string;
  total_points: number;
  user: User;
}

interface PlayerCardProps {
  player: Profile;
  currentUser: Profile | null;
  sentInvitations:{
    id:number,
    player_invited:number
  }[];
  onMatchmake: (username: string) => void;
}

const PlayerCard = React.memo(
  ({ player, sentInvitations,currentUser, onMatchmake }: PlayerCardProps) => {
    const navigate = useNavigate()
    return (
    <div className="flex justify-between items-center rounded-[40px] md:rounded-[48px] bg-[#161D2F] p-[10px] md:p-3 lg:p-[10px] lg:px-[10px] w-[100%]">
      <div className="flex gap-[20px] h-[100%]">
        <img
          src={player.profile_image}
          className=" h-[44px] md:h-[64px] lg:h-[54px] aspect-square rounded-full"
          alt="profile_image"
        />
        <div className="flex flex-col h-[100%] items-start md:items-center justify-start md:justify-center md:gap-[10px] text-left gap-[1px] lg:gap-[6px]">
          <div className="flex gap-[2px] h-[48%] md:justify-start md:items-end" onClick={()=>{navigate(`/users/${player.id}`)}} >
            <h1 className=" text-[15px] md:text-2xl lg:text-xl text-[#fff]">{player.user.username}</h1>
            <h2 className=" hidden md:flex md:mb-[3px] md:text-[13px] text-[#ffffff57]">
              ({player.user.first_name} {player.user.last_name})
            </h2>
          </div>
          <div className="flex items-center h-[100%] gap-[5px] md:hidden">
        <CiStar size={10} style={{ color: "white",height:'100%' }} />
        <p className=" text-[9px] lg:text-[100%] text-[#fff]">{player.total_points}</p>
      </div>
          <h3 className=" text-[8px] lg:text-[60%] text-[#fff] self-start">
            Email:{player.user.email}
          </h3>
        </div>
      </div>
      <div className="md:flex items-center hidden h-[100%] gap-[5px]">
        <CiStar size={window.innerWidth < 768?32:28} style={{ color: "white",height:'100%' }} />
        <p className="text-2xl lg:text-xl text-[#fff]">{player.total_points}</p>
      </div>
      <button
        className={`${
          player.user.id == currentUser?.user.id
            ? "bg-transparent text-transparent"
            : "bg-[#fab907]"
        } flex items-center justify-center  py-[4px] px-[8px] md:py-[6px] md:px-[12px] text-[#FFF]   hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] md:rounded-[22px]  `}
        onClick={() =>
          player.user.id != currentUser?.user.id &&
          onMatchmake(player.user.username)
        }
        // {sentInvitations?.some((item)=> item.player_invited == player.id ) ?disable:'Matchmake'}
      >
        <p className={` text-[#FFF] text-xs  md:text-2xl lg:text-xl hover:text-[#161D2F]  ${player.user.id == currentUser?.user.id
            ? "bg-transparent text-transparent"
            : ""} `} >{sentInvitations?.some((item)=> item.player_invited == player.id ) ?'Invited':'Matchmake'}</p>
      </button>
    </div>
  )}
);

export default PlayerCard;
