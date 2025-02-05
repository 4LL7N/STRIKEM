/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import CheckEmail from "./CheckEmail"
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setSettingsPage, setUserSettingsBoxClose } from "../../ReduxStore/features/userSettingsBox";
import { useRef, useState } from "react";
import axios from "axios";
import LoginForgetEmailCodeCheck from "./LoginForgetEmailCodeCheck";

function LoginForgetPassword() {

  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const dispatch = useAppDispatch();
  

  //Check Email
  const [emptyCheckEmailErr,setEmptyCheckEmailErr] = useState<boolean>(false)
  const [notEmailCheckEmailErr,setNotEmailCheckEmailErr] = useState<string>("")
  const [axiosError,setAxiosError] = useState("")


  const CheckEmailRef = useRef<HTMLInputElement|null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const emailCheck = async () =>{
    try{
      const response = await axios.post("https://strikem.site/users/get-code-forget/",
        {
          email:CheckEmailRef.current?.value
        }
      )
      if(response.status == 200){
        dispatch(setSettingsPage("loginForgetPassword"))
      }
      
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

  const emailCheckHandle = () => {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
    if(!CheckEmailRef.current || !CheckEmailRef.current?.value){
      setEmptyCheckEmailErr(true)
    }
    if(!CheckEmailRef.current || reg.test(CheckEmailRef.current?.value)){
      setNotEmailCheckEmailErr("invalid Email form")
    }

    if(CheckEmailRef.current && CheckEmailRef.current?.value && reg.test(CheckEmailRef.current?.value)){
      setEmptyCheckEmailErr(false)
      setNotEmailCheckEmailErr("")
      emailCheck()
    }

  }

  // LoginForgetEmailCodeCheck

  const [emptyLoginEmailCodeErr,setEmptyLoginEmailCodeErr] = useState<boolean>(false)
  const [uiExpire, setUiExpire] = useState<number>(0);

  const LoginEmailCode = useRef<HTMLInputElement|null>(null)

  const timer = () => {
    let timerTime = 59;

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Ensure no duplicate intervals
    }
    intervalRef.current = setInterval(() => {
      if (timerTime === 0 || uiExpire === -1) {
        clearInterval(intervalRef.current!); // Stop interval
        setUiExpire(0);
        return;
      }

      setUiExpire(timerTime);
      timerTime -= 1;
    }, 1000);
  };

  const codeCheck =  async (code:string) =>{
    try{
      const response = await axios.post("https://strikem.site/users/verify-code-forget/",
        {
          code
        }
      )
      console.log(response);
      
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

  const codeCheckHandle = () =>{
    if(!LoginEmailCode.current || !LoginEmailCode.current.value){
      setEmptyLoginEmailCodeErr(true)
    }

    if(LoginEmailCode.current && LoginEmailCode.current.value){
      setEmptyLoginEmailCodeErr(false)
      timer()
      codeCheck(LoginEmailCode.current.value)
    }

  }

  return (
    <div
        className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  
          `}
      >
        <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center ">
                  <div className="flex gap-[2px] items-center">
                    
                    {userSettingsBox.settingsPage == "emailCheck"?
                                    <h1 className="text-[32px] text-[#FFF] leading-6 ">
                                    Email Check
                                  </h1>
                                  :
                                  <>
                                    <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} className=" rotate-180 cursor-pointer " onClick={()=>{dispatch(setSettingsPage("settings"))}} />
                                      <h1 className="text-[20px] text-[#FFF] leading-6 ">
                                        {userSettingsBox.settingsPage == "loginForgetPassword"?"Check code":""}
                                      </h1> 
                                    </>   
                             } 
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
        
          <CheckEmail emptyCheckEmailErr={emptyCheckEmailErr} CheckEmailRef={CheckEmailRef} notEmailCheckEmailErr={notEmailCheckEmailErr} />
          <LoginForgetEmailCodeCheck LoginEmailCode={LoginEmailCode} emptyLoginEmailCodeErr={emptyLoginEmailCodeErr} uiExpire={uiExpire} />
          <div className="flex justify-center w-full pt-[32px] relative ">
            <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] left-0 ">
                {axiosError}{notEmailCheckEmailErr}
              </p>
            <button
              className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
                onClick={userSettingsBox.settingsPage == "emailCheck" ? emailCheckHandle:codeCheckHandle}
                // onClick={()=>{setAxiosError("123")}}
            >
              {userSettingsBox.settingsPage == "emailCheck"?'Check Email':userSettingsBox.settingsPage == "loginForgetPassword"?"submit":""}
              Check
            </button>
          </div>
        </div>
      
    </div>
  )
}

export default LoginForgetPassword
