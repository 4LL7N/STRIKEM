import axios from "axios";
import { memo, useEffect, useState,
   useMemo 
  } from "react";
import Cookies from "js-cookie";

interface Player {
  id: number;
  profile_image: string;
  total_points: number;
  user: {
    email: string;
    first_name: string;
    last_name: string;
    id: number;
    username: string;
  };
}

interface Match {
  id: string;
  players: Player[];
  pooltable: number;
  status_finished: boolean;
}


interface ResultBoxProps {
  yourPointsInput: React.Ref<HTMLInputElement>;
  yourPoints: number;
  opponentsPointsInput: React.Ref<HTMLInputElement>;
  opponentsPoints: number;
  setYourPoints: (yourPoints: number) => void;
  setOpponentsPoints: (opponentsPoints: number) => void;
  windowWidth: number;
  openResultBox: boolean;
  setOpenResultBox: (openResultBox: boolean) => void;
}

const ResultBoxMemo = memo(
  ({
    yourPointsInput,
    yourPoints,
    opponentsPointsInput,
    opponentsPoints,
    setYourPoints,
    setOpponentsPoints,
    windowWidth,
    openResultBox,
    setOpenResultBox,
  }: ResultBoxProps) => {

    const currentUser = useMemo(() => {
            return localStorage.getItem("currentUser") 
              ? JSON.parse(localStorage.getItem("currentUser")!) 
              : null;
          }, []);
    const sessionId = localStorage.getItem("sessionId");

    const [currentSession, setCurrentSession] = useState<Match>();

    const fetchCurrentSession = async () => {
      const token = Cookies.get("token");
      try {
        const CurrentSessionResponse = await axios(
          `https://strikem.site/api/game-session/${sessionId}/`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        console.log(CurrentSessionResponse.data);
        setCurrentSession(CurrentSessionResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    const postResult = async () => {
      const token = Cookies.get("token");
      
      try {
        const response = await axios.post(
          `https://strikem.site/api/players/${currentUser?.id}/history/`,
          {
            game_session: sessionId,
            winner_player: yourPoints > opponentsPoints ? currentUser?.id : currentUser?.id==currentSession?.players[0]?.id? currentSession?.players[1]?.id:currentSession?.players[0]?.id,
            loser_player: yourPoints < opponentsPoints ? currentUser?.id : currentUser?.id==currentSession?.players[0]?.id? currentSession?.players[1]?.id:currentSession?.players[0]?.id,
            result_winner: yourPoints > opponentsPoints? yourPoints:opponentsPoints,
            result_loser: yourPoints < opponentsPoints? yourPoints:opponentsPoints
          },
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        console.log(response.data);
        
      } catch (error) {
        console.log(error);
      }
    };
          
    const handleSubmit = () => {
      postResult()
      localStorage.removeItem("sessionId")
      setOpenResultBox(false);
    };

    const handleCancel = () => {
      localStorage.removeItem("sessionId")
      setOpenResultBox(false);
    };

    useEffect(() => {            
      openResultBox && sessionId && fetchCurrentSession();
    }, [openResultBox,sessionId]);


    return (
      <div
        className={` z-[1000] flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[80%] md:w-[60%] transition-transform duration-1000 border-1 border-[#2a3759] ${
          openResultBox ? " translate-y-[0] " : " translate-y-[-200%] "
        } bg-[#161d2f] `}
      >
        <div className="flex justify-between items-center">
          <p
            className={`flex self-center text-[#fff] ${
              windowWidth <= 365
                ? "text-[10px]"
                : windowWidth <= 400
                ? "text-[12px]"
                : "text-[14px] md:text-[16px]"
            } `}
          >
            enter result
          </p>
          <div
            className={` ${
              windowWidth <= 365 ? "gap-[5px]" : "gap-[10px]"
            } flex  items-center`}
          >
            <div
              className={` ${
                windowWidth <= 365 ? "gap-[5px]" : "gap-[10px]"
              } flex  items-center`}
            >
              <p
                className={` ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-[#fab907]`}
              >
                You
              </p>
              <input
                type="text"
                className={` rounded-[20px] px-[8px] py-[4px] w-[34px] ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-[#fff] bg-transparent outline-none border-1 border-[#fab907] `}
                ref={yourPointsInput}
                value={yourPoints}
                onChange={(e) => {
                  if (Number(e.target.value) || e.target.value == "")
                    if (e.target.value.length <= 2)
                      setYourPoints(Number(e.target.value));
                }}
              />
            </div>
            <div className="flex items-center">
              <p
                className={` ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-[#fab907]`}
              >
                V
              </p>
              <p
                className={` ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-red-600 `}
              >
                S
              </p>
            </div>
            <div
              className={` ${
                windowWidth <= 365 ? "gap-[5px]" : "gap-[10px]"
              } flex  items-center`}
            >
              <input
                type="text"
                className={` rounded-[20px] px-[8px] py-[4px] w-[34px] ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-[#fff] bg-transparent outline-none border-1 border-red-600 `}
                ref={opponentsPointsInput}
                value={opponentsPoints}
                onChange={(e) => {
                  if (Number(e.target.value) || e.target.value == "")
                    if (e.target.value.length <= 2)
                      setOpponentsPoints(Number(e.target.value));
                }}
              />
              <p
                className={` ${
                  windowWidth <= 365
                    ? "text-[10px]"
                    : windowWidth <= 400
                    ? "text-[12px]"
                    : "text-[14px] md:text-[16px]"
                } text-red-600 `}
              >
                {currentUser?.id==currentSession?.players[0]?.id? currentSession?.players[1].user.username:currentSession?.players[0].user.username}
              </p>
            </div>
          </div>
          <div className="flex gap-2" >
          <button
            className={`${
              windowWidth <= 556 ? "hidden" : ""
            } bg-[#fab907] rounded-[20px] px-[8px] py-[4px] ${
              windowWidth <= 365
                ? "text-[10px]"
                : windowWidth <= 400
                ? "text-[12px]"
                : "text-[14px] md:text-[16px]"
            } text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] `}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className={`${
              windowWidth <= 556 ? "hidden" : ""
            } bg-red-600 rounded-[20px] px-[8px] py-[4px] ${
              windowWidth <= 365
                ? "text-[10px]"
                : windowWidth <= 400
                ? "text-[12px]"
                : "text-[14px] md:text-[16px]"
            } text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] `}
            onClick={handleCancel}
          >
            Cancel
          </button>
          </div>
        </div>
        <div className={`flex gap-2 ${windowWidth <= 556 ? "" : "hidden"}`} >
        <button
            className={`${
              windowWidth <= 556 ? "" : "hidden"
            } bg-[#fab907] rounded-[20px] px-[8px] py-[4px] ${
              windowWidth <= 365
                ? "text-[10px]"
                : windowWidth <= 400
                ? "text-[12px]"
                : "text-[14px] md:text-[16px]"
            } text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] w-full `}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className={`${
              windowWidth <= 556 ? "" : "hidden"
            } bg-red-600 rounded-[20px] px-[8px] py-[4px] ${
              windowWidth <= 365
                ? "text-[10px]"
                : windowWidth <= 400
                ? "text-[12px]"
                : "text-[14px] md:text-[16px]"
            } text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] w-full `}
            onClick={handleCancel}
          >
            Cancel
          </button>
          </div>
        {/* <div
          style={{ width: `${openResultBox}%` }}
          className={`h-1 rounded-[4px] bg-[#fab907] mx-2 mt-1
               ${openResultBox == false ? "hidden" : ""} 
            `}
        /> */}
      </div>
    );
  }
);

export default ResultBoxMemo;
