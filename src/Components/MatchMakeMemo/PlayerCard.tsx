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
    // justify-between (the original layout) placed the points block wherever the left group's own
    // content width pushed it to - a longer username/name or a longer "Matchmake"/"Invited" button
    // label shifted that middle block left or right, so it never lined up between rows even once
    // every row was the same height. At md+, three things fix that:
    //  - both the left group and the spacer after the points block are flex-1, but the spacer is
    //    ALSO max-width capped (md:160px / lg:90px) - it grows until it hits that cap, then every
    //    bit of space beyond that goes to the left group instead, since it's the only side left
    //    uncapped. That's what centers the points block more on a wide card without starving the
    //    name on a narrow one (this page's own lg-tier column is fairly narrow already - the
    //    Matchups sidebar eats real width there - an uncapped 1:1 split left the name ~70px)
    //  - the spacer's flex-shrink is high, the left group's is the default - under space pressure
    //    the (purely decorative) spacer gives way first, so name/email only start truncating once
    //    the spacer's already given up everything it had
    //  - the points block and button are fixed-width, so neither's own content changes its column
    // Below md, the button drops to its own row (see the md:contents wrapper) instead of sharing
    // the row with the name - on a narrow phone that was squeezing "Matchmake"/"Invited" against
    // the username and clipping it; now the top row is just avatar + name/points/email with the
    // full card width to itself.
    return (
    // shrink-0: the list this renders into is `flex flex-col h-[100%] overflow-y-auto` - a plain
    // flex column with a height cap and its own scrollbar. Every flex child defaults to
    // flex-shrink:1, so without this, once total card content couldn't fit the list's available
    // height, the flex algorithm compressed EVERY card shorter than its actual content instead of
    // just scrolling - not "the button got removed", it got squashed to ~0px and clipped by this
    // card's own overflow-hidden below. shrink-0 makes each card keep its real height and pushes
    // the overflow onto the list's scrollbar, which is what it's there for.
    <div className="flex flex-col md:flex-row md:items-center shrink-0 gap-[6px] md:gap-[10px] rounded-[24px] md:rounded-[48px] bg-[#161D2F] p-[10px] md:p-3 lg:p-[10px] lg:px-[10px] w-[100%] md:h-[88px] lg:h-[74px] overflow-hidden">
      <div className="flex items-center gap-[20px] w-full md:w-auto md:h-[100%] min-w-0 md:flex-1">
        <img
          src={player.profile_image}
          className=" h-[44px] md:h-[64px] lg:h-[54px] aspect-square rounded-full shrink-0"
          alt="profile_image"
        />
        {/* min-w-0 so the truncate rules below can actually shrink these instead of pushing the
        card wider/taller - every card needs the same height at md+ for the points block on the
        right to line up row to row, so nothing in here is allowed to wrap onto a second line. */}
        <div className="flex flex-col h-full md:gap-[10px] text-left gap-[2px] lg:gap-[6px] min-w-0 justify-center">
          <div className="flex gap-[2px] w-full min-w-0 md:items-end" onClick={()=>{navigate(`/users/${player.id}`)}} >
            <h1 className=" text-[16px] md:text-2xl lg:text-xl text-white truncate">{player.user.username}</h1>
            <h2 className=" hidden md:flex md:mb-[3px] md:text-[13px] !text-faint-white truncate">
              ({player.user.first_name} {player.user.last_name})
            </h2>
          </div>
          <div className="flex items-center gap-[6px] md:hidden">
            <CiStar size={14} style={{ color: "white" }} />
            <p className=" text-[13px] text-white tabular-nums">{player.total_points}</p>
          </div>
          <h3 className=" text-[10px] lg:text-[60%] text-white/70 self-start w-full truncate">
            Email:{player.user.email}
          </h3>
        </div>
      </div>
      <div className="md:flex items-center hidden h-[100%] gap-[5px] shrink-0 md:w-[90px] lg:w-[74px]">
        <CiStar size={window.innerWidth < 1024?32:28} style={{ color: "white",height:'100%' }} />
        <p className="text-2xl lg:text-xl text-white tabular-nums">{player.total_points}</p>
      </div>
      {/* Capped, not just flex-1 like the left group: on this page's narrower lg-tier column (the
      Matchups sidebar takes real width there) an uncapped 1:1 split left only ~70px for the name -
      unreadable. Capping this side means the left group - the only side left uncapped - absorbs
      every bit of space beyond the cap, so the cap is really "how much room can centering the
      points block borrow before name space always wins," not a fixed position. */}
      <div className="hidden md:block md:flex-[1_20_0%] md:max-w-[160px] lg:max-w-[90px]" aria-hidden="true" />
      {/* md:contents drops this wrapper from the box model at md+ so the button becomes a normal
      fixed-width flex item of the row above (same as before); below md it's a real block, giving
      the button its own full-width row instead of sharing the top row with the name. */}
      <div className="flex justify-end w-full md:contents">
      <button
        className={`${
          player.user.id == currentUser?.user.id
            ? "bg-transparent text-transparent"
            : "bg-[#fab907]"
        } flex items-center justify-center shrink-0 w-[110px] md:w-[160px] lg:w-[130px] py-[6px] px-[8px] md:py-[6px] md:px-[12px] text-white   hover:bg-[#FFFFFF] hover:!text-brand-navy rounded-[20px] md:rounded-[22px]  `}
        onClick={() =>
          player.user.id != currentUser?.user.id &&
          onMatchmake(player.user.username)
        }
        // {sentInvitations?.some((item)=> item.player_invited == player.id ) ?disable:'Matchmake'}
      >
        <p className={` text-white text-xs  md:text-2xl lg:text-xl hover:!text-brand-navy  ${player.user.id == currentUser?.user.id
            ? "bg-transparent text-transparent"
            : ""} `} >{sentInvitations?.some((item)=> item.player_invited == player.id ) ?'Invited':'Matchmake'}</p>
      </button>
      </div>
    </div>
  )}
);

export default PlayerCard;
