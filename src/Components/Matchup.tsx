/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import Cookies from "js-cookie";

import "./CSS/matchup.css";
import { useWebSocketContext } from "./Websocket";
import PlayerCard from "./MatchMakeMemo/PlayerCard";
import MatchMakesCard from "./MatchMakeMemo/MatchMakesCard";
import InvitationsCard from "./MatchMakeMemo/InvitationsCard";
import { IoRefreshSharp } from "react-icons/io5";

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

function Matchup({ usersSearch,setAcceptInvatation }: { usersSearch: string,setAcceptInvatation:(acceptInvatation:any)=>void }) {
    const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();
    
    const currentUser = useMemo(() => {
        return localStorage.getItem("currentUser") 
          ? JSON.parse(localStorage.getItem("currentUser")!) 
          : null;
      }, []);
    

      const [isSpinning, setIsSpinning] = useState(false);

    const [filter, setFilter] = useState<number[]>([]);
    
    const [playersData, setPlayersData] = useState<Profile[]>([]);
    const [playersDataSearch,setPlayersDataSearch] = useState<Profile[]>([])

    const [matchMakes, setMatchMakes] = useState<Message[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [sentInvitations,setSentInvitations] = useState<{id:number,player_invited:number}[]>([])
    const matchupSectionRef = useRef<any>();
    const [isOn, setIsOn] = useState(false);

    const handleCheckboxChange = (num: number) => {
      let newFilter = [...filter]
      console.log(newFilter)
      newFilter = newFilter.includes(num)? newFilter.filter((item) => item !== num):[...newFilter,num]
      console.log(newFilter)
      setFilter(newFilter);
      fetchPlayers(newFilter,isOn)
    };

    const fetchPlayers = async(newFilter:number[],IsOn:boolean|null)=>{
      const token = Cookies.get("token");
      
      const url = `https://strikem.site/api/filter-ratings/${newFilter.length !=0?'?':''}${newFilter.includes(2)?'filter=rating':''}${newFilter.length==2?"&":""}${newFilter.includes(1)?"filter_location=true":""}`
      const playersResponse = await axios(url,{
        headers: { Authorization: `JWT ${token}` },
      })
      let PlayersData:Profile[] = [...playersResponse.data]
        PlayersData = IsOn? [...PlayersData]:PlayersData.filter((item:Profile)=> item.id != currentUser.id)
        setPlayersData(PlayersData);
        setPlayersDataSearch(PlayersData)
    }
const Fetch = useCallback(async () => {
    const token = Cookies.get("token");
    try {
        const [playersResponse, matchMakesResponse, invitationsResponse] = await Promise.all([
            axios.get("https://strikem.site/api/filter-ratings/", {
              headers: { Authorization: `JWT ${token}` },
            }),
            axios.get("https://strikem.site/api/matchups/", {
              headers: { Authorization: `JWT ${token}` },
            }),
            axios.get(`https://strikem.site/api/player-details/`, {
              headers: { Authorization: `JWT ${token}` },
            }),
          ]);
      
        let PlayersData:Profile[] = [...playersResponse.data]
        PlayersData = !(invitationsResponse?.data?.inviting_to_play)? PlayersData.filter((item:Profile)=> item.id != invitationsResponse?.data.id):[...PlayersData]
        setPlayersData(PlayersData);
        setPlayersDataSearch(PlayersData)
        setMatchMakes(matchMakesResponse.data.results);
        setIsOn(invitationsResponse?.data?.inviting_to_play)
        setInvitations(invitationsResponse?.data?.received_invitations);
        setSentInvitations(invitationsResponse?.data?.sent_invitations)
    } catch (err) {
      console.log(err);
    }
  }, []);
  
  

  useEffect(() => {
    if(lastJsonMessage && lastJsonMessage.protocol == 'invited'){
    const newInvites = [...invitations];
    const newInvite:any = {
      player_invited: {
        profile_image: currentUser?.profile_image,
        total_points: currentUser?.total_points,
        user:currentUser?.user
      },
    player_inviting:{
        profile_image:lastJsonMessage.inviter_profile_image,
        user:{
            username:lastJsonMessage?.inviteSenderUsername            
        }
    }

    };
    newInvites.push(newInvite);
     
    setInvitations(newInvites)
}else if(lastJsonMessage && lastJsonMessage.protocol == 'handling_invite_response' && lastJsonMessage.invite_response == "ACCEPTED" ){
  const newMatchUps = [...matchMakes]
  const newMatchUp = {
    id:lastJsonMessage.matchup_id,
    player_accepting:{
      user:{
        username:lastJsonMessage.accepterUsername,
      },
      profile_image:lastJsonMessage.responder_profile_image

    },
    player_inviting:{
      user:{
        username:lastJsonMessage.inviteSenderUsername,
      },
      profile_image:lastJsonMessage.invite_sender_profile_pic
    }
  }
  newMatchUps.push(newMatchUp)
  setMatchMakes(newMatchUps)
  setInvitations((prev)=>prev.filter((item)=> item.player_inviting.user.username != lastJsonMessage.inviteSenderUsername))
}

  }, [lastJsonMessage]);

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
     
      setAcceptInvatation((prev:number):number => {
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
      setAcceptInvatation(0)
    }, 10000);
    
  };

  const declineMatchmake = (username: string) => {
    
    sendJsonMessage({
      action: "matchmake",
      username: currentUser?.user.username,
      invite_sender_username: username,
      invite_response: "deny",
    });
  };

  useEffect(() => {
    const currentUser: Profile  = localStorage.getItem("currentUser") 
    ? JSON.parse(localStorage.getItem("currentUser")!) 
    : null;
    console
    setIsOn(currentUser.inviting_to_play)
      
    Fetch();

    const windwoHeight = window.innerHeight;
    setTimeout(() => {
      if(window.innerWidth >= 1024){
      const sectionPosition =
        matchupSectionRef.current?.getBoundingClientRect().top;
      matchupSectionRef.current.style.height = `${
        windwoHeight - sectionPosition - 33
      }px`;
    }
    }, 100);
  }, []);

  const filteredPlayers = useCallback(() => {
    const newArr = playersDataSearch.filter((item: Profile) =>
      item.user.username.startsWith(usersSearch)
    );
  
    setPlayersData(newArr)
  }, [playersData, usersSearch]);

  useEffect(()=>{
    filteredPlayers()
  },[usersSearch])

  const toggleSlider = () => {
    sendJsonMessage(
        {
            'action': 'matchmake',
            'username': currentUser?.user.username,
            'protocol': 'control_user'
        }
    );
    let PlayersData:Profile[] = [...playersData]
    if(isOn){
      PlayersData = PlayersData.filter((item:Profile)=> item.id != currentUser.id)
      setPlayersData(PlayersData)
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
      const response = await axios(`https://strikem.site/api/filter-ratings/?${filter.includes(2)?'filter=rating':''}${filter.length==2?"&":""}${filter.includes(1)?"filter_location=true":""}`,{
        headers: { Authorization: `JWT ${token}` },
      })
      let PlayersData:Profile[] = [...response.data]
        PlayersData = isOn? [...PlayersData]:PlayersData.filter((item:Profile)=> item.id != currentUser.id)
      
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
        <div className={` flex flex-col ${window.innerWidth < 768?" mt-[24px] ":window.innerWidth < 1024 ?"mt-[32px]":""} `}>
          <h1 className=" text-[20px] md:text-[32px] lg:text-[48px] text-[#fff] ">Filter</h1>
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
                  className={` flex flex-col gap-[4px] p-[8px] md:p-[12px] rounded-[20px]  border-[1px] borer-[#fff] ${
                    filter.includes(1) ? "bg-[#fff]" : ""
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
                  <p className={`text-[14px] leading-[17px] md:text-[20px] md:leading-6 lg:text-[18px] lg:leading-5   ${filter.includes(1) ? "text-[#000]" : "text-[#fff]"} `} >location</p>
                  </div>
                  <p className={`text-[8px] md:text-[12px] lg:text-[10px] ${filter.includes(1) ? "text-[#0000007b]" : "text-[#ffffff86]"} `} >find player 4km radius</p>
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
                  className={` flex flex-col gap-[4px] p-[8px] md:p-[12px] rounded-[20px] border-[1px] borer-[#fff] ${
                    filter.includes(2) ? "bg-[#fff]" : ""
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
                  <p className={`text-[14px] leading-[17px] md:text-[20px] md:leading-6 lg:text-[18px] lg:leading-5 ${filter.includes(2) ? "text-[#000]" : "text-[#fff]"} `} >Rating</p>
                  </div>
                  <p className={`text-[8px] md:text-[12px] lg:text-[10px] ${filter.includes(2) ? "text-[#0000007b]" : "text-[#ffffff86]"} `} >find player ↑ 200 ↓ rating</p>
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
            <p className={`text-[8px] md:text-[12px] lg:text-[10px] text-[#ffffff86] `} >Turn on match making requests</p>

            </div>
          </div>
        </div>
        <main className="flex flex-col gap-[20px] mt-[24px] mb-[24px] md:mt-[32px] lg:h-[100%] lg:mb-0 overflow-hidden ">
          <div className="flex items-end justify-between" >
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-[#fff] ">Players</h1>
          <div className={`flex items-end justify-center h-[30px] aspect-square mr-[26px] ${isSpinning ? "spin" : ""} `} onClick={()=>{refreshData()}} >
            <IoRefreshSharp className="w-[24px] h-[24px] " style={{color:'white'}} /></div>
          </div>
          <div className="lg:flex-1 min-h-[360px] max-h-[360px]  md:min-h-[480px] md:max-h-[480px] lg:min-h-[100%] lg:max-h-[100%]  lg:h-[100%]  ">
            <div className="flex flex-col gap-[10px] h-[100%]  overflow-y-auto playersScroll lg:pr-[10px]">
              {playersData.map((item: Profile) => {
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
              {playersData.map((item: Profile) => {
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
              {playersData.map((item: Profile) => {
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
              {playersData.map((item: Profile) => {
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
              {playersData.map((item: Profile) => {
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
      <div className=" flex flex-col w-[100%] lg:w-[55%] gap-[6%] mb-[24px] lg:max-h-[100%] lg:mb-0 ">
        <div className="flex flex-col lg:h-[47%] gap-[20px] ">
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-[#fff] ">Matchups</h1>
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
          <h1 className="text-[20px] md:text-[32px] lg:text-[48px] text-[#fff] ">invations</h1>
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
