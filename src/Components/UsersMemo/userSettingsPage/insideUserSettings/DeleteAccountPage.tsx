/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { useAppDispatch } from "../../../../ReduxStore/ReduxHooks";
import { setUserSettingsBoxClose } from "../../../../ReduxStore/features/userSettingsBox";
import { removeCurrentUser } from "../../../../ReduxStore/features/currentUser";
import { setUserLogIn } from "../../../../ReduxStore/features/userLogIn";
import { useNavigate } from "react-router-dom";

function DeleteAccountPage() {

    const navigate = useNavigate()

    const password = useRef<HTMLInputElement|null>(null)

    const [emptyPasswordErr, setEmptyPasswordErr] = useState(false);
    const [axiosError,setAxiosError] = useState("")

    const dispatch = useAppDispatch();

    const logOut = () => {
      dispatch(setUserLogIn(false));
      Cookies.set("token", "logout", {
        secure: true,
        sameSite: "Strict",
      });
      navigate("/home");
      window.location.reload();
    };


    const deleteAcc = async () => {
      const token = Cookies.get("token");

      try{
        // await axios.post("https://strikem.site/users/delete-user/",
        await axios.post("http://localhost:5100/users/delete-user/",
          {
            password:password.current?.value,
          },
          {
            headers: { Authorization: `JWT ${token}` },

          }
        )
        dispatch(removeCurrentUser())
        dispatch(setUserSettingsBoxClose());
        logOut()
      }catch(err:any){
        // .join("\n") so multiple error messages land on separate lines instead of running
        // together - paired with whitespace-pre-line on the <p> that renders this below.
        const error = Object.values<string>(err?.response.data).join("\n");
        console.log(error);
        console.log(err);

        setAxiosError(error)
      }
    }

      

    const handleAccount = () => {

        if(!password.current || !password.current.value){
            setEmptyPasswordErr(true)
        }else{
            setEmptyPasswordErr(false)
            deleteAcc()
        }

    }

  return (
    <section className="w-full mt-[24px]">
        <div
        className={`w-[100%] flex justify-between border-b border-b-solid border-b-[#5A698F] pl-[16px] pb-[18px] hover:border-b-[#FFFFFF] ${
            emptyPasswordErr  ? "border-b-[#FC4747]" : null
            } `}
      >
        <input
          className="w-[150px] text-[15px] text-white font-light bg-transparent focus:outline-none  md:w-[200px] lg:w-[230px]"
          type="password"
          name="Password"
          id="Password"
          placeholder="Password"
          autoComplete="off"
          ref={password}
        />{" "}
        <a
          className={`${
            emptyPasswordErr
              ? "text-[13px] !text-brand-red font-light"
              : "hidden"
          }`}
        >
          Can’t be empty
        </a>{" "}
      </div>
      
      <div className="flex flex-col items-center gap-[8px] w-full pt-[32px]" >
      {axiosError && (
        <p className="text-red-500 text-[12px] whitespace-pre-line text-center">
          {axiosError}
        </p>
      )}
      <button
          className="w-[100%] max-w-[488px] bg-[#fab907] rounded-[6px] py-[12px] text-[15px] text-white font-light hover:bg-[#FFFFFF] hover:!text-brand-navy "
          onClick={handleAccount}
        >
          delete
        </button>
        </div>
    </section>
  )
}

export default DeleteAccountPage