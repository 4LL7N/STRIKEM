// import axios from "axios";
import { memo,
  //  useMemo 
  } from "react";
// import Cookies from "js-cookie";

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

    // const currentUser = useMemo(() => {
    //         return localStorage.getItem("currentUser") 
    //           ? JSON.parse(localStorage.getItem("currentUser")!) 
    //           : null;
    //       }, []);
    // const sessionId = localStorage.getItem("sessionId");

    // const postResult = async () => {
    //   const token = Cookies.get("token");
    //   try {
    //     const response = await axios.post(
    //       `https://strikem.site/api/players/${currentUser.id}/history/`,
    //       {
    //         game_session: sessionId,
    //         yourPoints: yourPoints,
    //         opponentsPoints: opponentsPoints,
    //       },
    //       {
    //         headers: { Authorization: `JWT ${token}` },
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    console.log(windowWidth);
    
          
    const handleSubmit = () => {
      setOpenResultBox(false);
    };

    const handleCancel = () => {
      setOpenResultBox(false);
    };


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
                Opponent
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
