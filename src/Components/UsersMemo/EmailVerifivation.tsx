import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function EmailVerifivation() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  // Missing uid/token means there's nothing to verify - decide that up front as the initial
  // state instead of setState-ing it from inside the effect below, so the "something went wrong"
  // state is what's rendered on the very first paint rather than an effect-triggered re-render.
  const [verified, setVerified] = useState<number>(!uid || !token ? 2 : 0);

  useEffect(()=>{
    if(!uid || !token) return;

    const verifyEmail = async () => {
      try {
        const response = await axios(
          `${API_BASE_URL}/users/activate/${uid}/${token}/`
        );
        if (response.status === 200) {
          setVerified(1);
        }else{
          setVerified(2)
        }
      } catch (err) {
        console.log(err);
        setVerified(2)
      }
    };
    verifyEmail()
  },[])

  return (
    <div className="bg-[#10141E]  pt-[10%]  w-[100vw] h-[100vh] ">
        {verified == 1 ? 
            <div className="flex flex-col gap-6 items-center" >
            <h1 className="text-white text-6xl ">Email is verified</h1>
            <p className="text-white text-4xl ">go back to main site</p>
          </div>
          :
          verified == 0?
          <div className="flex flex-col gap-6 items-center" >
            <h1 className="text-white text-6xl ">Verifying...</h1>
          </div>
          :
          <div className="flex flex-col gap-6 items-center" >
          <h1 className="text-white text-6xl ">Something went wrong</h1>
        </div>
        }
      
    </div>
  );
}

export default EmailVerifivation;
