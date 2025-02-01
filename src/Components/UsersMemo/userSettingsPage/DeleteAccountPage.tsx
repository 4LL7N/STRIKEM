import { useRef, useState } from "react";

function DeleteAccountPage() {

    const password = useRef<HTMLInputElement|null>(null)

    const [emptyPasswordErr, setEmptyPasswordErr] = useState(false);
    // const [axiosError,setAxiosError] = useState("")

    const handleAccount = () => {

        if(!password.current || !password.current.value){
            setEmptyPasswordErr(true)
        }else{
            setEmptyPasswordErr(false)
        }

    }

  return (
    <section className="w-full mt-[24px]">
        <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyPasswordErr  ? "border-b-[#FC4747]" : null
            } `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="text"
          name="Password"
          id="Password"
          placeholder="Password"
          autoComplete="off"
          ref={password}
        />{" "}
        <a
          className={`${
            emptyPasswordErr
              ? "text-[13px] text-[#FC4747] font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      
      <div className="w-full pt-[32px] relative " >
      {/* <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                {axiosError}
              </p> */}
      <button
          className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
          onClick={handleAccount}
        >
          delete
        </button>
        </div>
    </section>
  )
}

export default DeleteAccountPage