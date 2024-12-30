import dayjs from "dayjs";
import { memo, useEffect, useState } from "react"

interface current_session {
    id: number;
    start_time: string; // ISO 8601 formatted date string
    duration: number; // Duration in minutes
    finished_reservation: boolean;
    other_player_details: PlayerDetails;
    player_reserving: PlayerDetails;
  }
  
  interface PlayerDetails {
    id: number;
    profile_image: string; // URL of the profile image
    total_points: number;
    user: User;
  }
  
  interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }

interface Table {
    id: number;
    current_session: current_session;
    free:boolean;
    left:number;
    top:number;
  }

const ReservationOnTable = memo(({item,setReservationBox,nameLength}:{item:Table,setReservationBox:(ReservationBox:boolean)=>void,nameLength:number})=>{

    const [timeLeft, setTimeLeft] = useState<string>("");

      useEffect(() => {
        // console.log(item)
        if (!item.current_session) return
        const endTime = dayjs(item.current_session.start_time).add(item.current_session.duration, "minute"); // Calculate end time
    
        const calculateTimeLeft = () => {
          const now = dayjs(); // Current time
          const diff = endTime.diff(now); // Difference in milliseconds
    
          if (diff <= 0) {
            setTimeLeft("Time's up!");
            return;
          }
    
          // Convert milliseconds to hours, minutes, and seconds
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
          setTimeLeft(`${hours?`${hours}h`:""} ${minutes?`${minutes}m`:""} ${seconds?`${seconds}s`:""}`);
        };
    
        calculateTimeLeft(); // Update immediately when the component loads
        const intervalId = setInterval(calculateTimeLeft, 1000); // Update every second
    
        return () => clearInterval(intervalId); // Cleanup interval on unmount
      }, [item.current_session]);
      
  return (
    <div style={{position:"absolute",top:`${item.top}%`,left:`${item.left}%`}} className=" flex-col z-50 w-[6%] h-[14%] p-2 bg-white rounded-md md:rounded-xl cursor-pointer flex justify-center items-center ">
        {
          item.free ?
          <p className="text-[#fab907] text-[8px] sm:text-[12px] lg:text-[14px]">
            FREE
        </p>
          :
          <div className=" flex-col  bg-white flex justify-center items-center ">
        <p className="text-[#fab907] text-[8px] sm:text-[12px] lg:text-[14px]">
          {nameLength?item.current_session.player_reserving.user.username.slice(0,nameLength):item.current_session.player_reserving.user.username}{nameLength?".. ":" "}
          {item.current_session.other_player_details?'vs':""}{" "}
          {item.current_session.other_player_details?nameLength?item.current_session.other_player_details.user.username.slice(0,nameLength):item.current_session.other_player_details.user.username:""}{item.current_session.other_player_details?nameLength?".. ":" ":""}
        </p>
        <p className="text-[#fab907] text-[8px] sm:text-[12px] ">{timeLeft}</p>
        </div>
        }
        <button
          className="w-[100%] flex justify-center  bg-[#fab907] text-white text-[8px] sm:text-[12px] py-[2px] md:py-1 rounded-[5px] md:rounded-[10px] mt-1  pointer-events-auto"
          onClick={() => {
            localStorage.setItem("tableId",item.id.toString())
              setReservationBox(true);
          }}
        >
          RESERVE
        </button>
    </div>  
  )
})

export default ReservationOnTable
