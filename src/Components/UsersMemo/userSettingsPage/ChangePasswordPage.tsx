import { useRef, useState } from "react"

function ChangePasswordPage() {

    const newPassword = useRef<HTMLInputElement|null>(null)
    const repeatNewPassword = useRef<HTMLInputElement|null>(null)
    const oldPassword = useRef<HTMLInputElement|null>(null)

    const [emptyNewPasswordErr, setEmptyNewPasswordErr] = useState(false);
    const [emptyRepeatNewPasswordErr, setEmptyRepeatNewPasswordErr] = useState(false);
    const [emptyOldPasswordErr, setEmptyOldPasswordErr] = useState(false);
    const [axiosError,setAxiosError] = useState("")

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
            setEmptyNewPasswordErr(false)
            setEmptyRepeatNewPasswordErr(false)
            setEmptyOldPasswordErr(false)
        }

    }

  return (
    <section className="w-full mt-[24px]">
        <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyNewPasswordErr || axiosError ? "border-b-[#FC4747]" : null
            } `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="text"
          name="newPassword"
          id="newPassword"
          placeholder="New password"
          autoComplete="off"
          ref={newPassword}
        />{" "}
        <a
          className={`${
            emptyNewPasswordErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] 
            mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
                emptyRepeatNewPasswordErr || axiosError ? "border-b-[#FC4747]" : null
        } `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="repeatNewPassword"
          id="repeatNewPassword"
          placeholder="Repeat password"
          ref={repeatNewPassword}
        />
        <a
          className={`${
            emptyRepeatNewPasswordErr ? "text-[13px] text-[#FC4747] font-light" : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] 
             pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
                emptyOldPasswordErr || axiosError ? "border-b-[#FC4747]" : null
        } `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="oldPassword"
          id="oldPassword"
          placeholder="Old password"
          ref={oldPassword}
        />
        <a
          className={`${
            emptyOldPasswordErr ? "text-[13px] text-[#FC4747] font-light" : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div className="w-full pt-[32px] relative " >
      <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                {axiosError}
              </p>
      <button
          className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
          onClick={handlePassword}
        >
          update
        </button>
        </div>
    </section>
  )
}

export default ChangePasswordPage