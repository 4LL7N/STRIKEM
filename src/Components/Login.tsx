/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";
import { Link,
     useNavigate
     } from "react-router-dom";
import Cookies from 'js-cookie';
import { IoMdClose } from "react-icons/io";


function Login({setLoginBox}:any) {
  const logNavigation = useNavigate();

  const logEmail = useRef<any>(null);
  const logPassword = useRef<any>(null);
  const [emptyLogEmailErr, setEmptyLogEmailErr] = useState(false);
  const [emptyLogPassErr, setEmptyLogPassErr] = useState(false);
  const [userError, setUserError] = useState(false);
  
  let emptyLogEmailErrChk = false;
  let emptyLogPassErrChk = false;
  
  
  function HandleLogin() {
      
    if(!logEmail.current?.value){
        setEmptyLogEmailErr(true)
        emptyLogEmailErrChk = true
    }else{
        setEmptyLogEmailErr(false)
        emptyLogEmailErrChk = false
    }

    if(!logPassword.current.value){
        setEmptyLogPassErr(true)
        emptyLogPassErrChk = true
    }else{
        setEmptyLogPassErr(false)
        emptyLogPassErrChk = false
    }


   
    if(emptyLogEmailErrChk || emptyLogPassErrChk ){
      console.log('err')
    }else{
      setUserError(false)
      Fetch();
    }
  }
  const Fetch = async () => {
    try {
      const response = await axios.post(
        "https://strikem.site/auth/jwt/create",
        {
          username: logEmail.current?.value,
          password: logPassword.current.value,
        }
      );
      console.log(response.data)
      Cookies.set('token',response.data.access
        ,{
        secure: true,
        sameSite: 'Strict',         
      }
    )

    setLoginBox(false)
    logNavigation("/home");
    window.location.reload()

    } catch (err:any) {
      
        if(err?.response?.status == 401){
          console.log('error')
          setUserError(true)
        }
          
      console.log(err?.response);
    }
  };

  return (
    <>
      <div className="w-[100%] p-[24px] pb-[32] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-[100%] flex justify-between items-center mb-[40px] " >
        <h1 className="text-[32px] text-[#FFF] font-light tracking-[-0.5px]  self-start	">
          Login
        </h1>
        <IoMdClose style={{color:'white',width:'24px',height:'24px'}} onClick={()=>{setLoginBox(false)}} />
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyLogEmailErr || userError ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="email"
            name="email"
            id="email"
            placeholder="Username"
            autoComplete="off"
            ref={logEmail}
          />{" "}
          <a
            className={`${
              emptyLogEmailErr
                ? "text-[13px] text-[#FC4747] font-light"
                : "hidden"
            }`}
          >
            Can’t be empty
          </a>{" "}
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] ${
            userError ? "mb-[24px]" : "mb-[40px]"
          } pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyLogPassErr || userError ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            ref={logPassword}
          />
          <a
            className={`${
              emptyLogPassErr
                ? "text-[13px] text-[#FC4747] font-light"
                : "hidden"
            }`}
          >
            Can’t be empty
          </a>{" "}
        </div>
        <p
          className={`${
            userError ? "text-[13px] text-[#FC4747] font-light" : "hidden"
          } mb-[40px]  `}
          
        >
          Email or password is not correct
        </p>
        <button
          className="w-[100%] bg-[#fab907] rounded-[6px] py-[15px] text-[15px] text-[#FFF] font-light mb-[24px] hover:bg-[#FFF] hover:text-[#161D2F] "
          onClick={() => {
            HandleLogin();
          }}
        >
          Login to your account
        </button>
        <span className=" flex">
          <a className="w-[156px] text-[15px] text-[#FFF] font-light mr-[9px]">
            Don’t have an account?
          </a>
          <Link className="text-[15px] text-[#fab907] font-light " to="/signup">
            Sign Up
          </Link>
        </span>
      </div>
    </>
  );
}

export default Login;
