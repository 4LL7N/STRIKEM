/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../../../../ReduxStore/features/userSettingsBox";
import { setNewUsername, setProfileImage } from "../../../../../ReduxStore/features/currentUser";
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
        // await axios.post("https://strikem.site/auth/users/set_username/",
        await axios.post("http://localhost:5100/auth/users/set_username/",
          {
  
              current_password:logPassword.current?.value ,
               new_username: logUsername.current?.value
          },
          {
              headers: { Authorization: `JWT ${token}` },
          }
        )
        logUsername.current?.value && dispatch(setNewUsername(logUsername.current.value))
        setAxiosError("")
        dispatch(setUserSettingsBoxClose());
      }catch(err:any){
        // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
        // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
        // multiple messages in the same field get glued together by JS's array-to-string coercion
        // (comma-joined) instead of one per line.
        const error = Object.values<string[]>(err?.response.data).flat().join("\n");
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
            // await axios.patch(`https://strikem.site/api/players/${currentUser.id}/`,data,
            const response = await axios.patch(`http://localhost:5100/api/players/${currentUser.id}/`,data,
                {
                    headers: { Authorization: `JWT ${token}` },
                }
            )
            // The popup used to close and then window.location.reload() the whole page, which
            // picked up the new picture everywhere as a side effect of re-fetching everything.
            // Now that the reload is gone, the response already contains the new profile_image
            // URL - dispatch it directly so the header/profile avatar update without a reload.
            dispatch(setProfileImage(response.data.profile_image))
            setAxiosError("")
            dispatch(setUserSettingsBoxClose());
        }catch(err:any){
            // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is
            // an ARRAY of messages, not a single string. .flat() before .join("\n") is required,
            // or multiple messages in the same field get glued together by JS's array-to-string
            // coercion (comma-joined) instead of one per line.
            const error = Object.values<string[]>(err?.response.data).flat().join("\n");
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
        {userSettingsBox.settingsPage == "change profile" || userSettingsBox.settingsPage == "Profile from Profile"? <ChangeProfilePicture fileRef={fileRef} emptyFileError={emptyFileError} setSelectedFile={setSelectedFile} selectedFile={selectedFile} />:null}
        <div className="flex flex-col items-center gap-[8px] w-full pt-[32px]" >
        {axiosError && (
          <p className="self-start text-red-500 text-[12px] whitespace-pre-line text-left">
            {axiosError}
          </p>
        )}
        <button
            className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-white font-light hover:bg-[#FFFFFF] hover:!text-brand-navy "
            onClick={userSettingsBox.settingsPage == "change username"?handleUsername:handlePicture}
          >
            update
          </button>
          </div>
      </section>
    );
}

export default ChangeUserInfo