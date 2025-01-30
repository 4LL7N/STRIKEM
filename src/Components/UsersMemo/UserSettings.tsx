import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../ReduxStore/features/userSettingsBox";

const UserSettings = () => {
  const userSettingsBox = useAppSelector((state) => state.userSettingsBox);
  const dispatch = useAppDispatch();

  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] min-h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90 z-50  `}
    >
      <div className="w-[100%] md:w-[536px] p-[24px] pb-[32] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-full flex justify-between items-center " >
          <h1 className="text-[32px] text-[#FFF]">User settings</h1>
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
      </div>
    </div>
  );
};

export default UserSettings;
