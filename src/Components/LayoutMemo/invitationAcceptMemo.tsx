import { memo } from 'react'
import { useNavigate } from 'react-router-dom';

interface InvitationAcceptProps {
    acceptInvatation: number;
    setAcceptInvatation: (acceptInvatation: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastJsonMessage: any;
}

const InvitationAcceptMemo = memo(({acceptInvatation,setAcceptInvatation,lastJsonMessage}:InvitationAcceptProps) => {

    const navigate = useNavigate();

  return (
    <div
              className={` z-[1000] flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[60%] transition-transform duration-1000  ${
                acceptInvatation
                  ? " translate-y-[0] "
                  : " translate-y-[-200%] "
              } bg-[#161d2f] `}
            >
              <div className="flex justify-between items-center">
                <p className="flex self-center text-[14px] text-[#fff] ml-2 ">
                  invitation accepted, go to chat
                </p>
                <div className="flex items-center gap-[10px]">
                  <button
                    className=" bg-[#fab907] rounded-[20px] px-[8px] py-[4px] text-[14px] text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] "
                    onClick={
                      lastJsonMessage?.protocol == "handling_invite_response"
                        ? () => {
                            navigate("/messenger");
                            localStorage.setItem(
                              "matchupId",
                              lastJsonMessage.matchup_id
                            );
                            setAcceptInvatation(-1);
                          }
                        : () => {}
                    }
                  >
                    Chat
                  </button>
                  <button
                    className=" bg-red-600  rounded-[20px] px-[8px] py-[4px]  text-[14px] text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] "
                    onClick={() => {
                      setAcceptInvatation(-1);
                    }}
                  >
                    Ignore
                  </button>
                </div>
              </div>
              <div
                style={{ width: `${acceptInvatation}%` }}
                className={`h-1 rounded-[4px] bg-[#fab907] mx-2 ${
                  acceptInvatation == 0 ? "hidden" : ""
                } `}
              />
            </div>
  )
})

export default InvitationAcceptMemo
