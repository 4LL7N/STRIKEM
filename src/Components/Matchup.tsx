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
      const response = await axios("http://strikem.site/api/players/");
      setPlayers(response.data);
      setPlayersData(response.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Fetch();

    const windwoHeight = window.innerHeight
    setTimeout(()=>{
        const sectionPosition = matchupSectionRef.current?.getBoundingClientRect().top
        console.log(sectionPosition)
        console.log(windwoHeight)
        matchupSectionRef.current.style.height = `${windwoHeight-sectionPosition-33}px`
    },500)


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
    <section ref={matchupSectionRef} className="flex flex-col w-[100%]  ">
      <div className=" flex flex-col h-[100%] ">
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
          </div>
          </div>
        </main>
      </div>
      <div>
        <h1></h1>
      </div>
    </section>
  );
}

export default Matchup;
