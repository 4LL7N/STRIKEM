import type { LoginForgetEmailCodeCheck } from "../../type"

function LoginForgetEmailCodeCheck({ LoginEmailCode,emptyLoginEmailCodeErr,uiExpire}:LoginForgetEmailCodeCheck) {
  return (
    <div className='w-full mt-[24px] ' >
    <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
          emptyLoginEmailCodeErr ? "border-b-[#FC4747]" : null
        }  `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="text"
          name="emailCode"
          id="emailCode"
          placeholder="Code"
          autoComplete="off"
          ref={LoginEmailCode}
        />{" "}
        <a
          className={`${
            emptyLoginEmailCodeErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div className="flex gap-[10px]">
        <p className="text-[#757171]">{uiExpire > 0 ? uiExpire : "Expired"}</p>
      </div>
      </div>
  )
}

export default LoginForgetEmailCodeCheck