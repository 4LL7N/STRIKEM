import { useRef, useState } from "react";

function ChangeUsernamePage() {
  const logUsername = useRef<HTMLInputElement | null>(null);
  const logPassword = useRef<HTMLInputElement | null>(null);
  const [emptyLogUsernameErr, setEmptyLogUsernameErr] = useState(false);
  const [emptyLogPassErr, setEmptyLogPassErr] = useState(false);
  // const [axiosError,setAxiosError] = useState("")

//   const updateUsername = async ()=>{
//     await axios.
//   }

  const handleUsername = () => {
        let username = true
        let password = true
    if(!logUsername.current || !logUsername.current.value ){
        setEmptyLogUsernameErr(true)
        username = false
    }
    if(!logPassword.current || !logPassword.current.value ){
        setEmptyLogPassErr(true)
        password = false
    }
        
    
    if(username && password){
        setEmptyLogPassErr(false)
        setEmptyLogUsernameErr(false)
    }

  }

  return (
    <section className="w-full mt-[24px]">
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
                emptyLogUsernameErr  ? "border-b-[#FC4747]" : null
            } `}
      >
        <input
          className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="text"
          name="LoginUsername"
          id="LoginUsername"
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
      
      <div className="w-full flex justify-center pt-[32px] " >
      {/* <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                {axiosError}
              </p> */}
      <button
          className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
          onClick={handleUsername}
        >
          update
        </button>
        </div>
    </section>
  );
}

export default ChangeUsernamePage;
