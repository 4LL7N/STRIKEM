import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setSettingsPage, setUserSettingsBoxClose } from "../../ReduxStore/features/userSettingsBox";
import UserSettingsPage from "./userSettingsPage/insideUserSettings/UserSettingsPage";
import ChangeUserPage from "./userSettingsPage/insideUserSettings/changeUserInfo/SettingsUserPage";
import ChangePasswordPage from "./userSettingsPage/insideUserSettings/ChangePasswordPage";
import DeleteAccountPage from "./userSettingsPage/insideUserSettings/DeleteAccountPage";
import SetPasswordBox from "./userSettingsPage/insideUserSettings/SetPasswordBox";
import ChangeUserInfo from "./userSettingsPage/insideUserSettings/changeUserInfo/ChangeUserInfo";

const UserSettings = () => {
  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const dispatch = useAppDispatch();
  
  const goBack = () => {
    if(userSettingsBox.settingsPage != "change username" && userSettingsBox.settingsPage != "change profile"){
      dispatch(setSettingsPage("settings"))
      return
    }
    dispatch(setSettingsPage("change user"))
  }

  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  `}
    >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center " >
          <div className="flex gap-[2px] items-center" >
            {userSettingsBox.settingsPage != "settings"?
                <>
                  <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} className=" rotate-180 cursor-pointer " onClick={goBack} />
                  <h1 className="text-[20px] text-[#FFF] leading-6 ">{userSettingsBox.settingsPage}</h1> 
                </> 
              :
                <h1 className="text-[32px] text-[#FFF]">User settings</h1>  
            }
          </div>
          <IoMdClose
            style={{
              color: "white",
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(setUserSettingsBoxClose());
            }}
          />
        </div>
        {userSettingsBox.settingsPage == "settings"?
          <UserSettingsPage/>
          :
          userSettingsBox.settingsPage == "change user" ?
          <ChangeUserPage/>
          :
          userSettingsBox.settingsPage == "change password"?
          <ChangePasswordPage/>
          :
          userSettingsBox.settingsPage == "forget password"?
          <SetPasswordBox/>
          :
          userSettingsBox.settingsPage == "delete account"?
          <DeleteAccountPage/>
          :
          userSettingsBox.settingsPage == "change username" || userSettingsBox.settingsPage == "change profile"?
          <ChangeUserInfo/>
          :
          null
        }
      </div>
    </div>
  );
};

export default UserSettings;
