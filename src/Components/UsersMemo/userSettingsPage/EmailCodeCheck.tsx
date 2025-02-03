/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmailCodeCheck } from '../../../type'
import axios from 'axios';
import Cookies from "js-cookie";
import { useRef } from 'react';



function EmailCodeCheck({emailCode,emptyEmailCodeErr,uiExpire,setUiExpire}:EmailCodeCheck) {
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    const sendCodeToEmail = async () => {
        const token = Cookies.get("token");
        timer()
        try {
          await axios.post("https://strikem.site/users/get-code/",{},
              {
                  headers: { Authorization: `JWT ${token}` },
              }
          )
        } catch (err) {
          console.log(err);
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
            className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] mb-[24px] pl-[16px] pb-[18px] hover:border-b-[#FFF] ${
                emptyEmailCodeErr  ? "border-b-[#FC4747]" : null
                }  `}
          >
            <input
              className="w-[150px] text-[15px] text-[#FFF] font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
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
              ? "text-[13px] text-[#FC4747] font-light"
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
            <p className="text-[#757171]">{uiExpire > 0 ? uiExpire : ""}</p>
          </div>
          </>
  )
}

export default EmailCodeCheck