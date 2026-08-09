/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react"
import { useAppDispatch } from "../../../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../../../ReduxStore/features/userSettingsBox";

function ChangePasswordPage() {

    const newPassword = useRef<HTMLInputElement|null>(null)
    const repeatNewPassword = useRef<HTMLInputElement|null>(null)
    const oldPassword = useRef<HTMLInputElement|null>(null)

    const [emptyNewPasswordErr, setEmptyNewPasswordErr] = useState(false);
    const [emptyRepeatNewPasswordErr, setEmptyRepeatNewPasswordErr] = useState(false);
    const [emptyOldPasswordErr, setEmptyOldPasswordErr] = useState(false);
    const [axiosError,setAxiosError] = useState("")

          const dispatch = useAppDispatch();
    

    const sendNewPassword = async () =>{
      const token = Cookies.get("token");
      try{
        // await axios.post('https://strikem.site/auth/users/set_password/',
        await axios.post('http://localhost:5100/auth/users/set_password/',
          {
            current_password:oldPassword.current?.value ,
            new_password: newPassword.current?.value
          },
          {
              headers: { Authorization: `JWT ${token}` },
          }
         )   
         dispatch(setUserSettingsBoxClose());
      }catch(err:any){
        // .join("\n") so multiple error messages land on separate lines instead of running
        // together - paired with whitespace-pre-line on the <p> that renders this below.
        const error = Object.values<string>(err?.response.data).join("\n");
        console.log(error);
        console.log(err);

        setAxiosError(error)
      }
    }

    const handlePassword = () => {
        let NewPassword = true
        let RepeatNewPassword = true
        let OldPassword = true

        if(!newPassword.current || !newPassword.current.value){
            setEmptyNewPasswordErr(true)
            NewPassword = false
        }
        if(!repeatNewPassword.current || !repeatNewPassword.current.value){
            setEmptyRepeatNewPasswordErr(true)
            RepeatNewPassword = false
        }
        if(!oldPassword.current || !oldPassword.current.value){
            setEmptyOldPasswordErr(true)
            OldPassword = false
        }
        if(OldPassword && RepeatNewPassword && NewPassword){
            if(newPassword.current?.value != repeatNewPassword.current?.value){
              setAxiosError("newPassword and repeatPassword is not equal")
              return
            }
            setEmptyNewPasswordErr(false)
            setEmptyRepeatNewPasswordErr(false)
            setEmptyOldPasswordErr(false)
            sendNewPassword()
        }

    }

  return (
    <section className="w-full mt-[24px]">
        <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
            emptyNewPasswordErr  ? "border-b-[#FC4747]" : null
            } `}
      >
        <input
          className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="newPassword"
          id="newPassword"
          placeholder="New password"
          autoComplete="off"
          ref={newPassword}
        />{" "}
        <a
          className={`${
            emptyNewPasswordErr
              ? "text-[13px] !text-brand-red font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] 
            mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
                emptyRepeatNewPasswordErr  ? "border-b-[#FC4747]" : null
        } `}
      >
        <input
          className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="repeatNewPassword"
          id="repeatNewPassword"
          placeholder="Repeat password"
          ref={repeatNewPassword}
        />
        <a
          className={`${
            emptyRepeatNewPasswordErr ? "text-[13px] !text-brand-red font-light" : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] 
             pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
                emptyOldPasswordErr  ? "border-b-[#FC4747]" : null
        } `}
      >
        <input
          className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="oldPassword"
          id="oldPassword"
          placeholder="Old password"
          ref={oldPassword}
        />
        <a
          className={`${
            emptyOldPasswordErr ? "text-[13px] !text-brand-red font-light" : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div className="flex flex-col items-center gap-[8px] w-full pt-[32px]" >
      {axiosError && (
        <p className="text-red-500 text-[12px] whitespace-pre-line text-center">
          {axiosError}
        </p>
      )}
      <button
          className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-white font-light hover:bg-[#FFFFFF] hover:!text-brand-navy "
          onClick={handlePassword}
        >
          update
        </button>
        </div>
    </section>
  )
}

export default ChangePasswordPage