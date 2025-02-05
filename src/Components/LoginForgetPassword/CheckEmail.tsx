import type { CheckEmail } from "../../type"

function CheckEmail({emptyCheckEmailErr,CheckEmailRef,notEmailCheckEmailErr}:CheckEmail) {



  return (
    <div className='w-full mt-[24px] ' >
      <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[12px] pl-[16px] pb-[18px] hover:border-b-[#FFF] 
            ${emptyCheckEmailErr || notEmailCheckEmailErr ? "border-b-[#FC4747]" : null}
            `}
        >
          <input
            className="w-[150px] text-[18px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="email"
            name="CheckEmail"
            id="CheckEmail"
            placeholder="Email"
            autoComplete="off"
            ref={CheckEmailRef}
          />{" "}
          <a
            className={`${
              emptyCheckEmailErr
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

export default CheckEmail
