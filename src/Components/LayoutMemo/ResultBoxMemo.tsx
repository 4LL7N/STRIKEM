/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { memo, useEffect, useState} from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "../../ReduxStore/ReduxHooks";

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

    const sessionId = localStorage.getItem("sessionId");

    const currentUser = useAppSelector((state) => state.currentUser);

    const [currentSession, setCurrentSession] = useState<Match>();
    const [axiosError, setAxiosError] = useState("");

    const fetchCurrentSession = async () => {
      const token = Cookies.get("token");
      try {
        const CurrentSessionResponse = await axios(
          // `https://strikem.site/api/game-session/${sessionId}/`,
          `http://localhost:5100/api/game-session/${sessionId}/`,
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

    // No try/catch here anymore - lets a failed request throw straight up to handleSubmit, which
    // is the one place that actually decides what closing/clearing on success vs. staying open
    // with an error on failure should look like. Swallowing the error here (the old code just
    // console.log'd it) was what let handleSubmit close the popup and discard the score
    // unconditionally, whether or not the result was ever actually saved.
    const postResult = async () => {
      const token = Cookies.get("token");
      const response = await axios.post(
        // `https://strikem.site/api/players/${currentUser?.id}/history/`,
        `http://localhost:5100/api/players/${currentUser?.id}/history/`,
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
    };

    const handleSubmit = async () => {
      try {
        await postResult();
        localStorage.removeItem("sessionId");
        setAxiosError("");
        setOpenResultBox(false);
      } catch (err: any) {
        const errorArr = Object.values(err?.response?.data ?? {});
        let error: string = "";
        errorArr.forEach((item) => {
          error += item;
        });
        setAxiosError(error || "Something went wrong submitting the result - please try again.");
        console.error(err);
      }
    };

    const handleCancel = () => {
      localStorage.removeItem("sessionId")
      setAxiosError("");
      setOpenResultBox(false);
    };

    useEffect(() => {            
      openResultBox && sessionId && fetchCurrentSession();
    }, [openResultBox,sessionId]);


    return (
      <div
        className={` z-[1000] flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[80%] md:w-[60%] transition-transform duration-1000 border-1 border-[#2a3759] ${
          openResultBox ? " translate-y-[100%] " : " translate-y-[-200%] "
        } bg-[#161d2f] `}
      >
        <div className="flex justify-between items-center">
          <p
            className={`flex self-center text-white ${
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
                } !text-brand-gold`}
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
                } text-white bg-transparent outline-none border-1 border-[#fab907] `}
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
                } !text-brand-gold`}
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
                } text-white bg-transparent outline-none border-1 border-red-600 `}
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
          {axiosError && (
            <p className="text-red-500 text-[12px] md:text-[13px]">{axiosError}</p>
          )}
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
            } text-white hover:bg-[#FFFFFF] hover:!text-brand-navy `}
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
            } text-white hover:bg-[#FFFFFF] hover:!text-brand-navy `}
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
            } text-white hover:bg-[#FFFFFF] hover:!text-brand-navy w-full `}
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
            } text-white hover:bg-[#FFFFFF] hover:!text-brand-navy w-full `}
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
