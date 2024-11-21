/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { useLocation } from "react-router-dom";
import ProfileInfo from "./UsersMemo/ProfileInfo";
import TabsNavigation from "./UsersMemo/TabsNavigation";


interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username:string;
}

interface Profile {
  games_played: number;
  games_won: number;
  id: number;
  inviting_to_play: boolean;
  opponents_met: number;
  profile_image: string;
  total_points: number;
  user:User
}

  
  interface Player {
    user: User;
    profile_image: string;
    total_points: number;
  }
  
  interface Poolhouse {
    id: number;
    title: string;
    address: string;
  }
  
  interface GameResult {
    winner_player: Player;
    loser_player: Player;
    result_winner: number;
    result_loser: number;
    points_given: number;
    penalty_points: number;
    tie: boolean;
    timestamp: string; 
    poolhouse: Poolhouse;
  }
  

function User() {
  const location = useLocation()
  const [userInfo, setUserInfo] = useState<Profile|null>(null);
  const [gameHistory,setGameHistory] = useState<GameResult[]>()
  // const [winHistory,setWinHistory] = useState<GameResult[]>()
  // const [loseHistory,setLoseHistory] = useState<GameResult[]>()

  const Fetch = async () => {
    const token = Cookies.get('token')
    
    const dataUrl = location.pathname.split('/')[2] == 'me'?"https://strikem.site/users/current-user":`https://strikem.site/api/players/${location.pathname.split('/')[2]}`
    try {
      const response = await axios.get(
        dataUrl,
        {
          headers: {
            Authorization:
              `JWT ${token}`,
          },
        }
      );
      const data = response.data;
      setUserInfo(data);

      const historyResponse = await axios.get(
        `https://strikem.site/api/players/${data.id}/history/`,
        {
          headers: {
            Authorization:
              `JWT ${token}`,
          },
        }
      );

      const historyData = historyResponse.data
      setGameHistory(historyData)
      // const wins = historyData.filter((item:GameResult)=> {if(item.winner_player.user.first_name == data?.user.first_name && item.winner_player.user.last_name == data?.user.last_name)return item} )
        // setWinHistory(wins)
      // const loses = historyData.filter((item:GameResult)=> {if(item.loser_player.user.first_name == data?.user.first_name && item.loser_player.user.last_name == data?.user.last_name)return item} )      
        // setLoseHistory(loses)
    } catch (err) {
      console.error(err);
    }
  };

  const winHistory = useMemo(
    () => gameHistory?.filter(
      (item) => item.winner_player.user.id === userInfo?.user.id
    ),
    [gameHistory, userInfo]
  );

  const loseHistory = useMemo(
    () => gameHistory?.filter(
      (item) => item.loser_player.user.id === userInfo?.user.id
    ),
    [gameHistory, userInfo]
  );

  useEffect(() => {
    Fetch();
  }, []);

  return (
    <section className="flex flex-col items-center bg-[#10141E] min-w-[100%] min-h-screen mt-[24px] md:pb-[120px]">
      <main className="w-[100%] flex flex-col justify-center">
        <ProfileInfo userInfo={userInfo} />
        <TabsNavigation gameHistory={gameHistory} winHistory={winHistory} loseHistory={loseHistory} userInfo={userInfo}/>
      </main>
    </section>
  );
}

export default User;
