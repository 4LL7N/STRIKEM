import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setSettingsPage, setUserSettingsBoxClose } from "../../ReduxStore/features/userSettingsBox";
import UserSettingsPage from "./userSettingsPage/UserSettingsPage";
import ChangeUsernamePage from "./userSettingsPage/changeUsernamePage";
import ChangePasswordPage from "./userSettingsPage/ChangePasswordPage";

const UserSettings = () => {
  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const dispatch = useAppDispatch();

  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  `}
    >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center " >
          <div className="flex gap-[2px] items-center" >
            {userSettingsBox.settingsPage != "settings"?
                <>
                  <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} className=" rotate-180 cursor-pointer " onClick={()=>{dispatch(setSettingsPage("settings"))}} />
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
          userSettingsBox.settingsPage == "change username"?
          <ChangeUsernamePage/>
          :
          <ChangePasswordPage/>
        }
      </div>
    </div>
  );
};

export default UserSettings;
