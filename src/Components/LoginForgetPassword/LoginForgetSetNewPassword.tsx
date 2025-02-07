import type { LoginForgetSetNewPassword } from "../../type"

function LoginForgetSetNewPassword({emptyLogNewPasswordErr,logNewPassword,emptyLogRepeatPasswordErr,logRepeatPassword}:LoginForgetSetNewPassword) {
  return (
    <div className='w-full mt-[24px] ' >
    <div
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] 
                ${emptyLogNewPasswordErr  ? "border-b-[#FC4747]" : null}
                  `}
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="newPassword"
              autoComplete="off"
                ref={logNewPassword}
            />{" "}
            <a
          className={`${
            emptyLogNewPasswordErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
          </div>
          <div
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] 
                 ${emptyLogRepeatPasswordErr  ? "border-b-[#FC4747]" : null}
                `}
                  
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              placeholder="repeatPassword"
              autoComplete="off"
                ref={logRepeatPassword}
            />{" "}
            <a
          className={`${
            emptyLogRepeatPasswordErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
          </div>
      </div>
  )

}

export default LoginForgetSetNewPassword
