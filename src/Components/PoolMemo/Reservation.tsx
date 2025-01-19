/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "../CSS/Reservation.css";

import { memo, useMemo, useState } from "react";

import { useEffect } from "react";
import { useWebSocketContext } from "../Websocket";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
import axios from "axios";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useLocation } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

interface Player {
  id: number;
  profile_image?: string;
  total_points?: number;
  user?: {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    username: string;
  };
}

interface Reservation {
  duration: number;
  finished_reservation: boolean;
  id: number;
  other_player_details: PlayerDetails;
  player_reserving: PlayerDetails;
  start_time: string; // ISO date-time string
}

interface PlayerDetails {
  id: number;
  profile_image: string;
  total_points: number;
  user: UserDetails;
}

interface UserDetails {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
}

interface PoolHall {
  id: number;
  title: string;
  address: string;
  tables: Table[];
  avg_rating: number;
  pics: Picture[];
  room_image: string;
  table_count: number;
  slug: string;
  latitude: number;
  longitude: number;
  open_time: string;
  close_time: string;
}

interface Table {
  id: number;
  current_session: any;
  free: boolean;
  left: number;
  top: number;
}

interface Picture {
  id: number;
  image: string;
}

const Reservation = memo(
  ({
    reservationBox,
    PoolInfo,
  }: {
    reservationBox: boolean;
    PoolInfo: PoolHall;
  }) => {
    const { logedIn, setReservationBox } = useWebSocketContext();
    const location = useLocation();

    const [tableDate, setTableDate] = useState<string>("");
    const [daySelect, setDaySelect] = useState<boolean>(false);
    const [selectDates, setSelectDates] = useState<string[]>([]);

    const options = Array.from({ length: 5 }, (_, i) => ({
      value: (i + 1) * 30,
      label: `${(i + 1) * 30}`,
    }));

    const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(
      null
    );
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<number | null>(
      null
    );

    const [opponentsList, setOpponentsList] = useState<Player[]>([]);
    const [openOpponents, setOpenOpponents] = useState<boolean>(false);

    const [todayReservation, setTodayReservation] = useState<Reservation[]>([]);
    const [tomorrowReservation, setTomorrowReservation] = useState<
      Reservation[]
    >([]);
    const [afterTomorrowReservation, setAfterTomorrowReservation] = useState<
      Reservation[]
    >([]);

    const currentUser = useMemo(() => {
      return localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser")!)
        : null;
    }, []);

    const [poolInfo, setPoolInfo] = useState<PoolHall | null>(PoolInfo);

    const [reserverError, setReserverError] = useState<string | null>(null);

    const tableID = localStorage && localStorage.getItem("tableId");

    const tillClose =  dayjs(poolInfo?.close_time,"HH:mm:ss").isAfter(dayjs(poolInfo?.open_time,"HH:mm:ss")) ?false:dayjs(poolInfo?.close_time,"HH:mm:ss").isAfter(dayjs())    

    useEffect(() => {
      setPoolInfo(location.state);
    }, [location.state]);

    const fetchPlayers = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get("https://strikem.site/api/matchups/", {
          headers: { Authorization: `JWT ${token}` },
        });

        const opponents: Player[] = [{ id: -1 }];
        response.data.results.forEach((item: any) => {
          if (item.player_accepting.id == currentUser?.id) {
            opponents.push(item.player_inviting);
          } else {
            opponents.push(item.player_accepting);
          }
        });
        setOpponentsList(opponents);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchReservations = async () => {
      function date(daysToAdd: number) {
        const dateNow = dayjs();
        
        
        dateNow.add(daysToAdd, "day");

        
        return dateNow.format("YYYY-MM-DD");
      }
      // const presentTime = dayjs().format("HH:mm:ss")
      
      
      try {
        const [todayResponse, tomorrowResponse, afterTomorrowResponse] =
          await Promise.all([
            axios.get(
              `https://strikem.site/api/poolhouses/${
                poolInfo?.id
              }/tables/${tableID}/reserve/?date=${
                tillClose ? date(-1) :
                 date(0)}`
            ),
            axios.get(
              `https://strikem.site/api/poolhouses/${
                poolInfo?.id
              }/tables/${tableID}/reserve/?date=${
                tillClose ? date(0) :
                 date(1)}`
            ),
            axios.get(
              `https://strikem.site/api/poolhouses/${
                poolInfo?.id
              }/tables/${tableID}/reserve/?date=${
                tillClose ? date(1) :
                 date(2)}`
            ),
          ]);
          
        setTodayReservation(todayResponse.data);
        setTomorrowReservation(tomorrowResponse.data);
        setAfterTomorrowReservation(afterTomorrowResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    const postReservation = async(body:{
      start_time: string;
      duration: number;
      other_player: Player;
  } | {
      start_time: string;
      duration: number;
      other_player?: undefined;
  })=>{
      const token = Cookies.get("token");
      try{
        await axios.post(`https://strikem.site/api/poolhouses/${poolInfo?.id}/tables/${tableID}/reserve/`
        ,body
        ,{
          headers: { Authorization: `JWT ${token}` },
        })
        // window.location.reload()
        setReservationBox(false)
      }catch(err){
        console.log(err)
      }
    }

    useEffect(() => {
      const date = new Date();

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const nextDay = (Number(day) + 1).toString().padStart(2, "0");

      const formattedDate = `${year}/${month}/${tillClose?Number(day)-1:day}-${tillClose?Number(nextDay)-1:nextDay}`;
      
      setTableDate(formattedDate);
      const selectData = [];
      for (let i = 0; i < 3; i++) {
        const Day = (
          tillClose ? Number(day) + i - 1 :
         Number(day) + i)
          .toString()
          .padStart(2, "0");
        const NextDay = (
          tillClose ? Number(nextDay) + i - 1 :
          Number(nextDay) + i
        )
          .toString()
          .padStart(2, "0");

        
        selectData.push(`${year}/${month}/${Day}-${NextDay}`);
        
      }
      setSelectDates(selectData);

      if (logedIn) {
        fetchPlayers();
      }
      if (poolInfo && tableID) {
        fetchReservations();
      }
    }, [reservationBox]);

    const handleTimeSelect = (e: dayjs.Dayjs | null) => {
      const hour = dayjs(e?.toDate()).hour();
      let day = `${tableDate.split("/")[1]}/${
        hour >= 0 && hour <= 3
          ? tableDate.split("/")[2].split("-")[1]
          : tableDate.split("/")[2].split("-")[0]
      }/${tableDate.split("/")[0]}`;
      day += ` ${dayjs(e?.toDate()).format("hh:mm A")}`;

      setSelectedTime(day);
    };

    const events = () => {
      
      const schedule =
      tableDate == selectDates[0]
      ? todayReservation
      : tableDate == selectDates[1]
      ? tomorrowReservation
      : afterTomorrowReservation;
      
      const arr = schedule.map((item: Reservation) => {
        const currentDay = new Date().getDate(); // Extract the current day
        const updatedStartTime = item.start_time.replace(
          tableDate.split("/")[tableDate.split("/").length - 1].split("-")[0],
          currentDay.toString()
        );
        return { ...item, start_time: updatedStartTime }; // Return the modified object
      });
      
      return arr.map((time) => {
        
        const start = time?.start_time;
        const end = dayjs(start)
          .add(time?.duration + 5, "minute")
          .format();
        
        return {
          
          title: "Occupied",
          start,
          end,
          color: "#fab907",
        };
      });
    };

    const handleEventContent = (eventInfo: any) => {
      return (
        <div
          style={{
            backgroundColor: eventInfo.event.backgroundColor,
            color: "white",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "4px",
          }}
        >
          <p>{eventInfo.timeText.split("-")[0]}</p>
          <p>{eventInfo.timeText.split("-")[1]}</p>
        </div>
      );
    };

    const handleDurationChange = (
      _: any,
      value: { value: number; label: string } | null
    ) => {
      if (value) {
        setSelectedDuration(value.value);
      }
    };

    const handleReserveSubmit = () => {

      if(!selectedTime){
        setReserverError("Please select time")
        return
      }

      if(!selectedDuration){
        setReserverError('Please select duration')
        return
      }else if(selectedDuration % 5 == 0){
        setReserverError('please select duration in 5 minutes interval')

      }

      const schedule =
        tableDate == selectDates[0]
          ? todayReservation
          : tableDate == selectDates[1]
          ? tomorrowReservation
          : afterTomorrowReservation;
          

      const afterMidnight =
            poolInfo &&
            poolInfo?.close_time < poolInfo?.open_time &&
            selectedTime.split(' ')[2] == "AM" &&
            Number(selectedTime.split(' ')[1].split(":")[0]) <
              Number(poolInfo?.close_time.split(":")[0])
              ? true
              : false;

        const dayDate =   `${tableDate.split('/').slice(0,-1).join('/')}/${afterMidnight?tableDate.split('/')[2].split('-')[1]:tableDate.split('/')[2].split('-')[0]}`

        const newReserveTime = `${dayDate} ${selectedTime.split(' ')[1]} ${selectedTime.split(' ')[2]}`;

      function checkOverlap(startTime1:string, duration1:number, startTime2:string, duration2:number) {
        // Parse start times

        const start1 = dayjs(startTime1, "YYYY/MM/DD hh:mm A").format("YYYY-MM-DDTHH:mm:ssZ");
        const start2 = dayjs(startTime2);

        // Calculate end times
        const end1 =dayjs(start1).add(duration1, "minute");
        const end2 = start2.add(duration2, "minute");
       
        let overlap = false

        if(dayjs(start1).hour()<start2.hour()){ 
          if(end1.hour()<=start2.hour()){
            if(end1.hour()==start2.hour()){
              if((start2.minute()-end1.minute()) >= 5){
                
                overlap = false 
              }else{
                overlap = true
              }
            }else{
              overlap=false
            }
          }else{
            overlap = true
          }
        }else if(dayjs(start1).hour()>start2.hour()){
            if(end2.hour()<=dayjs(start1).hour()){
              if(end2.hour()==dayjs(start1).hour()){
                if((dayjs(start1).minute()-end2.minute()) >= 5){
                  overlap = false 
                }else{                  
                 overlap = true
                }
              }else{
                overlap=false
              }
            }else{
              overlap = true
            }
        }else{
          overlap = true
        }
        
        return overlap 
      }

      if(dayjs(newReserveTime).add(selectedDuration,"minute").isBefore(dayjs())){        
        setReserverError('Cannot reserve time before current time')
        return
      }

      if(dayjs(newReserveTime).isAfter(dayjs(poolInfo?.close_time))){        
        setReserverError('Cannot reserve after pool close time')
        return
      }

      const error = schedule.some((item:Reservation)=>{return checkOverlap(newReserveTime,selectedDuration+5,item.start_time,item.duration)})
      if(error){
        setReserverError('time overlap, change reservation time or duration')
        return
      }else{
        setReserverError('')
      }

      

      const start_time = dayjs(newReserveTime, "YYYY/MM/DD hh:mm A").format("YYYY-MM-DDTHH:mm:ssZ")

      const newReservation = selectedOpponent? {
        start_time,
        duration:selectedDuration,
        other_player:selectedOpponent
      }:{
        start_time,
        duration:selectedDuration,
      }
      
      postReservation(newReservation)

    };


    return (
      <div className="w-[100%] md:w-auto p-[18px] md:pb-[24px] flex flex-col items-center bg-[#161D2F] rounded-[10px] md:rounded-[20px] ">
        <div className="w-[100%] flex justify-between items-center mb-[8px] md:mb-0 md:p-[12px_12px_0px_12px] relative ">
          <div className="flex gap-[15px] ">
            <div className="w-[100px] md:w-[200px] h-fit text-[10px] md:text-[16px] flex justify-between items-center p-[2px] px-[4px] md:p-1 md:px-2 text-white border-[1px] border-white rounded-xl relative ">
              {tableDate}
              <IoIosArrowDown
                style={{ color: "white" }}
                className={`transform transition-all duration-300 ${
                  daySelect && " rotate-180 "
                } `}
                onClick={() => {
                  setDaySelect((i) => !i);
                }}
              />
              <div
                className={` bg-[#161D2F] border-[1px] border-white rounded-xl overflow-hidden absolute right-0 top-[125%] z-30 ${
                  !daySelect && "hidden"
                } `}
              >
                {selectDates.map((item: string, i: number) => {
                  return (
                    <div
                      key={i}
                      className={` ${
                        selectDates.length != i + 1 &&
                        "border-b-[1px] border-b-white"
                      } py-[2px] px-[6px] md:py-1 md:px-[10px] text-white text-[10px]  md:text-[14px] bg-[#161D2F] `}
                      onClick={() => {
                        setTableDate(item);
                        setDaySelect(false);
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className={`w-[100px] md:w-[200px] h-fit text-[10px] md:text-[16px] flex justify-between items-center p-[2px] px-[4px] md:p-1 md:px-2 border-[1px] border-white rounded-xl relative ${
                !logedIn && "hidden"
              } `}
            >
              <div className="flex gap-[10px]">
                <img
                  className={`${
                    !selectedOpponent && "hidden"
                  } h-[15px] md:h-[24px] rounded-[50%] aspect-square `}
                  src={selectedOpponent?.profile_image}
                  alt=""
                />
                <p className="text-white">
                  {selectedOpponent
                    ? `${selectedOpponent.user?.username}`
                    : "No Opponent"}
                </p>
              </div>
              <IoIosArrowDown
                style={{ color: "white" }}
                className={`transform transition-all duration-300 ${
                  openOpponents && " rotate-180 "
                } `}
                onClick={() => {
                  setOpenOpponents((i) => !i);
                }}
              />
              <div
                className={` bg-[#161D2F] opacity-100 border-[1px] border-white rounded-xl overflow-hidden absolute right-0 top-[125%] z-30 ${
                  !openOpponents && "hidden"
                } `}
              >
                {opponentsList.map((item: Player, i: number) => {
                  return (
                    <div
                      key={i * 342}
                      className={` ${
                        opponentsList.length != i + 1 &&
                        "border-b-[1px] border-b-white"
                      }  py-[2px] px-[6px] md:py-1 md:px-[10px] flex gap-[5px] md:gap-[10px] bg-[#161D2F] opacity-100 `}
                      onClick={() => {
                        setOpenOpponents(false);
                          if (item.id == -1) {
                            setSelectedOpponent(null);
                          } else {
                            setSelectedOpponent(item);
                          }
                      }}
                    >
                      <img
                        className={`${
                          item.id == -1 && "hidden"
                        } h-[14px] md:h-[21px] rounded-[50%] aspect-square `}
                        src={item?.profile_image}
                        alt=""
                      />
                      <p className=" text-white text-[10px] md:text-[14px] ">
                        {item.id == -1 ? "No Opponent" : item?.user?.username}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <IoMdClose
            style={{
              color: "white",
            }}
            className=" w-[14px] h-[14px] md:w-[24px] md:h-[24px] cursor-pointer"
            onClick={() => {
              setReservationBox(false);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 md:flex-row md:p-3 w-[300px] md:w-auto ">
          <div className=" border-collapse border border-gray-400 w-[300px]  rounded-[10px] overflow-hidden">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="customTimeGridDay"
              nowIndicator={false} // Disable the now indicator
              allDaySlot={false}
              headerToolbar={false} // Disable the header toolbar
              dayHeaders={false} // Disable the day headers
              slotMaxTime={
                PoolInfo?.close_time == "00:00:00"
                  ? "24:00:00"
                  : Number(PoolInfo?.close_time.split(":")[0]) <
                    Number(PoolInfo?.open_time.split(":")[0])
                  ? `${24 + Number(PoolInfo?.close_time.split(":")[0])}:00:00`
                  : PoolInfo?.close_time
              }
              slotMinTime={PoolInfo?.open_time}
              expandRows={true}
              height="422px"
              events={events()}
              eventContent={handleEventContent}
              slotLabelContent={(slotInfo:any) => {
                return(
                <div style={{ color: "white", height: "100%" }}>
                  {slotInfo?.text}
                </div>
              )}}
              views={{
                customTimeGridDay: {
                  type: "timeGrid",
                  duration: { days: 1 },
                  buttonText: "Custom Day",
                  slotDuration: "00:30:00", // 30-minute slots
                  slotLabelFormat: {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  },
                  dayHeaderFormat: undefined, // Remove the weekday header
                },
              }}
            />
          </div>
          <div className={`flex flex-col gap-[10px] ${!logedIn && "hidden"} `}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticTimePicker
                orientation={"portrait"}
                defaultValue={dayjs(`${Date()}`)}
                slots={{
                  actionBar: () => null,
                }}
                sx={{
                  bgcolor: "transparent",
                  "& .MuiTypography-root": {
                    color: "white",
                  },
                  "& .css-oyx3il.Mui-selected": {
                    color: "#fab907",
                  },
                  "& .MuiClockNumber-root": {
                    color: "white",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                  "& .MuiPickersToolbar-root": {
                    paddingTop: 0,
                  },
                  "& .css-jdw6pu-MuiTypography-root-MuiPickersToolbarText-root.Mui-selected":
                    {
                      color: "#fab907",
                    },

                  "& .css-1mafmct ": {
                    backgroundColor: "#fab907",
                  },
                  "& .MuiClock-pin": {
                    backgroundColor: "#fab907",
                  },
                  "& .MuiClockPointer-thumb": {
                    border: "16px solid #fab907",
                    backgroundColor: "transparent",
                  },
                  "& .css-pncb2q-MuiClockPointer-root": {
                    backgroundColor: "#fab907",
                  },
                  "& .css-1h2qg9i-MuiClockPointer-root": {
                    backgroundColor: "#fab907",
                  },
                  "& .css-16l5jv0-MuiButtonBase-root-MuiIconButton-root-MuiClock-pmButton":
                    {
                      backgroundColor: "#fab907",
                    },
                  "& .css-16l5jv0-MuiButtonBase-root-MuiIconButton-root-MuiClock-pmButton:hover":
                    {
                      backgroundColor: "#956f06",
                    },
                  "& .css-1o37o8l-MuiButtonBase-root-MuiIconButton-root-MuiClock-amButton":
                    {
                      backgroundColor: "#fab907",
                    },
                  "& .css-1o37o8l-MuiButtonBase-root-MuiIconButton-root-MuiClock-amButton:hover":
                    {
                      backgroundColor: "#956f06",
                    },
                  "& .css-3jstwd":{
                    backgroundColor:"#fab907"
                  },
                  "& .css-3jstwd:hover":{
                    backgroundColor:"#956f06"
                  },
                  "& .css-c6olds":{
                    backgroundColor:"#fab907"
                  },
                  "& .css-c6olds:hover":{
                    backgroundColor:"#fab907"
                  },
                  "& .css-f1s25r ":{
                    backgroundColor:"#fab907"
                  }
                }}
                ampmInClock={true}
                onChange={handleTimeSelect}
                minutesStep={5}
              />
            </LocalizationProvider>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => `${option.label}`}
              onChange={handleDurationChange}
              renderInput={(params) => (
                <TextField {...params} label="Select a number" />
              )}
              sx={{
                "& .css-113d811-MuiFormLabel-root-MuiInputLabel-root": {
                  color: "#fab907",
                },
                "& .css-113d811-MuiFormLabel-root-MuiInputLabel-root.Mui-focused":
                  {
                    color: "#956f06",
                  },
                "& .css-1n04w30-MuiInputBase-root-MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#fab907",
                  },
                "& .css-1n04w30-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#956f06",
                  },
                "& .css-1n04w30-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#956f06",
                  },
                "& .css-19qnlrw-MuiFormLabel-root-MuiInputLabel-root": {
                  color: "#fab907",
                },
                "& .css-1dune0f-MuiInputBase-input-MuiOutlinedInput-input": {
                  color: "white",
                },
                "& .css-160rfsr":{
                  color:"#fab907"
                },
                "& .css-160rfsr.Mui-focused":{
                  color:"#956f06"
                },
                "& .css-5v2ak0":{
                  borderColor:"#fab907"
                },
                "& .css-1kmkvia.Mui-focused .MuiOutlinedInput-notchedOutline":{
                  borderColor:"#956f06"
                },
                "& .css-1kmkvia:hover .MuiOutlinedInput-notchedOutline":{
                  borderColor:"#956f06"
                },
                "& .css-qwdxx6":{
                  color:"#fab907"
                },
                "& .css-1niro10":{
                  color:"#fab907"
                },
                "& .css-1niro10.Mui-focused":{
                  color:"#956f06"
                }
              }}
            />
          </div>
        </div>
        <div
          className={` justify-end w-[100%] flex gap-2 px-0 md:px-4 mt-[10px] md:mt-0 `}
        >
          <p className={reserverError?"text-[16px] text-red-600 ":"hidden"}>{reserverError}</p>
          <button
            className="px-2 py-1 bg-[#fab907] rounded-[8px] md:rounded-[12px] text-white text-[12px] md:text-[16px] "
            onClick={handleReserveSubmit}
          >
            RESERVE
          </button>
        </div>
      </div>
    );
  }
);

export default Reservation;
