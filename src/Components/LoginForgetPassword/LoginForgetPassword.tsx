import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import CheckEmail from "./CheckEmail"
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../ReduxStore/features/userSettingsBox";
import { useRef, useState } from "react";

function LoginForgetPassword() {

  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const dispatch = useAppDispatch();

  //Check Email
  const [emptyCheckEmailErr,setEmptyCheckEmailErr] = useState<boolean>(false)
  const [axiosError,setAxiosError] = useState("")


  const CheckEmailRef = useRef<HTMLInputElement|null>(null)

  return (
    <div
        className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  
          `}
      >
        <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center ">
                  <div className="flex gap-[2px] items-center">
                    
                    {/* {userSettingsBox.settingsPage == "forget password"?
                                    <>
                                    <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} className=" rotate-180 cursor-pointer " onClick={()=>{dispatch(setSettingsPage("settings"))}} />
                                      <h1 className="text-[20px] text-[#FFF] leading-6 ">{userSettingsBox.settingsPage}</h1> 
                                    </> 
                                  : */}
                                  <h1 className="text-[32px] text-[#FFF] leading-6 ">
                                  Email Check
                                </h1>  
                                {/* } */}
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
        
          <CheckEmail emptyCheckEmailErr={emptyCheckEmailErr} CheckEmailRef={CheckEmailRef} />
          <div className="flex justify-center w-full pt-[32px] relative ">
            <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] left-0 ">
                {axiosError}
              </p>
            <button
              className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
                // onClick={userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "forget password"? handleEmailCode:handleNewPassword}
                // onClick={()=>{setAxiosError("123")}}
            >
              {/* {userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "forget password"?'Code Check':'submit'} */}
              Check
            </button>
          </div>
        </div>
      
    </div>
  )
}

export default LoginForgetPassword
