/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../../../../ReduxStore/features/userSettingsBox";
import { setNewUsername } from "../../../../../ReduxStore/features/currentUser";
import ChangeUsername from "./ChangeUsername";
import ChangeProfilePicture from "./ChangeProfilePicture";

function ChangeUserInfo() {
    const currentUser = useAppSelector((state) => state.currentUser);
    const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
    const dispatch = useAppDispatch();
    
    const [axiosError,setAxiosError] = useState("")

    // change username

    const logUsername = useRef<HTMLInputElement | null>(null);
    const logPassword = useRef<HTMLInputElement | null>(null);
    const [emptyLogUsernameErr, setEmptyLogUsernameErr] = useState(false);
    const [emptyLogPassErr, setEmptyLogPassErr] = useState(false);
  
    const updateUsername = async ()=>{
      const token = Cookies.get("token");
      try{
        await axios.post("https://strikem.site/auth/users/set_username/",
          {
  
              current_password:logPassword.current?.value ,
               new_username: logUsername.current?.value
          },
          {
              headers: { Authorization: `JWT ${token}` },
          }
        )
        logUsername.current?.value && dispatch(setNewUsername(logUsername.current.value))
        dispatch(setUserSettingsBoxClose());
      }catch(err:any){
        const errorArr = Object.values(err?.response.data);
          let error: string = "";
          errorArr.forEach((item) => {
              error += item;
          });
          console.log(error);
          setAxiosError(error)
      }
    }
  
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
          updateUsername()
      }
  
    }

    //change profile picture

    const fileRef = useRef<HTMLInputElement|null>(null)
    const [emptyFileError,setEmptyFileError] = useState<boolean>(false)
    const [selectedFile,setSelectedFile] = useState<File|null>(null)

    const uploadPicture = async (data:FormData) =>{
        const token = Cookies.get("token");        
        selectedFile && console.log(URL.createObjectURL(selectedFile));
        console.log(Object.fromEntries(data.entries()));
        
        try{
            await axios.patch(`https://strikem.site/api/players/${currentUser.id}/`,{
                    data
                },
                {
                    headers: { Authorization: `JWT ${token}` },
                }
            )
            dispatch(setUserSettingsBoxClose());
            window.location.reload()
        }catch(err:any){
            const errorArr = Object.values(err?.response.data);
            let error: string = "";
            errorArr.forEach((item) => {
                error += item;
            });
            console.log(error);
            setAxiosError(error)
        }
    }

    const handlePicture = () =>{
        if(!selectedFile){
            setEmptyFileError(true)
            setAxiosError("picture is not selected")
            return
        }
        const formData = new FormData()
        console.log(selectedFile,"selectedFile");
        
        formData.append("profile_image",selectedFile)
        setEmptyFileError(false)
        uploadPicture(formData)
        
    }


    return (
      <section className="w-full mt-[24px]">
        {userSettingsBox.settingsPage == "change username" && <ChangeUsername emptyLogUsernameErr={emptyLogUsernameErr} logUsername={logUsername} emptyLogPassErr={emptyLogPassErr} logPassword={logPassword} />}
        {userSettingsBox.settingsPage == "change profile" && <ChangeProfilePicture fileRef={fileRef} emptyFileError={emptyFileError} setSelectedFile={setSelectedFile} selectedFile={selectedFile} />}
        <div className="w-full flex justify-center pt-[32px] relative " >
        <p className="text-red-500 text-[12px] absolute top-0 translate-y-[30%] ">
                  {axiosError}
                </p>
        <button
            className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-[#FFF] font-light hover:bg-[#FFF] hover:text-[#161D2F] "
            onClick={userSettingsBox.settingsPage == "change username"?handleUsername:handlePicture}
          >
            update
          </button>
          </div>
      </section>
    );
}

export default ChangeUserInfo