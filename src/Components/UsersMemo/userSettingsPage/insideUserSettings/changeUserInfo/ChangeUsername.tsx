import type { ChangeUsername } from "../../../../../type"

function ChangeUsername({emptyLogUsernameErr,logUsername,emptyLogPassErr,logPassword}:ChangeUsername) {
  return (
    <div>      <div
    className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyLogUsernameErr  ? "border-b-[#FC4747]" : null
        } `}
  >
    <input
      className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
      type="text"
      name="Username"
      id="Username"
      placeholder="Username"
      autoComplete="off"
      ref={logUsername}
    />{" "}
    <a
      className={`${
        emptyLogUsernameErr
          ? "text-[13px] text-[#FC4747] font-light"
          : "hidden"
      }`}
    >
      Can’t be empty
    </a>{" "}
  </div>
  <div
    className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] 
         pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
      emptyLogPassErr  ? "border-b-[#FC4747]" : null
    } `}
  >
    <input
      className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
      type="password"
      name="LoginPassword"
      id="LoginPassword"
      placeholder="Password"
      ref={logPassword}
    />
    <a
      className={`${
        emptyLogPassErr ? "text-[13px] text-[#FC4747] font-light" : "hidden"
      }`}
    >
      Can’t be empty
    </a>{" "}
  </div>
  </div>
  )
}

export default ChangeUsername