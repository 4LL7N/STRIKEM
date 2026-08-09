import { memo } from 'react'
import { useNavigate } from 'react-router-dom';

interface InvitationAcceptProps {
    acceptInvitation: number;
    setAcceptInvitation: (acceptInvatation: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastJsonMessage: any;
}

const InvitationAcceptMemo = memo(({acceptInvitation,setAcceptInvitation,lastJsonMessage}:InvitationAcceptProps) => {

    const navigate = useNavigate();

  return (
    <div
              className={` z-[1000] flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[60%] transition-transform duration-1000  ${
                acceptInvitation
                  ? " translate-y-[0] "
                  : " translate-y-[-200%] "
              } bg-[#161d2f] `}
            >
              <div className="flex justify-between items-center">
                <p className="flex self-center text-[14px] text-white ml-2 ">
                  invitation accepted, go to chat
                </p>
                <div className="flex items-center gap-[10px]">
                  <button
                    className=" bg-[#fab907] rounded-[20px] px-[8px] py-[4px] text-[14px] text-white hover:bg-[#FFFFFF] hover:!text-brand-navy "
                    onClick={
                      lastJsonMessage?.protocol == "handling_invite_response"
                        ? () => {
                            navigate("/messenger");
                            // Was "matchupId" (lowercase u) - every other place in the app
                            // reads/writes this key as "matchUpId" (Messenger.tsx,
                            // LayoutHeader.tsx, NotificationsBoxItemsMemo.tsx). With the wrong
                            // casing, Messenger.tsx's localStorage.getItem("matchUpId") never
                            // picked up the just-created matchup's real id here - it stayed on
                            // whatever conversation was selected before (or empty, for a
                            // genuinely first-ever chat), so a message sent right after accepting
                            // an invite landed against the wrong (or no) matchup locally. The
                            // backend still received and persisted it via opponent_username
                            // regardless, which is why refreshing - which re-fetches and
                            // re-selects the conversation through the correct path - always
                            // eventually showed it.
                            localStorage.setItem(
                              "matchUpId",
                              lastJsonMessage.matchup_id
                            );
                            setAcceptInvitation(-1);
                          }
                        : () => {}
                    }
                  >
                    Chat
                  </button>
                  <button
                    className=" bg-red-600  rounded-[20px] px-[8px] py-[4px]  text-[14px] text-white hover:bg-[#FFFFFF] hover:!text-brand-navy "
                    onClick={() => {
                      setAcceptInvitation(-1);
                    }}
                  >
                    Ignore
                  </button>
                </div>
              </div>
              <div
                style={{ width: `${acceptInvitation}%` }}
                className={`h-1 rounded-[4px] bg-[#fab907] mx-2 ${
                  acceptInvitation == 0 ? "hidden" : ""
                } `}
              />
            </div>
  )
})

export default InvitationAcceptMemo
