import React from "react";
import { CiStar } from "react-icons/ci";

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
  ({ player, sentInvitations,currentUser, onMatchmake }: PlayerCardProps) => (
    <div className="flex justify-between items-center rounded-[20px] bg-[#161D2F] p-[16px] h-[17.4%] w-[100%]">
      <div className="flex gap-[20px] h-[100%]">
        <img
          src={player.profile_image}
          className="h-[100%] aspect-square rounded-full"
          alt="profile_image"
        />
        <div className="flex flex-col items-center justify-start text-left gap-[10px]">
          <div className="flex gap-[2px] items-end">
            <h1 className="text-[18px] text-[#fff]">{player.user.username}</h1>
            <h2 className="text-[12px] text-[#ffffff57]">
              ({player.user.first_name} {player.user.last_name})
            </h2>
          </div>
          <h3 className="text-[10px] text-[#fff] self-start">
            Email:{player.user.email}
          </h3>
        </div>
      </div>
      <div className="flex gap-[5px]">
        <CiStar size={28} style={{ color: "white" }} />
        <p className="text-[18px] text-[#fff]">{player.total_points}</p>
      </div>
      <button
        className={`${
          player.user.id === currentUser?.user.id
            ? "bg-transparent text-transparent"
            : "bg-[#fab907]"
        } px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px]  `}
        onClick={() =>
          player.user.id !== currentUser?.user.id &&
          onMatchmake(player.user.username)
        }
        // {sentInvitations?.some((item)=> item.player_invited == player.id ) ?disable:'Matchmake'}
      >
        {sentInvitations?.some((item)=> item.player_invited == player.id ) ?'Invited':'Matchmake'}
      </button>
    </div>
  )
);

export default PlayerCard;
