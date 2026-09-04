/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import Cookies from "js-cookie";

import "./CSS/matchup.css";
import { useWebSocketContext } from "./Websocket";
import PlayerCard from "./MatchMakeMemo/PlayerCard";
import MatchMakesCard from "./MatchMakeMemo/MatchMakesCard";
import InvitationsCard from "./MatchMakeMemo/InvitationsCard";
import { IoRefreshSharp } from "react-icons/io5";
import { useAppSelector } from "../ReduxStore/ReduxHooks";
import { Player } from "../type";
import { API_BASE_URL } from "../config";


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

function Matchup({ usersSearch,setUsersSearch,setAcceptInvitation }: { usersSearch: string,setUsersSearch:(userSearch:string)=>void,setAcceptInvitation:(acceptInvitation:any)=>void }) {
    const { sendJsonMessage, subscribe } = useWebSocketContext();

      const [isSpinning, setIsSpinning] = useState(false);

    const [filter, setFilter] = useState<number[]>([]);
    
    const [playersData, setPlayersData] = useState<Player[]>([]);
    const [playersDataSearch,setPlayersDataSearch] = useState<Player[]>([])

    const [matchMakes, setMatchMakes] = useState<Message[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [sentInvitations,setSentInvitations] = useState<{id:number,player_invited:number}[]>([])
    const matchupSectionRef = useRef<HTMLSelectElement|null>(null);

    const currentUser = useAppSelector((state) => state.currentUser);
    // Starts from currentUser.inviting_to_play directly (Redux state, already available on first
    // render) instead of useState(false) + a setIsOn() call in the mount effect below - same
    // starting value, one less render. setIsOn is still called elsewhere as normal (after
    // fetching fresh data, and from the toggle switch itself).
    const [isOn, setIsOn] = useState(() => currentUser.inviting_to_play);

    // Tracks the current user's own player id independently of the Redux currentUser - the mount
    // effect below fires before the app-wide currentUser fetch (elsewhere, e.g. Layout) is
    // guaranteed to have resolved, so currentUser.id can still be 0/undefined at that first call.
    // Seeded from Redux as a reasonable starting guess, then corrected from this page's own
    // /api/player-details/ response (see the mount effect) the moment it comes back - every other
    // call site below reads this instead of currentUser.id directly, so there's one source of
    // truth instead of two that can disagree.
    const [selfId, setSelfId] = useState<number>(currentUser.id);

    // Toggle off -> the current user shouldn't be in the matchmaking list at all (they're not
    // looking for a match). Toggle on -> they should, but pinned first rather than wherever the
    // API happened to sort them by points - every place that builds playersData from a fresh API
    // response goes through this one function so the placement rule can't drift between them.
    const placeCurrentUserFirst = (players: Player[], onState: boolean, id: number): Player[] => {
      const others = players.filter((item: Player) => item.id != id);
      if (!onState) return others;
      const self = players.find((item: Player) => item.id == id);
      return self ? [self, ...others] : others;
    };

    const handleCheckboxChange = (num: number) => {
      let newFilter = [...filter]
      newFilter = newFilter.includes(num)? newFilter.filter((item) => item !== num):[...newFilter,num]
      setFilter(newFilter);
      fetchPlayers(newFilter,isOn)
    };

    const fetchPlayers = async(newFilter:number[],IsOn:boolean|null)=>{
      const token = Cookies.get("token");
      
      const url = `${API_BASE_URL}/api/filter-ratings/${newFilter.length !=0?'?':''}${newFilter.includes(2)?'filter=rating':''}${newFilter.length==2?"&":""}${newFilter.includes(1)?"filter_location=true":""}`
      const playersResponse = await axios(url,{
        headers: { Authorization: `JWT ${token}` },
      })
      let PlayersData:Player[] = [...playersResponse.data]
        PlayersData = placeCurrentUserFirst(PlayersData, !!IsOn, selfId)
        setPlayersData(PlayersData);
        setPlayersDataSearch(PlayersData)
    }
  
  

  useEffect(() => {
    const unsubscribe = subscribe((data: any) => {
      if(data && data.protocol == 'invited'){
        const newInvites = [...invitations];
        const newInvite:any = {
          player_invited: {
            profile_image: currentUser?.profile_image,
            total_points: currentUser?.total_points,
            user:currentUser?.user
          },
          player_inviting:{
            profile_image:data.inviter_profile_image,
            user:{
              username:data?.inviteSenderUsername
            }
          }
        };
        newInvites.push(newInvite);

        setInvitations(newInvites)
      }else if(data && data.protocol == 'handling_invite_response' && data.invite_response == "ACCEPTED" ){
        const newMatchUps = [...matchMakes]
        const newMatchUp = {
          id:data.matchup_id,
          player_accepting:{
            user:{
              username:data.accepterUsername,
            },
            profile_image:data.responder_profile_image

          },
          player_inviting:{
            user:{
              username:data.inviteSenderUsername,
            },
            profile_image:data.invite_sender_profile_pic
          }
        }
        newMatchUps.push(newMatchUp)
        setMatchMakes(newMatchUps)
        setInvitations((prev)=>prev.filter((item)=> item.player_inviting.user.username != data.inviteSenderUsername))
      }else if(data && data.protocol == 'handling_invite_response' && data.invite_response == "DENIED"){
        // Sent only to the original inviter - the decliner's own list is updated optimistically
        // in declineMatchmake() instead, since this broadcast never reaches them. Without this,
        // that player's card stayed stuck showing "Invited" (re-inviting disabled) here even
        // after they'd said no, until a page reload refetched sent_invitations from the server.
        const declinedPlayer = playersData.find((p) => p.user.username == data.accepterUsername);
        if (declinedPlayer) {
          setSentInvitations((prev) => prev.filter((item) => item.player_invited != declinedPlayer.id));
        }
      }
    });
    return unsubscribe;
    // Re-subscribes whenever invitations/matchMakes/currentUser/playersData change, same reasoning
    // as the Messenger.tsx WS handler - this callback closes over them, so it needs a fresh
    // registration each time rather than being pinned to subscribe()'s permanently-stable reference.
  }, [subscribe, invitations, matchMakes, currentUser, playersData]);

  const sendMatchmake = (username: string) => {
    
    sendJsonMessage({
      action: "matchmake",
      matchmaker_username: username,
      username: currentUser?.user.username,
    });
  };

  const acceptMatchmake = (username: string) => {
    
    sendJsonMessage({
      action: "matchmake",
      username: currentUser?.user.username,
      invite_sender_username: username,
      invite_response: "accept",
    });
    const timer = setInterval(() => {
     
      setAcceptInvitation((prev:number):number => {
        const nextValue = Math.min(prev + 0.1, 100);
        const roundedValue = Math.round(nextValue * 10) / 10; 
        if (roundedValue === 100) {
          clearInterval(timer);
        }else if(prev == -1){
          clearInterval(timer);
          return 0
        }
        return roundedValue;
      });
    }, 10);
  
    setTimeout(() => {
      clearInterval(timer);
      setAcceptInvitation(0)
    }, 10000);
    
  };

  const declineMatchmake = (username: string) => {

    sendJsonMessage({
      action: "matchmake",
      username: currentUser?.user.username,
      invite_sender_username: username,
      invite_response: "deny",
    });

    // The backend's DENIED broadcast only goes to the original inviter (so their sentInvitations
    // list can update below) - it never comes back to the person who declined, unlike ACCEPTED
    // which is sent to both sides. Without this, the card just sat here forever until a page
    // reload, even though the invitation was already gone server-side.
    setInvitations((prev) =>
      prev.filter((item) => item.player_inviting.user.username != username)
    );
  };

  useEffect(() => {
    const Fetch = async () => {
      const token = Cookies.get("token");
      try {
        const [playersResponse, matchMakesResponse, invitationsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/filter-ratings/`, {
            headers: { Authorization: `JWT ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/matchups/`, {
            headers: { Authorization: `JWT ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/player-details/`, {
            headers: { Authorization: `JWT ${token}` },
          }),
        ]);

        // invitationsResponse.data.id is this page's own fresh fetch of the current player's id -
        // used here (and pushed into selfId for every later call) instead of the Redux
        // currentUser.id, which this effect can't wait on without adding it as a dependency and
        // re-running the whole fetch every time Redux's copy changes.
        const freshSelfId = invitationsResponse?.data?.id ?? currentUser.id;
        setSelfId(freshSelfId);

        let PlayersData:Player[] = [...playersResponse.data]
        PlayersData = placeCurrentUserFirst(PlayersData, !!invitationsResponse?.data?.inviting_to_play, freshSelfId)
        setPlayersData(PlayersData);
        setPlayersDataSearch(PlayersData)
        setMatchMakes(matchMakesResponse.data.results);
        setIsOn(invitationsResponse?.data?.inviting_to_play)
        setInvitations(invitationsResponse?.data?.received_invitations);
        setSentInvitations(invitationsResponse?.data?.sent_invitations)
      } catch (err) {
        console.log(err);
      }
    };
    Fetch();

    const windwoHeight = window.innerHeight;
    setTimeout(() => {
      if(window.innerWidth >= 1024 && matchupSectionRef.current){
      const sectionPosition =
        matchupSectionRef.current?.getBoundingClientRect().top;
        matchupSectionRef.current.style.height = `${
        windwoHeight - sectionPosition - 33
      }px`;
    }
    }, 100);

    // window.addEventListener('resize',()=>{
    //   window.location.reload()
    // })
  }, []);

  useEffect(()=>{
    const newArr = playersDataSearch.filter((item: Player) =>
      item.user.username.startsWith(usersSearch)
    );

    setPlayersData(newArr)
  },[usersSearch])

  const toggleSlider = () => {
    sendJsonMessage(
        {
            'action': 'matchmake',
            'username': currentUser?.user.username,
            'protocol': 'control_user'
        }
    );
    if(isOn){
      setPlayersData(placeCurrentUserFirst(playersData, false, selfId))
    }else{
      fetchPlayers([...filter],true)
    }
    setIsOn(!isOn);
  };

  function deepEqual(obj1:any, obj2:any) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 == null || obj2 == null) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  }

  const refreshData = useCallback(async () => {
    setIsSpinning(true); 
    const token = Cookies.get("token");
    try {
      const response = await axios(`${API_BASE_URL}/api/filter-ratings/?${filter.includes(2)?'filter=rating':''}${filter.length==2?"&":""}${filter.includes(1)?"filter_location=true":""}`,{
        headers: { Authorization: `JWT ${token}` },
      })
      let PlayersData:Player[] = [...response.data]
        PlayersData = placeCurrentUserFirst(PlayersData, isOn, selfId)

      if (!deepEqual(playersData, PlayersData)) { 
        setPlayersDataSearch(PlayersData)
        setPlayersData(PlayersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(()=>{
        setIsSpinning(false);
      },500)
    }
  }, [playersData]);

  return (
    <section ref={matchupSectionRef} className="flex flex-col-reverse lg:flex-row w-[100%] gap-[2%] px-[10px] py-[24px] lg:pb-[0] ">
      <div className=" flex flex-col  w-[100%]  ">
      <div className={` flex ml-[16px] my-[16px] md:my-[24px] md:ml-[0] md:mb-[33px] `} ><img className="w-[24px] h-[24px] mr-[16px] md:w-[32px] md:h-[32px] md:mr-[24px]" src="/images/icon-search.svg"  /><input className="bg-transparent focus:outline-none text-white text-[16px] font-light md:text-[24px] " type="text" placeholder="Search for movies" onChange={(event) =>{setUsersSearch(event.target.value)}} /></div>

        <div className={` flex flex-col `}>
          <h1 className=" text-[20px] md:text-[32px] lg:text-[48px] text-white ">Filter</h1>
          <div className="flex mt-[8px] md:mt-[16px] lg:mt-[20px] justify-between ">
            <div className="flex gap-[10px] md:gap-[20px] ">
              <label
                htmlFor="location"
                className="flex items-center cursor-pointer"
              >
                <input
                  id="location"
                  type="checkbox"
                  checked={filter.includes(1)}
                  onChange={() => {
                    handleCheckboxChange(1);
                  }}
                  className="hidden"
                />
                <span
                  className={` flex flex-col gap-[4px] p-[8px] md:p-[12px] rounded-[20px]  border-[1px] borer-[#ffffff] ${
                    filter.includes(1) ? "bg-[#ffffff]" : ""
                  } `}
                >
                    <div className=" flex items-center gap-[5px] " >
                  <LuMapPin
                  
                  size={window.innerWidth < 768?17:window.innerWidth < 1024?24:20}
                    style={
                      filter.includes(1)
                        ? { color: "black" }
                        : { color: "white" }
                    }
                  />
                  <p className={`text-[14px] leading-[17px] md:text-[20px] md:leading-6 lg:text-[18px] lg:leading-5   ${filter.includes(1) ? "text-black" : "text-white"} `} >location</p>
                  </div>
                  <p className={`text-[8px] md:text-[12px] lg:text-[10px] ${filter.includes(1) ? "!text-faint-black" : "!text-dim-white"} `} >find player 4km radius</p>
                </span>
              </label>
              <label
                htmlFor="rating"
                className="flex items-center cursor-pointer"
              >
                <input
                  id="rating"
                  type="checkbox"
                  checked={filter.includes(2)}
                  onChange={() => handleCheckboxChange(2)}
                  className="hidden"
                />
                <div
                  className={` flex flex-col gap-[4px] p-[8px] md:p-[12px] rounded-[20px] border-[1px] borer-[#ffffff] ${
                    filter.includes(2) ? "bg-[#ffffff]" : ""
                  } `}
                >
                    <div className=" flex items-center gap-[5px] " >
                  <CiStar
                  size={window.innerWidth < 768?17:window.innerWidth < 1024?24:20}
                    style={
                      filter.includes(2)
                        ? { color: "black" }
                        : { color: "white" }
                    }
                  />
                  <p className={`text-[14px] leading-[17px] md:text-[20px] md:leading-6 lg:text-[18px] lg:leading-5 ${filter.includes(2) ? "text-black" : "text-white"} `} >Rating</p>
                  </div>
                  <p className={`text-[8px] md:text-[12px] lg:text-[10px] ${filter.includes(2) ? "!text-faint-black" : "!text-dim-white"} `} >find player ↑ 200 ↓ rating</p>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center gap-[4px] " onClick={() => toggleSlider()} >
            <div className=" relative w-24 md:w-36 lg:w-32  h-6 md:h-9 lg:h-8 " >
              <div
                className={`absolute top-0 left-0 w-full h-full rounded-full transition-colors duration-300  ${
                  isOn ? "bg-[#fab907]" : "bg-red-500"
                }`}
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="1"
                value={isOn ? 1 : 0}
                readOnly
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                
              />
              <div
                className={`absolute top-[50%] translate-y-[-50%] left-[3%] w-[20%] aspect-square cursor-pointer bg-white rounded-full shadow-md transition-transform duration-300 ${
                  isOn ? "translate-x-[375%]" : "translate-x-0"
                }`}
              ></div>
            </div>
            <p className={`text-[8px] md:text-[12px] lg:text-[10px] !text-dim-white `} >Turn on match making requests</p>

            </div>
          </div>
        </div>
        <main className="flex flex-col gap-[20px] mt-[24px] mb-[24px] md:mt-[32px] lg:h-[100%] lg:mb-0 overflow-hidden ">
          <div className="flex items-end justify-between" >
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-white ">Players</h1>
          <div className={`flex items-end justify-center h-[30px] aspect-square mr-[26px] ${isSpinning ? "spin" : ""} `} onClick={()=>{refreshData()}} >
            <IoRefreshSharp className="w-[24px] h-[24px] " style={{color:'white'}} /></div>
          </div>
          <div className="lg:flex-1 min-h-[360px] max-h-[360px]  md:min-h-[480px] md:max-h-[480px] lg:min-h-[100%] lg:max-h-[100%]  lg:h-[100%]  ">
            <div className="flex flex-col gap-[10px] h-[100%]  overflow-y-auto playersScroll lg:pr-[10px]">
              {playersData.map((item: Player) => {
                return (
                    <PlayerCard
                    key={item.id}
                    player={item}
                    sentInvitations={sentInvitations}
                    currentUser={currentUser}
                    onMatchmake={sendMatchmake}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <div className=" flex flex-col mt-[16px] md:mt-[24px] w-[100%] lg:w-[55%] gap-[6%] mb-[24px] lg:max-h-[100%] lg:mb-0 ">
        <div className="flex flex-col lg:h-[47%] gap-[20px] ">
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-white ">Matchups</h1>
          <div className="flex flex-col flex-grow rounded-[20px]  border-[1px] border-[#243257d5] h-[238px] md:h-[358px] overflow-y-auto messagesScroll  ">
            {matchMakes?.map((item: Message, i: number) => {
              const index = (i + 10) * 100;
              return (
                <MatchMakesCard
                key={index}
                i={i}
                length={matchMakes.length}
                item={item}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col lg:h-[47%] gap-[20px] ">
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-white ">invations</h1>
          <div className="flex flex-col flex-grow rounded-[20px]  border-[1px] border-[#243257d5] h-[238px] md:h-[358px] overflow-y-auto messagesScroll  ">
            {invitations?.map((item: Invitation, i: number) => {
              const index = (i + 10) * 100;
              return (
                <InvitationsCard
                    key={index}
                    i={i}
                    length={invitations.length}
                    item={item}
                    acceptMatchMake={acceptMatchmake}
                    declineMatchMake={declineMatchmake}
                />
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Matchup;
