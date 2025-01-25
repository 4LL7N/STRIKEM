/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";
import {
     useNavigate
     } from "react-router-dom";
import Cookies from 'js-cookie';
import { IoMdClose } from "react-icons/io";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";


function Login({loginBox,setLoginBox,setSignUpBox}:any) {
  const logNavigation = useNavigate();

  const logUsername = useRef<any>(null);
  const logPassword = useRef<any>(null);
  const [emptyLogUsernameErr, setEmptyLogEmailErr] = useState(false);
  const [emptyLogPassErr, setEmptyLogPassErr] = useState(false);
  const [userError, setUserError] = useState(false);
  
  const [axiosError, setAxiosError] = useState<string>("");

  const [googleLogin, setGoogleLogin] = useState(false);
  const [googleToken, setGoogleToken] = useState<string>("");
  const [googleError, setGoogleError] = useState<string>("");

  const clientId = "350212676070-7iflui6iruag475r9hla0hq0amtkqvk4.apps.googleusercontent.com";

  let emptyLogEmailErrChk = false;
  let emptyLogPassErrChk = false;
  
  
  function HandleLogin() {
      
    if(!logUsername.current?.value){
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
      Login();
    }
  }
  const Login = async () => {
    try {
      const response = await axios.post(
        "https://strikem.site/auth/jwt/create",
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


  const googleToBack = async () => {
    try{
      const response = await axios.post("https://strikem.site/users/google-auth/", {
        id_token: googleToken,
        username: logUsername.current?.value,
      })
      console.log(response);

      setSignUpBox(false)
      setGoogleLogin(false)
      setGoogleToken("")
      setGoogleError("")
      logUsername.current.value = ""

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
      const errorArr = Object.values(err?.response.data);
      let error: string = "";
      errorArr.forEach((item) => {
        error += item;
      });
      setAxiosError(error);
      console.log(errorArr);

    }
  }

  const HandleGoogle = () =>{
    if(!googleToken){
      setGoogleError("something went wrong")
      return;
    }
    if (!logUsername.current?.value) {
      setEmptyLogEmailErr(true);
      return;
    } else {
      setEmptyLogEmailErr(false);
    }
    googleToBack();
  }

  const onSuccess = (e: CredentialResponse) => {
    setGoogleToken(e.credential ?? "");
    setGoogleLogin(true);
  };

  return (
    <>
    <div
        className={` flex flex-col items-center justify-center  w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 absolute z-50 transform transition-all duration-300 ${
          loginBox ? "" : "hidden"
        } `}
      >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-[100%] flex justify-between items-center mb-[40px] " >
        <h1 className="text-[32px] text-[#FFF] font-light tracking-[-0.5px]  self-start	">
          Login
        </h1>
        <IoMdClose style={{color:'white',width:'24px',height:'24px',cursor:'pointer'}} onClick={()=>{setLoginBox(false)}} />
        </div>
        <div
          className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
            emptyLogUsernameErr || userError ? "border-b-[#FC4747]" : null
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
        {googleLogin ? null : 
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
            name="LoginPassword"
            id="LoginPassword"
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
        }
        <p
          className={`${
            userError ? "text-[13px] text-[#FC4747] font-light" : "hidden"
          } mb-[40px]  `}
          
        >
          Email or password is not correct
        </p>
        <p className="text-red-500 text-[12px] absolute top-0 ">
                {axiosError}{googleError}
              </p>
              <div className="w-full mb-[24px]" >
        <button
          className="w-[100%] bg-[#fab907] rounded-[6px] py-[15px] text-[15px] text-[#FFF] font-light mb-[24px] hover:bg-[#FFF] hover:text-[#161D2F] "
          onClick={() => {googleLogin?HandleGoogle():HandleLogin();}}
        >
          Login to your account
        </button>
        {googleLogin ? null :
              <GoogleOAuthProvider clientId={clientId ?? ""}>
                <GoogleLogin
                  text={"signin_with"}
                  logo_alignment="center"
                  onSuccess={onSuccess}
                  onError={() => {setGoogleError("Google Sign In Error")}}
                  auto_select={false}
                />
              </GoogleOAuthProvider>
              }
              </div>
        <span className=" flex">
          <a className="w-[156px] text-[15px] text-[#FFF] font-light mr-[9px]">
            Don’t have an account?
          </a>
          <p className="text-[15px] text-[#fab907] font-light " onClick={()=>{setSignUpBox(true);setLoginBox(false)}} >
            Sign Up
          </p>
        </span>
      </div>
      </div>
    </>
  );
}

export default Login;
