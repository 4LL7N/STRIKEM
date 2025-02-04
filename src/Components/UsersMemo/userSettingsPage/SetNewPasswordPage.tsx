import type { SetNewPasswordPage } from "../../../type"

function SetNewPasswordPage({emptyNewPasswordErr,newPassword,emptyRepeatPasswordErr,repeatPassword}:SetNewPasswordPage) {
  return (
    <>
          <div
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] 
                ${emptyNewPasswordErr  ? "border-b-[#FC4747]" : null}
                  `}
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="newPassword"
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
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] 
                 ${emptyRepeatPasswordErr  ? "border-b-[#FC4747]" : null}
                `}
                  
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              placeholder="repeatPassword"
              autoComplete="off"
                ref={repeatPassword}
            />{" "}
            <a
          className={`${
            emptyRepeatPasswordErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
          </div>
          </>
  )
}

export default SetNewPasswordPage