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
  last_message: {
    body: string;
  };
  player_accepting: {
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

function Matchup({ usersSearch }: { usersSearch: string }) {
    const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();
    
    const currentUser = useMemo(() => {
        return localStorage.getItem("currentUser") 
          ? JSON.parse(localStorage.getItem("currentUser")!) 
          : null;
      }, []);
      

    const [filter, setFilter] = useState<number[]>([]);
    
    const [playersData, setPlayersData] = useState<Profile[]>([]);
    // const [players, setPlayers] = useState<Profile[]>([]);
    
    const [matchMakes, setMatchMakes] = useState<Message[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    
    const matchupSectionRef = useRef<any>();
    const [isOn, setIsOn] = useState(false);

    const handleCheckboxChange = useCallback((num: number) => {
        setFilter((prevFilter) =>
          prevFilter.includes(num)
            ? prevFilter.filter((item) => item !== num)
            : [...prevFilter, num]
        );
      }, []);

//   const handleCheckboxChange = (num: number) => {
//     let filterArr = [...filter];
//     if (filterArr.includes(num)) {
//       filterArr = filterArr.filter((item) => item !== num);
//       setFilter([...filterArr]);
//     } else {
//       filterArr.push(num);
//       setFilter(filterArr);
//     }
//   };

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
            axios.get("https://strikem.site/api/invitations/", {
              headers: { Authorization: `JWT ${token}` },
            }),
          ]);
      
        setPlayersData(playersResponse.data);
        setMatchMakes(matchMakesResponse.data.results);
        setInvitations(invitationsResponse.data);
    } catch (err) {
      console.log(err);
    }
  }, []);
  

  useEffect(() => {
    console.log(lastJsonMessage);
    if(lastJsonMessage && lastJsonMessage.protocol == 'invite'){
    const newInvites = [...invitations];
    const newInvite:any = {
      player_invited: {
        profile_image: currentUser?.profile_image,
        total_points: currentUser?.total_points,
        user:currentUser?.user
      },
    player_inviting:{
        profile_image:'../../public/images/logo1.png',
        user:{
            username:lastJsonMessage?.inviteSenderUsername            
        }
    }

    };
    newInvites.push(newInvite);
    // inviteSenderUsername: "gendalf"
    // protocol: "invited"
    setInvitations(newInvites)
}
  }, [lastJsonMessage]);

  const sendMatchmake = (username: string) => {
    
    console.log(currentUser);
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
    setIsOn(currentUser.inviting_to_play)
    console.log(currentUser)
      
    Fetch();

    const windwoHeight = window.innerHeight;
    setTimeout(() => {
      const sectionPosition =
        matchupSectionRef.current?.getBoundingClientRect().top;
      matchupSectionRef.current.style.height = `${
        windwoHeight - sectionPosition - 33
      }px`;
    }, 100);
  }, []);

  const filteredPlayers = useMemo(() => {
    let newArr = playersData.filter((item: Profile) =>
      item.user.username.startsWith(usersSearch)
    );
  
    if (filter.includes(1)) {
      console.log("not implemented");
    }
  
    if (filter.includes(2)) {
      newArr = newArr.sort((a, b) => b.total_points - a.total_points);
    }
    return newArr;
  }, [playersData, usersSearch, filter]);


  const toggleSlider = () => {
    
    console.log(currentUser);

    sendJsonMessage(
        {
            'action': 'matchmake',
            'username': currentUser?.user.username,
            'protocol': 'control_user'
        }
    );
    console.log(isOn);
    setIsOn(!isOn);
  };

  return (
    <section ref={matchupSectionRef} className="flex w-[100%] gap-[2%] ">
      <div className=" flex flex-col h-[100%] w-[100%] ">
        <div className=" flex flex-col ">
          <h1 className="text-[48px] text-[#fff] ">Filter</h1>
          <div className="flex mt-[20px] justify-between ">
            <div className="flex gap-[20px] ">
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
                  className={`p-[10px] rounded-full border-[1px] borer-[#fff] ${
                    filter.includes(1) ? "bg-[#fff]" : ""
                  } `}
                >
                  <LuMapPin
                    style={
                      filter.includes(1)
                        ? { color: "black" }
                        : { color: "white" }
                    }
                  />
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
                  className={`p-[10px] rounded-full border-[1px] borer-[#fff] ${
                    filter.includes(2) ? "bg-[#fff]" : ""
                  } `}
                >
                  <CiStar
                    style={
                      filter.includes(2)
                        ? { color: "black" }
                        : { color: "white" }
                    }
                  />
                </div>
              </label>
            </div>
            <div className="relative w-24 h-8" onClick={() => toggleSlider()}>
              <div
                className={`absolute top-0 left-0 w-full h-full rounded-full transition-colors duration-300 ${
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
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  isOn ? "translate-x-16" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </div>
        <main className="flex flex-col gap-[20px] mt-[24px] md:mt-[32px] h-[100%] overflow-hidden ">
          <h1 className="text-[48px] text-[#fff] ">Players</h1>
          <div className="flex-1 overflow-hidden ">
            <div className="flex flex-col gap-[3.5%] h-[100%] max-h-[100%] overflow-y-auto playersScroll pr-[10px]">
              {filteredPlayers.map((item: Profile) => {
                

                return (
                    <PlayerCard
                    key={item.id}
                    player={item}
                    currentUser={currentUser}
                    onMatchmake={sendMatchmake}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <div className=" flex flex-col h-[100%] w-[55%] gap-[20px] overflow-hidden ">
        <div className="flex flex-col gap-[20px] ">
          <h1 className="text-[48px] text-[#ffffff] ">Matchups</h1>
          <div className="flex flex-col rounded-[20px]  border-[1px] border-[#243257d5] h-[238px] overflow-y-auto messagesScroll  ">
            {matchMakes?.map((item: Message, i: number) => {
              const index = (i + 10) * 100;
              return (
                <MatchMakesCard
                key={index * 100}
                index={index}
                i={i}
                length={matchMakes.length}
                item={item}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-[20px] ">
          <h1 className="text-[48px] text-[#ffffff] ">invations</h1>
          <div className="flex flex-col rounded-[20px]  border-[1px] border-[#243257d5] h-[238px] overflow-y-auto messagesScroll  ">
            {invitations?.map((item: Invitation, i: number) => {
              const index = (i + 10) * 100;
              return (
                <div
                  key={index}
                  className={`flex p-[20px] justify-between ${
                    i != matchMakes.length - 1 || matchMakes.length < 5
                      ? "border-b-[1px] border-b-[#243257d5]"
                      : ""
                  } `}
                >
                  <div className="flex flex-col gap-[10px] justify-center items-center pr-[20px] mr-[20px] border-r-[1px] border-r-[#243257d5] max-w-[74px] ">
                    <img
                      src={item.player_inviting.profile_image}
                      className="rounded-[50%] aspect-square "
                      alt="image"
                    />
                    <h1 className="text-[12px] text-[#fff] ">
                      {item.player_inviting.user.username}
                    </h1>
                  </div>
                  <div className=" flex items-center w-full justify-between ">
                    <h1 className="text-[20px] text-[#fff] ">
                      {item.player_inviting.user.username} invited you
                    </h1>
                    <div className="flex flex-col gap-[10px] ">
                      <button
                        className="bg-[#fab907] px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] "
                        onClick={() => {
                          acceptMatchmake(item.player_inviting.user.username);
                        }}
                      >
                        ACCEPT
                      </button>
                      <button
                        className="bg-red-600 px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] "
                        onClick={() => {
                          declineMatchmake(item.player_inviting.user.username);
                        }}
                      >
                        DECLINE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Matchup;
