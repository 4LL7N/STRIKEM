import { memo } from 'react'

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username:string;
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

const History = memo(({item,outcome,myStats,opponentStats}:{item:GameResult,outcome:string,myStats:Player,opponentStats:Player}) =>{
  return (
    <div className={` flex items-center p-[16px] md:p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[32px] md:rounded-[48px] ${ outcome == 'WIN'? 'bg-[#28a74678] ':'bg-[#dc35468e]'} lg:bg-transparent `} >
                        <h2 className={`hidden lg:flex text-[48px] ${outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
                        <div className="flex w-[100%] justify-between " >
                        <div className="flex items-center gap-[8px] md:gap-[12px] " >
                          <div>
                            <img src={myStats?.profile_image} className="  h-[48px] md:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
                            <h1 className="md:hidden text-[16px] lg:text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                            </div>  
                            <div>
                                <h1 className=" hidden md:flex text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                                <p className=" text-[11px] md:text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
                                <p className={`text-[11px] md:text-[16px] text-[#fff]  `} >{outcome == 'WIN'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between" >
                            <h2 className="text-[#fff] text-[40px] md:text-[96px] ">{outcome == 'WIN'?item.result_winner:item.result_loser}</h2>
                        <img src="/media/vs1.png" className=" h-[40px] md:h-[96px] aspect-square " alt="" />
                            <h2  className="text-[#fff] text-[40px] md:text-[96px] " >{outcome == 'LOSE'?item.result_winner:item.result_loser}</h2>
                        </div>
                        <div className="flex items-center gap-[8px] md:gap-[12px] " >
                            <div className="flex flex-col items-end " >
                                <h1 className="hidden md:flex text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
                                <p className=" text-[11px] md:text-[16px] text-[#fff]  " >{opponentStats.total_points}:points</p>
                                <p className={` text-[11px] md:text-[16px] text-[#fff]  `}>{outcome == 'LOSE'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                            </div>
                            <div  >
                            <img src={opponentStats?.profile_image} className="  h-[48px] md:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
                            <h1 className=" md:hidden text-[16px] md:text-[28px] text-[#fff] " >{opponentStats?.user.username}</h1>
                            </div> 
                        </div>
                        </div>
                    </div>
  )
})

export default History