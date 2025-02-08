import React from 'react'
import History from './History';
import "../CSS/tabNavigation.css"

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


const TabsNavigation = React.memo(({ gameHistory, winHistory, loseHistory, userInfo }:{gameHistory:GameResult[]|undefined, winHistory:GameResult[]|undefined, loseHistory:GameResult[]|undefined, userInfo:Profile|null}) => (
    <div className="mt-[48px] max-w-[100%]">
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
        <button
                className="nav-link active text-[#fab907] hover:text-[#fab907] hover:border-[#fab907] "
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
                className="nav-link text-[#fab907] hover:text-[#fab907] hover:border-[#fab907]"
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
                className="nav-link text-[#fab907] hover:text-[#fab907] hover:border-[#fab907] "
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
      <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active px-2 "
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
                    <History key={i} item={item} outcome={outcome} myStats={myStats} opponentStats={opponentStats} />
                )
              })}
            </div>
            <div
              className="tab-pane fade px-2 "
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              {winHistory?.map((item:GameResult,i:number)=>{
                const outcome:string = 'WIN' ;
                const myStats:Player = item.winner_player;
                const opponentStats:Player = item.loser_player;
                return(

                  // <div key={i} className={` flex items-center p-[16px] lg:p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[32px] lg:rounded-[48px] ${ outcome == 'WIN'? 'bg-[#28a74678]':'bg-[#dc35468e]'} lg:bg-transparent `} >
                  //       <h2 className={`hidden lg:flex text-[48px] ${ outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
                  //       <div className="flex w-[100%] justify-between " >
                  //       <div className="flex items-center gap-[8px] lg:gap-[12px] " >
                  //         <div>
                  //           <img src={myStats?.profile_image} className="  h-[48px] lg:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
                  //           <h1 className=" text-[16px] lg:text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                  //           </div>  
                  //           <div>
                  //               <h1 className=" hidden lg:flex text-[28px] text-[#fff] " >{myStats.user.username}</h1>
                  //               <p className=" text-[11px] lg:text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
                  //               <p className={`text-[11px] lg:text-[16px] text-[#fff]  `} >{outcome == 'WIN'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                  //           </div>
                  //       </div>
                  //       <div className=" flex items-center justify-between" >
                  //           <h2 className="text-[#fff] text-[40px] lg:text-[96px] ">{outcome == 'WIN'?item.result_winner:item.result_loser}</h2>
                  //       <img src="/media/vs1.png" className=" h-[40px] lg:h-[96px] aspect-square " alt="" />
                  //           <h2  className="text-[#fff] text-[40px] lg:text-[96px] " >{outcome == 'LOSE'?item.result_winner:item.result_loser}</h2>
                  //       </div>
                  //       <div className="flex items-center gap-[8px] lg:gap-[12px] " >
                  //           <div className="flex flex-col items-end " >
                  //               <h1 className="hidden lg:flex text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
                  //               <p className=" text-[11px] lg:text-[16px] text-[#fff]  " >{opponentStats.total_points}:points</p>
                  //               <p className={` text-[11px] lg:text-[16px] text-[#fff]  `}>{outcome == 'LOSE'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
                  //           </div>
                  //           <div  >
                  //           <img src={opponentStats?.profile_image} className="  h-[48px] lg:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
                  //           <h1 className=" text-[16px] lg:text-[28px] text-[#fff] " >{opponentStats?.user.username}</h1>
                  //           </div> 
                  //       </div>
                  //       </div>
                  //   </div>
                  <History key={i} item={item} outcome={outcome} myStats={myStats} opponentStats={opponentStats} />
                )
              })}
            </div>
            <div
              className="tab-pane fade px-2 "
              id="nav-contact"
              role="tabpanel"
              aria-labelledby="nav-contact-tab"
            >
              {loseHistory?.map((item:GameResult,i:number)=>{
                const outcome:string = 'LOSE' ;
                const opponentStats:Player = item.winner_player;
                const myStats:Player = item.loser_player;
                
                return(
              //     <div key={i} className={` flex items-center p-[16px] lg:p-[24px] mt-[24px] border !border-[#ffffff80] rounded-[32px] lg:rounded-[48px] ${ outcome == 'WIN'? 'bg-[#28a74678]':'bg-[#dc35468e]'} lg:bg-transparent `} >
              //     <h2 className={`hidden lg:flex text-[48px] ${ outcome == 'WIN'? 'text-[#28a745]':'text-[#dc3545]'} mr-[24px] `} >{outcome}</h2>
              //     <div className="flex w-[100%] justify-between " >
              //     <div className="flex items-center gap-[8px] lg:gap-[12px] " >
              //       <div>
              //         <img src={myStats?.profile_image} className="  h-[48px] lg:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
              //         <h1 className=" text-[16px] lg:text-[28px] text-[#fff] " >{myStats.user.username}</h1>
              //         </div>  
              //         <div>
              //             <h1 className=" hidden lg:flex text-[28px] text-[#fff] " >{myStats.user.username}</h1>
              //             <p className=" text-[11px] lg:text-[16px] text-[#fff] " >points: {myStats.total_points}</p>
              //             <p className={`text-[11px] lg:text-[16px] text-[#fff]  `} >{outcome == 'WIN'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
              //         </div>
              //     </div>
              //     <div className=" flex items-center justify-between" >
              //         <h2 className="text-[#fff] text-[40px] lg:text-[96px] ">{outcome == 'WIN'?item.result_winner:item.result_loser}</h2>
              //     <img src="/media/vs1.png" className=" h-[40px] lg:h-[96px] aspect-square " alt="" />
              //         <h2  className="text-[#fff] text-[40px] lg:text-[96px] " >{outcome == 'LOSE'?item.result_winner:item.result_loser}</h2>
              //     </div>
              //     <div className="flex items-center gap-[8px] lg:gap-[12px] " >
              //         <div className="flex flex-col items-end " >
              //             <h1 className="hidden lg:flex text-[28px] text-[#fff] " >{opponentStats.user.username}</h1>
              //             <p className=" text-[11px] lg:text-[16px] text-[#fff]  " >{opponentStats.total_points}:points</p>
              //             <p className={` text-[11px] lg:text-[16px] text-[#fff]  `}>{outcome == 'LOSE'?`+${item.points_given}`:`-${item.penalty_points}`}</p>
              //         </div>
              //         <div  >
              //         <img src={opponentStats?.profile_image} className="  h-[48px] lg:h-[96px] aspect-square rounded-[50%] " alt="myProfile" />
              //         <h1 className=" text-[16px] lg:text-[28px] text-[#fff] " >{opponentStats?.user.username}</h1>
              //         </div> 
              //     </div>
              //     </div>
              // </div>
              <History key={i} item={item} outcome={outcome} myStats={myStats} opponentStats={opponentStats} />
                )
              })}
            </div>
          </div>
      </div>
    </div>
  ));

export default TabsNavigation