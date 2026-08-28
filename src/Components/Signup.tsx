/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { CredentialResponse } from "@react-oauth/google";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, GOOGLE_CLIENT_ID } from "../config";


function Signup({signUpBox, setSignUpBox, setLoginBox }: any) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const navigate = useNavigate();

  const userName = useRef<any>(null);
  const firstName = useRef<any>(null);
  const lastName = useRef<any>(null);

  const email = useRef<any>(null); // type error
  const password = useRef<any>(null);
  // const repPassword = useRef<any>(null);

  const [emptyUsername, setEmptyUsername] = useState<boolean>(false);
  const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
  // const [repemptyPassword, setrepEmptyPassword] = useState(false);
  const [emptyFirstName, setEmptyFirstName] = useState<boolean>(false);
  const [emptyLastName, setEmptyLastName] = useState<boolean>(false);

  const [emailerr, setEmailerr] = useState<boolean>(false);
  const [axiosError, setAxiosError] = useState<string>("");
  const [googleError, setGoogleError] = useState<string>("");


  const [changeToVerify, setChangeToVerify] = useState<boolean>(false);

  const clientId = GOOGLE_CLIENT_ID;

  // Plain mutable boxes for reading the "would-be" validity of each field synchronously within
  // the same HandleSignup call - setEmptyEmail() etc. (the actual React state) won't reflect the
  // new value until the next render, but the check below needs the current call's answer right
  // away. useRef is the React-sanctioned way to hold a value like this (mutable, doesn't trigger
  // a render, persists its identity across renders) - unlike a plain `let` redeclared in the
  // component body, which is what this used to be.
  const emptyUsernameChk = useRef(false);
  const emptyFirstNameChk = useRef(false);
  const emptyLastNameChk = useRef(false);
  const emptyEmailChk = useRef(false);
  const emptyPasswordChk = useRef(false);
  const emailErrChk = useRef(false);

  function HandleSignup() {
    // console.log(email?.current.value);
    // console.log(emailRegex.test(email.current.value))
    if (!email.current?.value) {
      //   console.log("email.current " + email.current);

      setEmptyEmail(true);
      emptyEmailChk.current = true;
      // console.log(password.current.value);
      // console.log(repPassword.current.value);
    } else if (!emailRegex.test(email.current.value)) {
      //   console.log(emailRegex.test(email.current.value));

      setEmailerr(true);
      emailErrChk.current = true;
    } else {
      setEmptyEmail(false);
      emptyEmailChk.current = false;
      setEmailerr(false);
      emailErrChk.current = false;
    }

    if (!password.current?.value) {
      setEmptyPassword(true);
      emptyPasswordChk.current = true;
    } else {
      setEmptyPassword(false);
      emptyPasswordChk.current = false;
    }

    if (!userName.current?.value) {
      setEmptyUsername(true);
      emptyUsernameChk.current = true;
    } else {
      setEmptyUsername(false);
      emptyUsernameChk.current = false;
    }

    if (!firstName.current?.value) {
      setEmptyFirstName(true);
      emptyFirstNameChk.current = true;
    } else {
      setEmptyFirstName(false);
      emptyFirstNameChk.current = false;
    }

    if (!lastName.current?.value) {
      setEmptyLastName(true);
      emptyLastNameChk.current = true;
    } else {
      setEmptyLastName(false);
      emptyLastNameChk.current = false;
    }

    if (
      !emptyUsernameChk.current &&
      !emailErrChk.current &&
      // !repPassErrChk &&
      !emptyEmailChk.current &&
      !emptyPasswordChk.current &&
      !emptyFirstNameChk.current &&
      !emptyLastNameChk.current
      // !repEmptyPasswordChk &&
    ) {
      signUp();
    }
  }

  const signUp = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/users/`, {
        username: userName.current?.value,
        password: password.current?.value,
        email: email.current?.value,
        first_name: firstName.current?.value,
        last_name: lastName.current?.value,
      });
      setEmptyEmail(false);
      setEmailerr(false);
      setEmptyPassword(false);
      setEmptyUsername(false);
      setEmptyFirstName(false);
      setEmptyLastName(false);

      password.current.value = "";
      userName.current.value = "";
      email.current.value = "";
      firstName.current.value = "";
      lastName.current.value = "";

      setChangeToVerify(true);
    } catch (err: any) {
      // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
      // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
      // multiple messages in the same field get glued together by JS's array-to-string coercion
      // (comma-joined) instead of one per line.
      const error = Object.values<string[]>(err?.response.data).flat().join("\n");
      setAxiosError(error);
      console.log(error);
    }
  };

  const googleToBack = async (id_token:string) => {
    try{
      const response = await axios.post(`${API_BASE_URL}/users/google-auth/`, {
        id_token,
        from: "register"
      })
      
      
      setSignUpBox(false)
      setGoogleError("")
      userName.current.value = ""
      
      Cookies.set('token',response.data.access_token
        ,{
        secure: true,
        sameSite: 'Strict',
        expires:1      
      })
      
      navigate("/home")
      window.location.reload()

    }catch(err:any){      
      console.log(err);
      
      if(err.status != 500){
        // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
        // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
        // multiple messages in the same field get glued together by JS's array-to-string coercion
        // (comma-joined) instead of one per line.
        const error = Object.values<string[]>(err?.response.data).flat().join("\n");
      setAxiosError(error);
      console.log(error);
      }else{
        setAxiosError("something went wrong,please try again soon");
        console.log(err);
      }

    }
  }

  ;
  

  const onSuccess = (e: CredentialResponse) => {
    if(!e.credential ) {
      setGoogleError("something went wrong")
      return
    }
    
    googleToBack(e.credential)
  };
  
  const signupClose = () => {
    setSignUpBox(false)
    setChangeToVerify(false)
    setGoogleError("")
    setAxiosError("")
    if (userName && userName.current )userName.current.value = ""
    if(password && password.current)password.current.value = "";
    if(email && email.current)email.current.value = "";
    if(firstName && firstName.current)firstName.current.value = "";
    if(lastName && lastName.current)lastName.current.value = "";
  }

  return (
    <>
    <div
        className={` flex flex-col items-center justify-center  w-[100vw] h-[100vh] px-[20px] bg-[#10141E]/90 absolute z-50 transform transition-all duration-300 ${
          signUpBox ? "" : "hidden"
        } `}
      >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px]">
        <div className="w-[100%] flex justify-between items-center mb-[40px] ">
          <h1 className="text-[32px] text-white font-light tracking-[-0.5px] self-start	">
            Sign Up
          </h1>
          <IoMdClose
            style={{
              color: "white",
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
            onClick={signupClose}
          />
        </div>
        {changeToVerify ? (
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-white text-[32px] font-light text-center ">
              Thank you for signing up! Please check your email and verify your
              address to activate your account. You’ll need to complete this
              step before logging in.
            </h1>
          </div>
        ) : (
          <div className="w-[100%]">
            <div
              className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFFFFF] ${
                emptyUsername ? "border-b-[#FC4747]" : null
              } `}
            >
              <input
                className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
                type="text"
                name="SignUpUsername"
                id="SignUpUsername"
                placeholder="Username"
                autoComplete="off"
                ref={userName}
              />
              <a className="text-[13px] !text-brand-red font-light">
                {emptyUsername ? "Can’t be empty" : null}
              </a>
            </div>
              <div>
            <div
              className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFFFFF] ${
                emptyEmail || emailerr ? "border-b-[#FC4747]" : null
              } `}
            >
              <input
                className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
                type="email"
                name="SignUpEmail"
                id="SignUpEmail"
                placeholder="Email address"
                autoComplete="off"
                ref={email}
              />
              <a className="text-[13px] !text-brand-red font-light">
                {emailerr
                  ? "wrong Email form"
                  : emptyEmail
                  ? "Can’t be empty"
                  : null}
              </a>
            </div>

            <div
              className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFFFFF] ${
                emptyPassword ? "border-b-[#FC4747]" : null
              } `}
            >
              <input
                className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                ref={password}
              />
              <a className="text-[13px] !text-brand-red font-light">
                {emptyPassword ? "Can’t be empty" : null}
              </a>
            </div>

            <div
              className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFFFFF] ${
                emptyFirstName ? "border-b-[#FC4747]" : null
              } `}
            >
              <input
                className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
                type="text"
                name="FirstName"
                id="FirstName"
                placeholder="First name"
                autoComplete="off"
                ref={firstName}
              />
              <a className="text-[13px] !text-brand-red font-light">
                {emptyFirstName ? "Can’t be empty" : null}
              </a>
            </div>
            <div
              className={` relative w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[12px] pb-[14px] md:pl-[16px] md:pb-[18px]  hover:border-b-[#FFFFFF] ${
                emptyLastName ? "border-b-[#FC4747]" : null
              } `}
            >
              <input
                className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none md:w-[200px] lg:w-[230px]"
                type="text"
                name="LastName"
                id="LastName"
                placeholder="Last name"
                autoComplete="off"
                ref={lastName}
              />
              <a className="text-[13px] !text-brand-red font-light">
                {emptyLastName ? "Can’t be empty" : null}
              </a>
            </div>
            </div>
          
            <div className=" w-[100%] pt-[24px] ">
              {(axiosError || googleError) && (
                <p className="text-red-500 text-[12px] whitespace-pre-line text-left mb-[16px]">
                  {[axiosError, googleError].filter(Boolean).join("\n")}
                </p>
              )}
              <button
                className="w-[100%] bg-[#fab907] rounded-[6px] py-[15px] text-[15px] text-white font-light mb-[24px] hover:bg-[#8b7127] hover:!text-brand-navy"
                onClick={HandleSignup}
              >
                Create an account
              </button>
              <div className="w-full flex justify-center" >
              
              <GoogleOAuthProvider clientId={clientId ?? ""}>
                <GoogleLogin
                  text={"signup_with"}
                  logo_alignment="center"
                  onSuccess={onSuccess}
                  onError={() => {setGoogleError("Google Sign Up Error")}}
                  auto_select={false}
                />
              </GoogleOAuthProvider>
              
              </div>
            </div>
            
            <span className=" mt-[24px] flex justify-center items-center">
              <a className="w-[166px] text-[15px] text-white font-light mr-[9px]">
                Do you have an account?
              </a>
              <p
                className="text-[15px] !text-brand-gold font-light cursor-pointer "
                onClick={() => {
                  setSignUpBox(false);
                  setLoginBox(true);
                }}
              >
                Log In
              </p>
            </span>

          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default Signup;
