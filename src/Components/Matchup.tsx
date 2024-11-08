/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import Cookies from "js-cookie";

import "./CSS/matchup.css";
import { useWebSocketContext } from "./Websocket";
// import { useWebSocketContext } from "./Websocket";

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

interface invitations {
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
    
    const [filter, setFilter] = useState<number[]>([]);
    
    const [playersData, setPlayersData] = useState<Profile[]>([]);
    const [players, setPlayers] = useState<Profile[]>([]);
    
    const [matchMakes, setMatchMakes] = useState<Message[]>([]);
    const [invitations, setInvitations] = useState<invitations[]>([]);
    
    const matchupSectionRef = useRef<any>();
    const [isOn, setIsOn] = useState(false);

  const handleCheckboxChange = (num: number) => {
    let filterArr = [...filter];
    if (filterArr.includes(num)) {
      filterArr = filterArr.filter((item) => item !== num);
      setFilter([...filterArr]);
    } else {
      filterArr.push(num);
      setFilter(filterArr);
    }
  };

  const Fetch = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios("https://strikem.site/api/filter-ratings/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setPlayers(response.data);
      setPlayersData(response.data);
      const matchmakeResponse = await axios(
        "https://strikem.site/api/matchups/",
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      console.log(matchmakeResponse.data.results);
      setMatchMakes(matchmakeResponse.data.results);

      const invationsResponse = await axios(
        "https://strikem.site/api/invitations/",
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      console.log(invationsResponse.data);
      setInvitations(invationsResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(lastJsonMessage);
    if(lastJsonMessage && lastJsonMessage.protocol == 'invite'){
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
    //   console.log(currentUser)
    const newInvites = [...invitations];
    const newInvite:any = {
      player_invited: {
        profile_image: currentUser.profile_image,
        total_points: currentUser.total_points,
        user:currentUser.user
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
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
    console.log(currentUser);
    sendJsonMessage({
      action: "matchmake",
      matchmaker_username: username,
      username: currentUser.user.username,
    });
  };

  const acceptMatchmake = (username: string) => {
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
    sendJsonMessage({
      action: "matchmake",
      username: currentUser.user.username,
      invite_sender_username: username,
      invite_response: "accept",
    });
  };

  const declineMatchmake = (username: string) => {
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
    sendJsonMessage({
      action: "matchmake",
      username: currentUser.user.username,
      invite_sender_username: username,
      invite_response: "deny",
    });
  };

  useEffect(() => {
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
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

  useEffect(() => {
    let newArr = playersData.filter((item: Profile) =>
      item.user.username.startsWith(usersSearch)
    );

    if (filter.includes(1)) {
      console.log("not implemented");
    }

    if (filter.includes(2)) {
      newArr = newArr.sort((a, b) => b.total_points - a.total_points);
    }
    setPlayers(newArr);
  }, [usersSearch, filter]);


  const toggleSlider = () => {
    let currentUser: any = localStorage?.getItem("currentUser");
    currentUser
      ? (currentUser = JSON.parse(currentUser))
      : (currentUser = null);
    console.log(currentUser);

    sendJsonMessage(
        {
            'action': 'matchmake',
            'username': currentUser.user.username,
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
              {players.map((item: Profile, i: number) => {
                let currentUser: any = localStorage?.getItem("currentUser");
                currentUser
                  ? (currentUser = JSON.parse(currentUser))
                  : (currentUser = null);

                return (
                  <div
                    key={i + 10}
                    className="flex justify-between items-center rounded-[20px] bg-[#161D2F] p-[16px] h-[17.4%] w-[100%]  "
                  >
                    <div className="flex gap-[20px] h-[100%] ">
                      <img
                        src={item.profile_image}
                        className="h-[100%] aspect-square rounded-full "
                        alt="profile_image"
                      />
                      <div className="flex flex-col items-center justify-start text-left gap-[10px] ">
                        <div className="flex gap-[2px] items-end ">
                          <h1 className="text-[18px] text-[#fff]  ">
                            {item.user.username}
                          </h1>
                          <h2 className="text-[12px] text-[#ffffff57] ">
                            ({item.user.first_name} {item.user.last_name})
                          </h2>
                        </div>
                        <h3 className="text-[10px] text-[#fff] self-start ">
                          Email:{item.user.email}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-[5px]">
                      <CiStar size={28} style={{ color: "white" }} />
                      <p className="text-[18px] text-[#fff]  ">
                        {item.total_points}
                      </p>
                    </div>
                    <button
                      className={` ${
                        item.user.id == currentUser.user.id &&
                        "bg-transparent text-transparent"
                      } bg-[#fab907] px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] `}
                      onClick={
                        item.user.id == currentUser.user.id
                          ? () => {}
                          : () => {
                              sendMatchmake(item.user.username);
                            }
                      }
                    >
                      Matchmake
                    </button>
                  </div>
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

              // const options:any = {
              //     year: 'numeric',
              //     month: 'long',  // Use 'short' for abbreviated month (e.g., Nov)
              //     day: 'numeric',
              //     hour: 'numeric',
              //     minute: 'numeric',
              //     timeZone: 'UTC',
              //     timeZoneName: 'short'  // For UTC display
              //   };
              // const date =  new Date(item.match_time).toLocaleString('en-US', options);
              return (
                <div
                  key={index}
                  className={`flex p-[20px] justify-between ${
                    i != matchMakes.length - 1 || matchMakes.length < 5
                      ? "border-b-[1px] border-b-[#243257d5]"
                      : ""
                  } `}
                >
                  <div className="flex flex-col gap-[10px] justify-center items-center pr-[20px] border-r-[1px] border-r-[#243257d5] max-w-[74px] ">
                    <img
                      src={item.player_accepting.profile_image}
                      className="rounded-[50%] aspect-square "
                      alt="image"
                    />
                    <h1 className="text-[12px] text-[#fff] ">
                      {item.player_accepting.user.username}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-[5px] items-center w-[100%] ">
                    {/* <p className="text-[12px] text-[#fff] ">{item.status}</p> */}
                    {/* <p className="text-[12px] text-[#fff] ">{date}</p> */}
                    {/* <p className="text-[12px] text-[#fff] ">{item.message}</p> */}
                  </div>
                  <div className="flex flex-col gap-[10px] justify-center items-center pl-[20px] border-l-[1px] border-l-[#243257d5] max-w-[74px] ">
                    <img
                      src={item.player_inviting.profile_image}
                      className="rounded-[50%] aspect-square"
                      alt="image"
                    />
                    <h1 className="text-[12px] text-[#fff] ">
                      {item.player_inviting.user.username}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-[20px] ">
          <h1 className="text-[48px] text-[#ffffff] ">invations</h1>
          <div className="flex flex-col rounded-[20px]  border-[1px] border-[#243257d5] h-[238px] overflow-y-auto messagesScroll  ">
            {invitations?.map((item: invitations, i: number) => {
              const index = (i + 10) * 100;
              console.log("asd");
              // const options:any = {
              //     year: 'numeric',
              //     month: 'long',  // Use 'short' for abbreviated month (e.g., Nov)
              //     day: 'numeric',
              //     hour: 'numeric',
              //     minute: 'numeric',
              //     timeZone: 'UTC',
              //     timeZoneName: 'short'  // For UTC display
              //   };
              // const date =  new Date(item.match_time).toLocaleString('en-US', options);
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
