/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";


function Signup({setSignUpBox}:any) {
  const navigation = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const email = useRef<any>(null); // type error
  const password = useRef<any>(null);
  const repPassword = useRef<any>(null);

  const [emptyEmail, setEmptyEmail] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  // const [repemptyPassword, setrepEmptyPassword] = useState(false);
  const [emailerr, setEmailerr] = useState(false);
  // const [repPassErr, setRepPassErr] = useState(false);
  const [usedEmail, setUsedEmail] = useState(false)

  let emptyEmailChk = false;
  let emptyPasswordChk = false;
  let repEmptyPasswordChk = false;
  let emailErrChk = false;
  let repPassErrChk = false;
  const usedEmailChk = false

  function HandleSignup() {
    // console.log(email?.current.value);
    // console.log(emailRegex.test(email.current.value))
    if (!email.current?.value) {
    //   console.log("email.current " + email.current);
      
      setEmptyEmail(true);
      emptyEmailChk = true;
      // console.log(password.current.value);
      // console.log(repPassword.current.value);
    } else if (!emailRegex.test(email.current.value)) {
    //   console.log(emailRegex.test(email.current.value));
      
      setEmailerr(true);
      emailErrChk = true;
    } else {
      setEmptyEmail(false);
      emptyEmailChk = false;
      setEmailerr(false);
      emailErrChk = false;
    }

    if (!password.current?.value) {
      setEmptyPassword(true);
      emptyPasswordChk = true;
    } else {
      setEmptyPassword(false);
      emptyPasswordChk = false;
    }

    // if (!repPassword.current?.value) {
    //   setrepEmptyPassword(true);
    //   repEmptyPasswordChk = true;
    // } else {
    //   setrepEmptyPassword(false);
    //   repEmptyPasswordChk = false;
    // }

    if (
      password.current &&
      repPassword.current &&
      password.current.value !== repPassword.current.value
    ) {
      setRepPassErr(true);
      repPassErrChk = true;
    } else {
      setRepPassErr(false);
      repPassErrChk = false;
    }
    

   
    
    // Switch();
  }
  function Switch() {
    if (
      !emailErrChk &&
      !repPassErrChk &&
      !emptyEmailChk &&
      !emptyPasswordChk &&
      !repEmptyPasswordChk &&
      !usedEmailChk
    ) {
      setUsedEmail(false)
       navigation("/login")
    }
  }

  return (
    <>
     
      <div className="w-[100%] p-[24px] pb-[32] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px]">
    <div className="w-[100%] flex justify-between items-center mb-[40px] " >
        <h1 className="text-[32px] text-[#FFF] font-light tarcking-[-0.5px] self-start	">
          Sign Up
        </h1>
        <IoMdClose style={{color:'white',width:'24px',height:'24px'}} onClick={()=>{setSignUpBox(false)}} />
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFF] ${
            emptyEmail || emailerr || usedEmail ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
            type="text"
            name="SignUpUsername"
            id="SignUpUsername"
            placeholder="Username"
            autoComplete="off"
            // ref={email}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {emailerr
              ? "wrong Email form"
              : emptyEmail
              ? "Can’t be empty"
              : null}
          </a>
        </div>

        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFF] ${
            emptyEmail || emailerr || usedEmail ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
            type="email"
            name="SignUpEmail"
            id="SignUpEmail"
            placeholder="Email address"
            autoComplete="off"
            ref={email}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {emailerr
              ? "wrong Email form"
              : emptyEmail
              ? "Can’t be empty"
              : null}
          </a>
        </div>

        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFF] ${
            emptyPassword ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            ref={password}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {emptyPassword ? "Can’t be empty" : null}
          </a>
        </div>

        {/* <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F]  hover:border-b-[#FFF] ${usedEmail?"mb-[24px]" :"mb-[40px]"} pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  ${
            repemptyPassword || repPassErr ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[130px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            placeholder="Repeat Password"
            ref={repPassword}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {repemptyPassword
              ? "Can’t be empty"
              : repPassErr
              ? "Must repet password"
              : null}
          </a>
        </div> */}
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFF] ${
            emptyEmail || emailerr || usedEmail ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
            type="text"
            name="FirstName"
            id="FirstName"
            placeholder="First name"
            autoComplete="off"
            // ref={email}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {emailerr
              ? "wrong Email form"
              : emptyEmail
              ? "Can’t be empty"
              : null}
          </a>
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFF] ${
            emptyEmail || emailerr || usedEmail ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
            type="text"
            name="LastName"
            id="LastName"
            placeholder="Last name"
            autoComplete="off"
            // ref={email}
          />
          <a className="text-[13px] text-[#FC4747] font-light">
            {emailerr
              ? "wrong Email form"
              : emptyEmail
              ? "Can’t be empty"
              : null}
          </a>
        </div>
        <p className={`${usedEmail?"text-[13px] text-[#FC4747] font-light":"hidden"} mb-[40px] `} >This email is already registered</p>
        <button
          className="w-[100%] bg-[#fab907] rounded-[6px] py-[15px] text-[15px] text-[#FFF] font-light mb-[24px] hover:bg-[#8b7127] hover:text-[#161D2F]"
          onClick={() => HandleSignup()}
        >
          Create an account
        </button>

        <span className=" flex">
          <a className="w-[166px] text-[15px] text-[#FFF] font-light mr-[9px]">
            Do you have an account?
          </a>
          <Link className="text-[15px] text-[#fab907] font-light " to="/login">
            Log In
          </Link>
        </span>

      </div>
      
    </>
  );
}

export default Signup;
