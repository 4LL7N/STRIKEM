import { memo } from "react";

const NotificationsBoxItemsMemo = memo(() => {
    const message = () => {
        switch (item.type) {
          case "INV":
            return "invited you";
          case "MSG":
            return "sent you a message.";
          case "REJ":
            return "rejected your invitation.";
          case "ACP":
            return "accepted your invitation.";
          case "GSE":
              return "enter the result of the game.";
          default:
            return "contacted you";
        }
      };

      return (
        <div
          key={item.id}
          className={` cursor-pointer flex items-center gap-[10px] w-[100%] h-[25%] ${
            i == notifications.length - 1
              ? ""
              : "border-b-[1px] border-b-[#243257d5] "
          } p-[10px] ${item.read ? "" : "bg-[#1d2537]"} `}
          onClick={
            item.type == "INV"
              ? () => {
                  navigate(`/matchmake`);
                }
              : item.type == "MSG"
              ? () => {
                  navigate(`/messenger`);
                  localStorage.setItem("matchUpId", item.extra);
                }
              : item.type == "GSE"
              ? () => {
                  localStorage.setItem("sessionId", item.extra);
                  ResultBox()
                }
              :() => {
                  ("");
                }
          }
        >
          <img
            src={item?.sent_by?.profile_image}
            className={`h-[95%] aspect-square rounded-[50%] ${item.type == "GSE" && "hidden"} `}
            alt=""
            onClick={(e) => {
              goProfile(e, item.sent_by.id);
            }}
          />
          <div className="flex flex-col md:gap-[4px] ">
            <h1 className="text-[14px] md:text-[18px] text-[#fff] ">
              {item.type != "GSE" && item.sent_by.user.username} {message()}
            </h1>
            <div className="flex gap-[3px]  ">
              <p
                className={`${
                  item.type == "MSG" ? "" : " hidden "
                } text-[10px] md:text-[14px] text-[#fff]`}
              >
                {messageContent(item.body)}
              </p>
              <p
                className={`text-[10px] md:text-[14px] text-[#7e7e7e] `}
              >
                {" "}
                {timeAgo(item.timestamp)}{" "}
              </p>
            </div>
          </div>
        </div>
      );
});

export default NotificationsBoxItemsMemo;