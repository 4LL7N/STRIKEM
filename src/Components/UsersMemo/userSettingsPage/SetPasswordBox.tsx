/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "../../../ReduxStore/ReduxHooks";
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { setUserSettingsBoxClose } from "../../../ReduxStore/features/userSettingsBox";

function SetPasswordBox() {
  const dispatch = useAppDispatch();
  const [uiExpire, setUiExpire] = useState<number>(0);
  const emailCode = useRef<HTMLInputElement|null>(null)
  const [emptyEmailCodeErr, setEmptyEmailCodeErr] = useState(false);
        const [axiosError,setAxiosError] = useState("")


  const sendCodeToEmail = async () => {
    const token = Cookies.get("token");
    
    try {
      await axios.post("https://strikem.site/api/users/get-code/",{},
          {
              headers: { Authorization: `JWT ${token}` },
          }
      )
      timer()
    } catch (err) {
      console.log(err);
    }
  };

  const sendEmailCode = async (code:string) =>{
    const token = Cookies.get("token");
    try{
        const response = await axios.post("https://strikem.site/api/users/verify-code/",{
                code
            },
            {
                headers: { Authorization: `JWT ${token}` },
            }
        )
        localStorage.setItem("passUuid",response.data.key)
        setEmptyEmailCodeErr(false)
    }catch(err:any){
        const errorArr = Object.values(err?.response.data);
        let error: string = "";
        errorArr.forEach((item) => {
            error += item;
        });
        console.log(error);
        setAxiosError(error)
        
    }
  }

  const handleEmailCode = async ()=>{
    if(emailCode.current && emailCode.current.value){
        sendEmailCode(emailCode.current.value)
    }
    setEmptyEmailCodeErr(true)
  }

  const timer = () => {
    console.log("timer",uiExpire);
    
        let timerTime = 59
      const interval = setInterval(() => {        
        setUiExpire(timerTime);
        timerTime -= 1
        if (timerTime == 0) clearInterval(interval), setUiExpire(0);
      }, 1000);
  };

  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  `}
    >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center ">
          <div className="flex gap-[2px] items-center">
            <h1 className="text-[14px] text-[#FFF] leading-6 ">
              Set a password to access the changes
            </h1>
          </div>
          <IoMdClose
            style={{
              color: "white",
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
            onClick={() => {                
              dispatch(setUserSettingsBoxClose());
            }}
          />
        </div>
        <section className="w-full mt-[24px]">
          <div
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
                emptyEmailCodeErr  ? "border-b-[#FC4747]" : null
                }  `}
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
              type="text"
              name="emailCode"
              id="emailCode"
              placeholder="Code"
              autoComplete="off"
                ref={emailCode}
            />{" "}
            <a
          className={`${
            emptyEmailCodeErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
          </div>
          <div className="flex gap-[10px]">
            <p
              className="text-white underline underline-offset-1 "
              onClick={sendCodeToEmail}
            >
              send code on email{" "}
            </p>
            <p className="text-[#757171]">{uiExpire > 0 ? uiExpire : ""}</p>
          </div>
          <div className="flex justify-center w-full pt-[32px] relative ">
            <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                {axiosError}
              </p>
            <button
              className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
                onClick={handleEmailCode}
            >
              update
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SetPasswordBox;
