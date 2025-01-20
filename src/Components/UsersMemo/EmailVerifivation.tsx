import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EmailVerifivation() {
  const [verified, setVerified] = useState<boolean>(false);
  const { uid, token } = useParams<{ uid: string; token: string }>();

  const verifyEmail = async () => {
    try {
      const response = await axios(
        `https://strikem.site/users/activate/${uid}/${token}/`
      );
      if (response.status === 200) {
        setVerified(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    if(!uid || !token){
        setVerified(false)
         return
    }
    verifyEmail()
  },[])

  return (
    <div className="bg-[#10141E]  pt-[10%]  w-[100vw] h-[100vh] ">
        {verified ? 
            <div className="flex flex-col gap-6 items-center" >
            <h1 className="text-white text-6xl ">Email is verified</h1>
            <p className="text-white text-4xl ">go back to main site</p>
          </div>
          :
          <div className="flex flex-col gap-6 items-center" >
            <h1 className="text-white text-6xl ">Verifing...</h1>
          </div>

        }
      
    </div>
  );
}

export default EmailVerifivation;
