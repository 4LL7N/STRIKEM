/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { useLocation } from "react-router-dom";
import ProfileInfo from "./UsersMemo/ProfileInfo";
import TabsNavigation from "./UsersMemo/TabsNavigation";
import { GameResult, Player } from "../type";



  

function User() {
  const location = useLocation()
  const [userInfo, setUserInfo] = useState<Player|null>(null);
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
    <main className="flex flex-col items-center bg-[#10141E] min-w-[100%] min-h-screen mt-[24px] md:pb-[120px]">
      <section className="w-[100%] flex flex-col justify-center">
        <button className="text-white" onClick={()=>{console.log('user');
        }} >12312</button>
        <ProfileInfo userInfo={userInfo} />
        <TabsNavigation gameHistory={gameHistory} winHistory={winHistory} loseHistory={loseHistory} userInfo={userInfo}/>
      </section>
    </main>
  );
}

export default User;
