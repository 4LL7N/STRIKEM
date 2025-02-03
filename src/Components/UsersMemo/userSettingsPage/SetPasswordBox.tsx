/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../ReduxStore/ReduxHooks";
import { setSetPasswordPage, setUserSettingsBoxClose } from "../../../ReduxStore/features/userSettingsBox";
import EmailCodeCheck from "./EmailCodeCheck";
import { useRef, useState } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import SetNewPasswordPage from "./SetNewPasswordPage";
import { setPasswordOnUser } from "../../../ReduxStore/features/currentUser";

function SetPasswordBox() {
    
    const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
    const [key,setKey] = useState<string>("")
    const dispatch = useAppDispatch();

      // handling sending code to email,sending back to back-end this code


    const emailCode = useRef<HTMLInputElement|null>(null)


    const [emptyEmailCodeErr, setEmptyEmailCodeErr] = useState(false);
    const [uiExpire, setUiExpire] = useState<number>(0);
    const [axiosError,setAxiosError] = useState("")


  

  const handleEmailCode = async ()=>{
    if(emailCode.current && emailCode.current.value){
        
        sendEmailCode(emailCode.current.value)
        return
    }
    setEmptyEmailCodeErr(true)
  }


  const sendEmailCode = async (code:string) =>{
    const token = Cookies.get("token");
    try{
        const response = await axios.post("https://strikem.site/users/verify-code/",{
                code
            },
            {
                headers: { Authorization: `JWT ${token}` },
            }
        )        
        setKey(response.data.key)
        setEmptyEmailCodeErr(false)
        dispatch(setSetPasswordPage({open:true,settingsPage:'setPassword'}))
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

  //handling setting new password
 

  const [emptyNewPasswordErr, setEmptyNewPasswordErr] = useState(false);
  const [emptyRepeatPasswordErr, setEmptyRepeatPasswordErr] = useState(false);

  const newPassword = useRef<HTMLInputElement|null>(null)
  const repeatPassword = useRef<HTMLInputElement|null>(null)

  const sendNewPassword = async () => {
    const token = Cookies.get("token");
    try{
        axios.post('https://strikem.site/users/set-g-password/',{
                key,
                password:newPassword.current?.value
            },
            {
                headers: { Authorization: `JWT ${token}` },
            }
        )   
        setKey("")
        dispatch(setPasswordOnUser())
        dispatch(setUserSettingsBoxClose());
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

  const handleNewPassword = () => {
    if(!newPassword.current || !newPassword.current.value) setEmptyNewPasswordErr(true)
    if(!repeatPassword.current || !repeatPassword.current.value) setEmptyRepeatPasswordErr(true)
    
    if(newPassword.current && newPassword.current.value && repeatPassword.current && repeatPassword.current.value){
        if(newPassword.current.value != repeatPassword.current.value){
            setAxiosError("Passwords is not equal")
        }else{
            sendNewPassword()
        }
    }
  }



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

        {userSettingsBox.settingsPage == "emailCode"?
            <EmailCodeCheck emailCode={emailCode} emptyEmailCodeErr={emptyEmailCodeErr} uiExpire={uiExpire} setUiExpire={setUiExpire} />
        :
            <SetNewPasswordPage emptyNewPasswordErr={emptyNewPasswordErr} newPassword={newPassword} emptyRepeatPasswordErr={emptyRepeatPasswordErr} repeatPassword={repeatPassword} />
        }
        <div className="flex justify-center w-full pt-[32px] relative ">
            <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                {axiosError}
              </p>
            <button
              className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
                onClick={userSettingsBox.settingsPage == "emailCode"? handleEmailCode:handleNewPassword}
            >
              {userSettingsBox.settingsPage == "emailCode"?'Code Check':'submit'}
            </button>
          </div>
          </section>
      </div>
    </div>
  );
}

export default SetPasswordBox;
