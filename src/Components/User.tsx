import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


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
  user: User;
}

interface User {
    first_name: string;
    last_name: string;
    email: string;
    id: number;
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
    timestamp: string; // You might also consider using Date if you're parsing this
    poolhouse: Poolhouse;
  }
  

function User() {
//   const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<Profile>();
  const [gameHistory,setGameHistory] = useState<GameResult[]>()
  const [winHistory,setWinHistory] = useState<GameResult[]>()
  const [loseHistory,setLoseHistory] = useState<GameResult[]>()

  const Fetch = async () => {
    const token = Cookies.get('token')
    try {
      const response = await axios.get(
        `https://strikem.site/auth/users/me/`,
        {
          headers: {
            Authorization:
              `JWT ${token}`,
          },
        }
      );
      const data = response.data;
      // data.profile_image = data.profile_image.split("/").splice(3).join("/");
      console.log(data)
      setUserInfo(data);
      
      const historyResponse = await axios.get(
        `https://strikem.site/api/history/`,
        {
          headers: {
            Authorization:
              `JWT ${token}`,
          },
        }
      );

      const historyData = historyResponse.data
      console.log(historyData)
      setGameHistory(historyData)
      const wins = historyData.filter((item:GameResult)=> {if(item.winner_player.user.first_name == data?.user.first_name && item.winner_player.user.last_name == data?.user.last_name)return item} )
      setWinHistory(wins)
      const loses = historyData.filter((item:GameResult)=> {if(item.loser_player.user.first_name == data?.user.first_name && item.loser_player.user.last_name == data?.user.last_name)return item} )
      setLoseHistory(loses)
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    Fetch();
  }, []);

  return (
    <section className="flex flex-col items-center bg-[#10141E] w-screen min-h-screen  md:pb-[120px] md:px-[25px]">
      <header className="w-[100%]  bg-[#161D2F] p-[16px] md:px-[20px] md:mx-[25px] flex items-center justify-between md:rounded-[10px] mb-[24px] md:my-[24px] lg:my-[48px] ">
        <Link
          to="/home"
          className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/public/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] '
        />
        <img
          className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[40px] lg:h-[40px]"
          src="/images/image-avatar.png"
        />
      </header>
      <main className="w-[100%] flex flex-col justify-center">
        <div className=" flex w-[90%] gap-[30px] items-center justify-start ">
          <img
            src={`/${userInfo?.profile_image}`}
            alt="profile"
            className="w-[256px] h-[256px] rounded-[50%] mx-[20px] "
          />

          <div className="flex flex-col  flex-grow ">
            <div className="w-[100%] flex justify-start items-end">
              <h1 className="text-[#fff]  text-[48px] ">
                {/* {userInfo?.username} */}
                
              </h1>
              {/* <p className="text-[#7e7e7e]  text-[32px] ">({userInfo?.first_name} {userInfo?.last_name})</p> */}
            </div>
            <div className=" flex mt-[15px] ">
              <div className="flex-1 flex-col">
                <p className="text-[#fff] text-[24px] ">
                  Games:{userInfo?.games_played}
                </p>
                <p className="text-[#fff] text-[24px] ">
                  Wins:{userInfo?.games_won}
                </p>
                <p className="text-[#fff] text-[24px] ">
                  Loses:
                  {userInfo?.games_played &&
                    userInfo?.games_played - userInfo?.games_won}
                </p>
                <p className="text-[#fff] text-[24px] ">
                  Meets:{userInfo?.opponents_met}
                </p>
                <p className="text-[#fff] text-[24px] ">
                  Points:{userInfo?.total_points}
                </p>
              </div>
              <div className=" flex-col flex-1 ">
                <p className="text-[#fff] text-[24px] ">
                  {/* Email:{userInfo?.email} */}
                </p>
                <button className="rounded-[10px] px-[8px] py-[6px] text-[#fff] bg-[#fab907] mt-[5px] ">
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[48px]" >
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active  "
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                Games
              </button>
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Wins
              </button>
              <button
                className="nav-link"
                id="nav-contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-contact"
                type="button"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                Loses
              </button>
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              {gameHistory?.map((item:GameResult,i:number)=>{
                let outcome:string = 'WIN' ;
                let myStats:Player = item.winner_player;
                let opponentStats:Player = item.loser_player;
                if(item.winner_player.user.first_name == userInfo?.user.first_name && item.winner_player.user.last_name == userInfo?.user.last_name){
                    outcome = 'WIN'
                    myStats = item.winner_player
                    opponentStats = item.loser_player
                }else if(item.loser_player.user.first_name == userInfo?.user.first_name && item.loser_player.user.last_name == userInfo?.user.last_name){
                    outcome = 'LOSE'
                    opponentStats = item.winner_player
                    myStats = item.loser_player
                }

                return(
                    <div key={i} className=" flex items-center p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[48px] " >
                        <h2 className={`text-[48px] ${ outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
                        <div className="flex w-[100%] justify-between " >
                        <div className="flex items-center gap-[12px] " >
                            <img src={myStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                            <div>
                                <h1 className="text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
                                <p className={`text-[16px] text-[#fff]  `} >{outcome == 'WIN'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between" >
                            <h2 className="text-[#fff] text-[96px] ">{outcome == 'WIN'?item.result_winner:item.result_loser}</h2>
                        <img src="/media/vs1.png" className="w-[96px] h-[96px]" alt="" />
                            <h2  className="text-[#fff] text-[96px] " >{outcome == 'LOSE'?item.result_winner:item.result_loser}</h2>
                        </div>
                        <div className="flex items-center gap-[12px] " >
                            <div className="flex flex-col items-end " >
                                <h1 className="text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {opponentStats.total_points}</p>
                                <p className={`text-[16px] text-[#fff] `}>{outcome == 'LOSE'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                            </div>
                            <img src={opponentStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                        </div>
                        </div>
                    </div>
                )
              })}
            </div>
            <div
              className="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              {winHistory?.map((item:GameResult,i:number)=>{
                const outcome:string = 'WIN' ;
                const myStats:Player = item.winner_player;
                const opponentStats:Player = item.loser_player;
                return(
                    <div key={i} className=" flex items-center p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[48px] " >
                        <h2 className={`text-[48px] ${ outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
                        <div className="flex w-[100%] justify-between " >
                        <div className="flex items-center gap-[12px] " >
                            <img src={myStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                            <div>
                                <h1 className="text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
                                <p className="text-[16px] text-[#fff] " >+{item.points_given}</p>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between" >
                            <h2 className="text-[#fff] text-[96px] ">{item.result_winner}</h2>
                        <img src="/media/vs1.png" className="w-[96px] h-[96px]" alt="" />
                            <h2  className="text-[#fff] text-[96px] " >{item.result_loser}</h2>
                        </div>
                        <div className="flex items-center gap-[12px] " >
                            <div className="flex flex-col items-end " >
                                <h1 className="text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {opponentStats.total_points}</p>
                                <p className="text-[16px] text-[#fff] " >-{item.penalty_points}</p>
                            </div>
                            <img src={opponentStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                        </div>
                        </div>
                    </div>
                )
              })}
            </div>
            <div
              className="tab-pane fade"
              id="nav-contact"
              role="tabpanel"
              aria-labelledby="nav-contact-tab"
            >
              {loseHistory?.map((item:GameResult,i:number)=>{
                const outcome:string = 'LOSE' ;
                const opponentStats:Player = item.winner_player;
                const myStats:Player = item.loser_player;
                
                return(
                    <div key={i} className=" flex items-center p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[48px] " >
                        <h2 className={`text-[48px] ${ outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
                        <div className="flex w-[100%] justify-between " >
                        <div className="flex items-center gap-[12px] " >
                            <img src={myStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                            <div>
                                <h1 className="text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
                                <p className="text-[16px] text-[#fff] " >-{item.penalty_points}</p>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between" >
                            <h2 className="text-[#fff] text-[96px] ">{item.result_loser}</h2>
                        <img src="/media/vs1.png" className="w-[96px] h-[96px]" alt="" />
                            <h2  className="text-[#fff] text-[96px] " >{item.result_winner}</h2>
                        </div>
                        <div className="flex items-center gap-[12px] " >
                            <div className="flex flex-col items-end " >
                                <h1 className="text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
                                <p className="text-[16px] text-[#fff] " >points: {opponentStats.total_points}</p>
                                <p className="text-[16px] text-[#fff] " >+{item.points_given}</p>
                            </div>
                            <img src={opponentStats?.profile_image} className="w-[96px] h-[96px] rounded-[50%] " alt="myProfile" />
                        </div>
                        </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default User;
