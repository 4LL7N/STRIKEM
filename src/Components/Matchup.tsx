import axios from "axios";
import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";

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
    <section className="flex flex-col h-[100%] w-[100%]  ">
      {/* <div className=" flex flex-col "> */}
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
        <main className="flex flex-col gap-[20px] mt-[24px] md:mt-[32px] h-[100%] ">
          <h1 className="text-[48px] text-[#fff] ">Players</h1>
          <div className="flex flex-col gap-[4%] h-[100%] overflow-y-auto " >
            {players.map((item: Profile, i: number) => {
              return (
                <div
                  key={i}
                  className="flex  rounded-[20px] bg-[#161D2F] p-[10px] h-[16%] w-[100%]  "
                >\
                  {/* <img src={item.profile_image}   alt="profile_image" /> */}
                  <div  className="flex flex-col items-center gap-[10px] ">
                    <div className="flex gap-[2px] " >
                      <h1 className="text-[20px] text-[#fff] ">
                        {item.user.username}
                      </h1>
                      <h2 className="text-[14px] text-[#ffffff57] ">
                        ({item.user.first_name} {item.user.last_name})
                      </h2>
                    </div>
                    <h3 className="text-[14px] text-[#fff] " >Email:{item.user.email}</h3>
                  </div>
                </div>
              );
            })}
            
          </div>
        </main>
      {/* </div> */}
    </section>
  );
}

export default Matchup;
