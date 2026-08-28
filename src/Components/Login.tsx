/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";
import {
     useNavigate
     } from "react-router-dom";
import Cookies from 'js-cookie';
import { IoMdClose } from "react-icons/io";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAppDispatch } from "../ReduxStore/ReduxHooks";
import { setSetPasswordPage } from "../ReduxStore/features/userSettingsBox";
import { API_BASE_URL, GOOGLE_CLIENT_ID } from "../config";


function Login({loginBox,setLoginBox,setSignUpBox}:any) {
  const logNavigation = useNavigate();

  const logUsername = useRef<any>(null);
  const logPassword = useRef<any>(null);
  const [emptyLogUsernameErr, setEmptyLogEmailErr] = useState(false);
  const [emptyLogPassErr, setEmptyLogPassErr] = useState(false);
  const [userError, setUserError] = useState(false);
  
  const [axiosError, setAxiosError] = useState<string>("");

  const [googleError, setGoogleError] = useState<string>("");

  const clientId = GOOGLE_CLIENT_ID;

  const dispatch = useAppDispatch()

  // See the matching comment in Signup.tsx - useRef is the React-sanctioned way to hold a value
  // that HandleLogin needs to read back synchronously within the same call, before the real
  // React state (setEmptyLogEmailErr etc.) has re-rendered.
  const emptyLogEmailErrChk = useRef(false);
  const emptyLogPassErrChk = useRef(false);


  function HandleLogin() {

    if(!logUsername.current?.value){
        setEmptyLogEmailErr(true)
        emptyLogEmailErrChk.current = true
    }else{
        setEmptyLogEmailErr(false)
        emptyLogEmailErrChk.current = false
    }

    if(!logPassword.current.value){
        setEmptyLogPassErr(true)
        emptyLogPassErrChk.current = true
    }else{
        setEmptyLogPassErr(false)
        emptyLogPassErrChk.current = false
    }



    if(emptyLogEmailErrChk.current || emptyLogPassErrChk.current ){
      console.log('err')
    }else{
      setUserError(false)
      Login();
    }
  }
  const Login = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/jwt/create`,
        {
          username: logUsername.current?.value,
          password: logPassword.current.value,
        }
      );
      Cookies.set('token',response.data.access
        ,{
        secure: true,
        sameSite: 'Strict',
        expires:1      
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


  const googleToBack = async (googleToken:string) => {
    try{
      const response = await axios.post(`${API_BASE_URL}/users/google-auth/`, {
        id_token: googleToken,
      })
      // console.log(response);

      setSignUpBox(false)
      setGoogleError("")

      Cookies.set('token',response.data.access_token
        ,{
        secure: true,
        sameSite: 'Strict',
        expires:1      
      }
    )

    setLoginBox(false)
    logNavigation("/home");
    window.location.reload()
      
    }catch(err:any){
      // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
      // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
      // multiple messages in the same field get glued together by JS's array-to-string coercion
      // (comma-joined) instead of one per line.
      const error = Object.values<string[]>(err?.response.data).flat().join("\n");
      setAxiosError(error);
      console.log(error);

    }
  }


  const onSuccess = (e: CredentialResponse) => {
    e.credential && googleToBack(e.credential)
  };

  return (
    <>
    <div
        className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E]/90 z-50  ${
          loginBox ? "" : "hidden"
        } `}
      >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-[100%] flex justify-between items-center mb-[40px] " >
        <h1 className="text-[32px] text-white font-light tracking-[-0.5px]  self-start	">
          Login
        </h1>
        <IoMdClose style={{color:'white',width:'24px',height:'24px',cursor:'pointer'}} onClick={()=>{setLoginBox(false)}} />
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
            emptyLogUsernameErr || userError ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
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
                ? "text-[13px] !text-brand-red font-light"
                : "hidden"
            }`}
          >
            Can’t be empty
          </a>{" "}
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] ${
            userError ? "mb-[24px]" : "mb-[40px]"
          } pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
            emptyLogPassErr || userError ? "border-b-[#FC4747]" : null
          } `}
        >
          <input
            className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
            type="password"
            name="LoginPassword"
            id="LoginPassword"
            placeholder="Password"
            ref={logPassword}
          />
          <a
            className={`${
              emptyLogPassErr
                ? "text-[13px] !text-brand-red font-light"
                : "hidden"
            }`}
          >
            Can’t be empty
          </a>{" "}
        </div>
        <p
          className={`${
            userError ? "text-[13px] !text-brand-red font-light" : "hidden"
          } mb-[40px]  `}
          
        >
          Email or password is not correct
        </p>
        {(axiosError || googleError) && (
          <p className="self-start text-red-500 text-[12px] whitespace-pre-line text-left mb-[16px]">
            {[axiosError, googleError].filter(Boolean).join("\n")}
          </p>
        )}
              <div className="w-full mb-[24px]" >
        <button
          className="w-[100%] bg-[#fab907] rounded-[6px] py-[15px] text-[15px] text-white font-light mb-[12px] hover:bg-[#FFFFFF] hover:!text-brand-navy "
          onClick={() => {HandleLogin();}}
        >
          Login to your account
        </button>
        <div className="w-full flex flex-col gap-[12px] items-center" >
        <p className="text-[15px] !text-brand-gold font-light cursor-pointer self-center " onClick={()=>{dispatch(setSetPasswordPage({open:true,settingsPage:"emailCheck"}))}} >forget password</p>
              <GoogleOAuthProvider clientId={clientId ?? ""}
              >
                <GoogleLogin
                  text={"signin_with"}
                  logo_alignment="center"
                  onSuccess={onSuccess}
                  onError={() => {setGoogleError("Google Sign In Error")}}
                  auto_select={false}
                />
              </GoogleOAuthProvider>
              </div>
              </div>
        <span className=" flex">
          <a className="w-[156px] text-[15px] text-white font-light mr-[9px]">
            Don’t have an account?
          </a>
          <p className="text-[15px] !text-brand-gold font-light cursor-pointer " onClick={()=>{setSignUpBox(true);setLoginBox(false)}} >
            Sign Up
          </p>
        </span>
      </div>
      </div>
    </>
  );
}

export default Login;
