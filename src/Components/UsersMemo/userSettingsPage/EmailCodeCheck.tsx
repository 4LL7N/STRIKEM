/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmailCodeCheck as EmailCodeCheckProps } from "../../../type";
import axios from "axios";
import Cookies from "js-cookie";
import { useRef } from "react";
import { useAppSelector } from "../../../ReduxStore/ReduxHooks";
import { API_BASE_URL } from "../../../config";

function EmailCodeCheck({
  emailCode,
  emptyEmailCodeErr,
  uiExpire,
  setUiExpire,
  setAxiosError
}: EmailCodeCheckProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentUser = useAppSelector((state) => state.currentUser);  
  const userSettings = useAppSelector((state) => state.userSettingsBox);

  const sendCodeToEmail = async () => {
    const token = Cookies.get("token");
    timer();
    try {
      await axios.post(
        `${API_BASE_URL}/users/${userSettings.settingsPage == "emailCode"?"get-code":"get-code-forget"}/`,
        {
          email:currentUser.user.email
        },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      setAxiosError("");
    } catch (err:any) {
      // The backend returns errors shaped {"field": ["msg1", "msg2", ...]} - each value is an
      // ARRAY of messages, not a single string. .flat() before .join("\n") is required, or
      // multiple messages in the same field get glued together by JS's array-to-string coercion
      // (comma-joined) instead of one per line.
      const error = Object.values<string[]>(err?.response.data).flat().join("\n");
      console.log(error);
      setAxiosError(error);
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Stop timer immediately
      }
    }
  };

  const timer = () => {
    let timerTime = 59;

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Ensure no duplicate intervals
    }
    intervalRef.current = setInterval(() => {
      if (timerTime === 0 || uiExpire === -1) {
        clearInterval(intervalRef.current!); // Stop interval
        setUiExpire(0);
        return;
      }

      setUiExpire(timerTime);
      timerTime -= 1;
    }, 1000);
  };

  return (
    <>
      <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
          emptyEmailCodeErr ? "border-b-[#FC4747]" : null
        }  `}
      >
        <input
          className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="text"
          name="emailCode"
          id="emailCode"
          placeholder="Code"
          autoComplete="off"
          ref={emailCode}
        />{" "}
        <a
          className={`${
            emptyEmailCodeErr
              ? "text-[13px] !text-brand-red font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      <div className="flex gap-[10px]">
        <p
          className="text-white underline underline-offset-1 "
          onClick={sendCodeToEmail}
        >
          send code on email{" "}
        </p>
        <p className="!text-muted-grey">{uiExpire > 0 ? uiExpire : ""}</p>
      </div>
    </>
  );
}

export default EmailCodeCheck;
