/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../../ReduxStore/ReduxHooks";
import { setSetPasswordPage, setSettingsPage, setUserSettingsBoxClose } from "../../../../ReduxStore/features/userSettingsBox";
import EmailCodeCheck from "../EmailCodeCheck";
import { useRef, useState } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import SetNewPasswordPage from "../SetNewPasswordPage";
import { setPasswordOnUser } from "../../../../ReduxStore/features/currentUser";

function SetPasswordBox() {
    
    const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
    const [key,setKey] = useState<string>("")
    const dispatch = useAppDispatch();

      // handling sending code to email,sending back to back-end this code


    const emailCode = useRef<HTMLInputElement|null>(null)
    const userSettings = useAppSelector((state) => state.userSettingsBox);
    const currentUser = useAppSelector((state) => state.currentUser);


    const [emptyEmailCodeErr, setEmptyEmailCodeErr] = useState(false);
    const [uiExpire, setUiExpire] = useState<number>(0);
    const [axiosError,setAxiosError] = useState("")


  

  const handleEmailCode = ()=>{
    if(emailCode.current && emailCode.current.value){
        
        sendEmailCode(emailCode.current.value)
        return
    }
    setEmptyEmailCodeErr(true)
  }


  const sendEmailCode = async (code:string) =>{
    const token = Cookies.get("token");
    var sendCode:{
      code:string,      
      email?:string
    } = {
      code:code,
    };
    userSettings.settingsPage != "emailCode" ?sendCode.email = currentUser.user.email:null;
    try{
        // const response = await axios.post("https://strikem.site/users/verify-code/",{
        const response = await axios.post(`http://localhost:5100/users/${userSettings.settingsPage == "emailCode"?"verify-code":"verify-code-forget"}/`,{
                code
            },
            {
                headers: { Authorization: `JWT ${token}` },
            }
        )        
        setKey(response.data.key)
        setEmptyEmailCodeErr(false)
        setAxiosError("")
        dispatch(setSetPasswordPage({open:true,settingsPage:'setPassword'}))
    }catch(err:any){
        // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
        // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
        // multiple messages in the same field get glued together by JS's array-to-string coercion
        // (comma-joined) instead of one per line.
        const error = Object.values<string[]>(err?.response.data).flat().join("\n");
        console.log(error);
        setAxiosError(error)

    }
  }

  //handling setting new password
 

  const [emptyNewPasswordErr, setEmptyNewPasswordErr] = useState(false);
  const [emptyRepeatPasswordErr, setEmptyRepeatPasswordErr] = useState(false);

  const newPassword = useRef<HTMLInputElement|null>(null)
  const repeatPassword = useRef<HTMLInputElement|null>(null)

  const sendNewPassword = async () => {
    const token = Cookies.get("token");
    try{
        // await axios.post('https://strikem.site/users/set-g-password/',{
        await axios.post('http://localhost:5100/users/set-g-password/',{
                key,
                password:newPassword.current?.value
            },
            {
                headers: { Authorization: `JWT ${token}` },
            }
        )   
        setKey("")
        setAxiosError("")
        dispatch(setPasswordOnUser())
        dispatch(setUserSettingsBoxClose());
    }catch(err:any){
        // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
        // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
        // multiple messages in the same field get glued together by JS's array-to-string coercion
        // (comma-joined) instead of one per line.
        const error = Object.values<string[]>(err?.response.data).flat().join("\n");
        console.log(error);
        setAxiosError(error)
    }
  }

  const handleNewPassword = () => {
    if(!newPassword.current || !newPassword.current.value) setEmptyNewPasswordErr(true)
    if(!repeatPassword.current || !repeatPassword.current.value) setEmptyRepeatPasswordErr(true)
    
    if(newPassword.current && newPassword.current.value && repeatPassword.current && repeatPassword.current.value){
        if(newPassword.current.value != repeatPassword.current.value){
            setAxiosError("Passwords is not equal")
        }else{
            setEmptyNewPasswordErr(false)
            setEmptyRepeatPasswordErr(false)
            sendNewPassword()
        }
    }
  }



  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E]/90 z-50  `}
    >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center ">
          <div className="flex gap-[2px] items-center">
            
            {userSettingsBox.settingsPage == "forget password"?
                            <>
                              <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} className=" rotate-180 cursor-pointer " onClick={()=>{dispatch(setSettingsPage("settings"))}} />
                              <h1 className="text-[20px] text-white leading-6 ">{userSettingsBox.settingsPage}</h1> 
                            </> 
                          :
                          <h1 className="text-[14px] text-white leading-6 ">
                          Set a password to access the changes
                        </h1>  
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
        <section className="w-full mt-[24px]">

        {userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "forget password"?
            <EmailCodeCheck emailCode={emailCode} emptyEmailCodeErr={emptyEmailCodeErr} uiExpire={uiExpire} setUiExpire={setUiExpire} setAxiosError={setAxiosError} />
        :
            <SetNewPasswordPage emptyNewPasswordErr={emptyNewPasswordErr} newPassword={newPassword} emptyRepeatPasswordErr={emptyRepeatPasswordErr} repeatPassword={repeatPassword} />
        }
        <div className="flex flex-col items-center gap-[8px] w-full pt-[32px] ">
            {axiosError && (
              <p className="self-start text-red-500 text-[12px] whitespace-pre-line text-left">
                {axiosError}
              </p>
            )}
            <button
              className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-white font-light hover:bg-[#FFFFFF] hover:!text-brand-navy "
                onClick={userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "forget password"? handleEmailCode:handleNewPassword}
            >
              {userSettingsBox.settingsPage == "emailCode" || userSettingsBox.settingsPage == "forget password"?'Code Check':'submit'}
            </button>
          </div>
          </section>
      </div>
    </div>
  );
}

export default SetPasswordBox;
