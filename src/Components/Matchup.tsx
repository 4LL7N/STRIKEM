/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";

import './CSS/matchup.css'

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

function Matchup({usersSearch}:{usersSearch:string}) {

    const messagesData = [
        {
          "id": 1,
          "player1": {
            "id": 101,
            "username": "PlayerOne",
            "profile_image": "https://randomuser.me/api/portraits/men/1.jpg"
          },
          "player2": {
            "id": 102,
            "username": "PlayerTwo",
            "profile_image": "https://randomuser.me/api/portraits/women/1.jpg"
          },
          "match_time": "2024-11-05T14:30:00Z",
          "status": "upcoming",
          "message": "You have a matchup scheduled with PlayerTwo."
        },
        {
          "id": 2,
          "player1": {
            "id": 101,
            "username": "PlayerOne",
            "profile_image": "https://randomuser.me/api/portraits/men/1.jpg"
          },
          "player2": {
            "id": 103,
            "username": "PlayerThree",
            "profile_image": "https://randomuser.me/api/portraits/women/2.jpg"
          },
          "match_time": "2024-11-05T16:00:00Z",
          "status": "completed",
          "message": "You won your matchup against PlayerThree!"
        },
        {
          "id": 3,
          "player1": {
            "id": 104,
            "username": "PlayerFour",
            "profile_image": "https://randomuser.me/api/portraits/women/3.jpg"
          },
          "player2": {
            "id": 101,
            "username": "PlayerOne",
            "profile_image": "https://randomuser.me/api/portraits/men/1.jpg"
          },
          "match_time": "2024-11-06T10:00:00Z",
          "status": "upcoming",
          "message": "PlayerFour has challenged you to a match."
        }
      ]
      
      

  const [filter, setFilter] = useState<number[]>([]);

  const [playersData, setPlayersData] = useState<Profile[]>([]);
  const [players, setPlayers] = useState<Profile[]>([]);

  const matchupSectionRef = useRef<any>()

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
    try {
      const response = await axios("https://strikem.site/api/players/");
      setPlayers(response.data);
      setPlayersData(response.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Fetch();

    const windwoHeight = window.innerHeight
    console.log(window.innerHeight)
    console.log(window.innerWidth)
    setTimeout(()=>{
        const sectionPosition = matchupSectionRef.current?.getBoundingClientRect().top
        console.log(sectionPosition)
        console.log(windwoHeight)
        matchupSectionRef.current.style.height = `${windwoHeight-sectionPosition-33}px`
    },10)


  }, []);

  
  
  useEffect(()=>{
    let newArr = playersData.filter((item:Profile)=> item.user.username.startsWith(usersSearch))

    if(filter.includes(1)){
        console.log('not implemented')
    }

    if(filter.includes(2)){
        newArr = newArr.sort((a,b)=>b.total_points-a.total_points)
    }
    setPlayers(newArr)
  },[usersSearch,filter])

  return (
    <section ref={matchupSectionRef} className="flex w-[100%] gap-[2%] ">
      <div className=" flex flex-col h-[100%] w-[100%] ">
        <div className=" flex flex-col ">
          <h1 className="text-[48px] text-[#fff] ">Filter</h1>
          <div className="flex mt-[20px] gap-[20px]">
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
                    filter.includes(1) ? { color: "black" } : { color: "white" }
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
                    filter.includes(2) ? { color: "black" } : { color: "white" }
                  }
                />
              </div>
            </label>
          </div>
        </div>
        <main className="flex flex-col gap-[20px] mt-[24px] md:mt-[32px] h-[100%] overflow-hidden ">
          <h1 className="text-[48px] text-[#fff] ">Players</h1>
          <div className="flex-1 overflow-hidden " >
          <div className="flex flex-col gap-[3.5%] h-[100%] max-h-[100%] overflow-y-auto playersScroll pr-[10px]" >
            {players.map((item: Profile, i: number) => {
              return (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-[20px] bg-[#161D2F] p-[16px] h-[17.4%] w-[100%]  "
                >
                    <div className="flex gap-[20px] h-[100%] " >
                  <img src={item.profile_image}  className="h-[100%] aspect-square rounded-full "  alt="profile_image" />
                  <div  className="flex flex-col items-center justify-start text-left gap-[10px] ">
                    <div className="flex gap-[2px] items-end " >
                      <h1 className="text-[18px] text-[#fff]  ">
                        {item.user.username}
                      </h1>
                      <h2 className="text-[12px] text-[#ffffff57] ">
                        ({item.user.first_name} {item.user.last_name})
                      </h2>
                    </div>
                    <h3 className="text-[10px] text-[#fff] self-start " >Email:{item.user.email}</h3>
                  </div>
                  </div>
                  <div className="flex gap-[5px]" >
                    <CiStar size={28} style={{ color: "white" }}/>
                    <p className="text-[18px] text-[#fff]  ">{item.total_points}</p>
                    </div>
                    <button className="bg-[#fab907] px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] " >
                        Matchup
                    </button>
                </div>
              );
            })}
             {players.map((item: Profile, i: number) => {
              return (
                <div
                  key={(i+1)*players.length}
                  className="flex justify-between items-center rounded-[20px] bg-[#161D2F] p-[16px] h-[17.4%] w-[100%]  "
                >
                    <div className="flex gap-[20px] h-[100%] " >
                  <img src={item.profile_image}  className="h-[100%] aspect-square rounded-full "  alt="profile_image" />
                  <div  className="flex flex-col items-center justify-start text-left gap-[10px] ">
                    <div className="flex gap-[2px] items-end " >
                      <h1 className="text-[18px] text-[#fff]  ">
                        {item.user.username}
                      </h1>
                      <h2 className="text-[12px] text-[#ffffff57] ">
                        ({item.user.first_name} {item.user.last_name})
                      </h2>
                    </div>
                    <h3 className="text-[10px] text-[#fff] self-start " >Email:{item.user.email}</h3>
                  </div>
                  </div>
                  <div className="flex gap-[5px]" >
                    <CiStar size={28} style={{ color: "white" }}/>
                    <p className="text-[18px] text-[#fff]  ">{item.total_points}</p>
                    </div>
                    <button className="bg-[#fab907] px-[8px] py-[4px] text-[#FFF] hover:bg-[#FFF] hover:text-[#161D2F] rounded-[20px] " >
                        Matchup
                    </button>
                </div>
              );
            })}
          </div>
          </div>
        </main>
      </div>
      <div className=" flex flex-col h-[100%] w-[55%] gap-[20px] overflow-hidden " >
        <h1 className="text-[48px] text-[#ffffff] " >Matchups</h1>
        <div className="flex flex-col rounded-[20px]  border-[1px] border-[#243257d5] h-[100%] overflow-y-auto messagesScroll  " >
            {messagesData.map((item,i)=>{
                const index = i * playersData.length * players.length

                const options:any = {
                    year: 'numeric',
                    month: 'long',  // Use 'short' for abbreviated month (e.g., Nov)
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: 'UTC',
                    timeZoneName: 'short'  // For UTC display
                  };
                const date =  new Date(item.match_time).toLocaleString('en-US', options);
                return(
                    <div key={index} className={`flex p-[20px] justify-between ${i!=messagesData.length-1 || messagesData.length < 5 ?'border-b-[1px] border-b-[#243257d5]':''} `}  >
                        <div className="flex flex-col gap-[10px] justify-center pr-[20px] border-r-[1px] border-r-[#243257d5] max-w-[74px] " >
                            
                            <img src={item.player1.profile_image} className="rounded-full" alt="image" />
                            <h1 className="text-[12px] text-[#fff] " >{item.player1.username}</h1>
                            
                        </div>
                        <div className="flex flex-col gap-[5px] items-center w-[100%] " >
                            <p className="text-[12px] text-[#fff] ">{item.status}</p>
                            <p className="text-[12px] text-[#fff] ">{date}</p>
                            <p className="text-[12px] text-[#fff] ">{item.message}</p>
                        </div>
                        <div className="flex flex-col gap-[10px] justify-center pl-[20px] border-l-[1px] border-l-[#243257d5] max-w-[74px] " >
                            
                            <img src={item.player2.profile_image} className="rounded-full" alt="image" />
                            <h1 className="text-[12px] text-[#fff] " >{item.player2.username}</h1>
                            
                        </div>
                    </div>
                )
            })}
            {messagesData.map((item,i)=>{
                const index = i * playersData.length * players.length

                const options:any = {
                    year: 'numeric',
                    month: 'long',  // Use 'short' for abbreviated month (e.g., Nov)
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: 'UTC',
                    timeZoneName: 'short'  // For UTC display
                  };
                const date =  new Date(item.match_time).toLocaleString('en-US', options);
                return(
                    <div key={index} className={`flex p-[20px] justify-between ${i!=messagesData.length-1?'border-b-[1px] border-b-[#243257d5]':''} `}  >
                        <div className="flex flex-col gap-[10px] justify-center pr-[10px] border-r-[1px] border-r-[#243257d5] max-w-[64px] " >
                            
                            <img src={item.player1.profile_image} className="rounded-full" alt="image" />
                            <h1 className="text-[12px] text-[#fff] " >{item.player1.username}</h1>
                            
                        </div>
                        <div className="flex flex-col gap-[5px] items-center w-[100%] " >
                            <p className="text-[12px] text-[#fff] ">{item.status}</p>
                            <p className="text-[12px] text-[#fff] ">{date}</p>
                            <p className="text-[12px] text-[#fff] ">{item.message}</p>
                        </div>
                        <div className="flex flex-col gap-[10px] justify-center pl-[10px] border-l-[1px] border-l-[#243257d5] max-w-[64px] " >
                            
                            <img src={item.player2.profile_image} className="rounded-full" alt="image" />
                            <h1 className="text-[12px] text-[#fff] " >{item.player2.username}</h1>
                            
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </section>
  );
}

export default Matchup;
