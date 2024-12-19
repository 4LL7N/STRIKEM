/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { useEffect } from "react";
import { useWebSocketContext } from "./Websocket";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
import axios from "axios";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

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

function Reservation() {
  const { logedIn, setReservationBox } = useWebSocketContext();

  const [tableDate, setTableDate] = useState<string>("");
  const [daySelect, setDaySelect] = useState<boolean>(false);
  const [selectDates, setSelectDates] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string>("");

  const [markedTimes, setMarkedTimes] = useState<string[]>([]);

  const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(null);
  const [opponentsList, setOpponentsList] = useState<Player[]>([]);
  const [openOpponents, setOpenOpponents] = useState<boolean>(false);

  const [todayReservation, setTodayReservation] = useState<Reservation[]>([]);
  const [tomorrowReservation, setTomorrowReservation] = useState<Reservation[]>(
    []
  );
  const [afterTomorrowReservation, setAfterTomorrowReservation] = useState<
    Reservation[]
  >([]);

  const [timeCalendar, setTimeCalendar] = useState<
    { time: string; reserved: boolean }[][]
  >([]);

  const currentUser = useMemo(() => {
    return localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")!)
      : null;
  }, []);

  const generateInitialReservations = () => {
    const timeSlots = [];
    let startHour = 8;
    const endHour = 3;
    let startMinute = "00";
    let day = 1;
    // let afterMidnight = "AM"

    const box =
      endHour < startHour
        ? (12 + (12 - startHour) + endHour) * 2
        : (12 + (endHour - startHour)) * 2;

    for (let i = 0; i < box; i++) {
      if (startHour == 0 && startMinute == "00") {
        day++;
      }
      timeSlots.push({
        time: `${day},${
          startHour.toString().split(".")[0].length == 1 ? "0" : ""
        }${startHour.toString().split(".")[0]}:${startMinute}`,
        reserved: false,
      });

      if (startMinute == "30") {
        startMinute = "00";
        startHour += 1;
      } else {
        startMinute = "30";
      }
      if (startHour == 24) {
        startHour = 0;
      }
    }
    return timeSlots;
  };

  const createGrid = (TodayReservations: Reservation[]) => {
    const grid: { time: string; reserved: boolean }[][] = [];
    for (let row = 0; row < 6; row++) {
      const rowSlots = [];
      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col;
        if (index < generateInitialReservations().length) {
          rowSlots.push(generateInitialReservations()[index]);
        }
      }
      grid.push(rowSlots);
    }

    TodayReservations.forEach((item: Reservation) => {
      const time = item.start_time
        .split("T")[1]
        .split("+")[0]
        .split(":")
        .slice(0, -1)
        .join(":");
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          const howLong = item.duration / 30;
          if (
            grid[i][j].time.split(",")[1].split(":")[0] == time.split(":")[0]
          ) {
            if (Number(time.split(":")[1]) >= 30) {
              if (grid[i][j].time.split(",")[1].split(":")[1] == "30") {
                for (let k = 0; k < howLong; k++) {
                  let anotherLine = 0;
                  grid[i][j + k]
                    ? (grid[i][j + k].reserved = true)
                    : grid[i + 1]
                    ? (grid[i + 1][anotherLine].reserved = true)
                    : null;

                  if (k == 0 || k == howLong - 1) {
                    let newReservation = `${
                      grid[i][j].time.split(",")[0]
                    },${time}`;

                    if (k == howLong - 1 && time.split(":")[1] != "30") {
                      grid[i][j].time = newReservation;
                      const plusduration = Math.floor(howLong / 2);

                      const houres =
                        time.split(":")[0] == "23"
                          ? "00"
                          : howLong % 2
                          ? Number(time.split(":")[0]) + plusduration + 1
                          : Number(time.split(":")[0]) + plusduration;
                      const newTime = `${houres}:${
                        howLong % 2
                          ? Number(time.split(":")[1]) - 30
                          : time.split(":")[1]
                      }`;

                      const day =
                        Number(newTime.split(":")[0]) < 8 &&
                        Number(grid[i][j].time.split(",")[1].split(":")[0]) > 8
                          ? Number(grid[i][j].time.split(",")[0]) + 1
                          : grid[i][j].time.split(",")[0];
                      newReservation = `${day},${newTime}`;

                      if (howLong == 1) {
                        if (grid[i][j + 1]) {
                          grid[i][j + 1].reserved = true;
                          grid[i][j + 1].time = newReservation;
                        } else {
                          if (grid[i + 1]) {
                            grid[i + 1][0].reserved = true;
                            grid[i + 1][0].time = newReservation;
                          }
                        }
                      } else {
                        grid[i][j + k]
                          ? (grid[i][j + k].time = newReservation)
                          : grid[i + 1]
                          ? (grid[i + 1][anotherLine].time = newReservation)
                          : null;
                      }
                    } else {
                      grid[i][j].time = newReservation;
                    }
                  }
                  !grid[i][j + k] ? (anotherLine += 1) : (anotherLine = 0);
                }
              }
            } else {
              if (grid[i][j].time.split(",")[1].split(":")[1] == "00") {
                for (let k = 0; k < howLong; k++) {
                  let anotherLine = 0;
                  grid[i][j + k]
                    ? (grid[i][j + k].reserved = true)
                    : grid[i + 1]
                    ? (grid[i + 1][anotherLine].reserved = true)
                    : null;

                  if (k == 0 || k == howLong - 1) {
                    let newReservation = `${
                      grid[i][j].time.split(",")[0]
                    },${time}`;
                    if (k == howLong - 1 && time.split(":")[1] != "00") {
                      grid[i][j].time = newReservation;

                      const plusduration = Math.floor(howLong / 2);

                      const newTime = `${
                        Number(time.split(":")[0]) + plusduration
                      }:${
                        howLong % 2
                          ? Number(time.split(":")[1]) + 30
                          : time.split(":")[1]
                      }`;

                      newReservation = `${
                        grid[i][j].time.split(",")[0]
                      },${newTime}`;

                      if (howLong == 1) {
                        if (grid[i][j + 1]) {
                          grid[i][j + 1].reserved = true;
                          grid[i][j + 1].time = newReservation;
                        } else {
                          if (grid[i + 1]) {
                            grid[i + 1][0].reserved = true;
                            grid[i + 1][0].time = newReservation;
                          }
                        }
                      } else {
                        grid[i][j + k]
                          ? (grid[i][j + k].time = newReservation)
                          : grid[i + 1]
                          ? (grid[i + 1][anotherLine].time = newReservation)
                          : null;
                      }
                    } else {
                      grid[i][j].time = newReservation;
                    }
                  }
                  !grid[i][j + k] ? (anotherLine += 1) : (anotherLine = 0);
                }
              }
            }
          }
        }
      }
    });
    // console.log(grid);
    setTimeCalendar(grid);
    // return grid;
  };

  //   const grid = createGrid([]);

  const fetchPlayers = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get("https://strikem.site/api/matchups/", {
        headers: { Authorization: `JWT ${token}` },
      });
      //   console.log(response.data)
      //   console.log(currentUser);

      const opponents: Player[] = [{ id: -1 }];
      response.data.results.forEach((item: any) => {
        item.player_accepting.id == currentUser?.id
          ? opponents.push(item.player_inviting)
          : opponents.push(item.player_accepting);
      });
      setOpponentsList(opponents);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReservations = async () => {
    const token = Cookies.get("token");

    function date(daysToAdd: number) {
      const date = new Date();
      date.setDate(date.getDate() + daysToAdd); // Add days to the current date
      return date.toISOString().split("T")[0]; // Format as yyyy-mm-dd
    }

    try {
      const [todayResponse, tomorrowResponse, afterTomorrowResponse] =
        await Promise.all([
          axios.get(
            `https://strikem.site/api/poolhouses/7/tables/16/reserve/?date=${date(
              0
            )}`,
            {
              headers: { Authorization: `JWT ${token}` },
            }
          ),
          axios.get(
            `https://strikem.site/api/poolhouses/7/tables/16/reserve/?date=${date(
              1
            )}`,
            {
              headers: { Authorization: `JWT ${token}` },
            }
          ),
          axios.get(
            `https://strikem.site/api/poolhouses/7/tables/16/reserve/?date=${date(
              2
            )}`,
            {
              headers: { Authorization: `JWT ${token}` },
            }
          ),
        ]);

      //   console.log(todayResponse.data," todayResponse.data")
      setTodayReservation(todayResponse.data);
      createGrid(todayResponse.data);
      //   console.log(tomorrowResponse.data," tomorrowResponse.data")
      setTomorrowReservation(tomorrowResponse.data);
      //   console.log(afterTomorrowResponse.data," afterTomorrowResponse.data")
      setAfterTomorrowReservation(afterTomorrowResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const nextDay = (Number(day) + 1).toString().padStart(2, "0");

    const formattedDate = `${year}/${month}/${day}-${nextDay}`;
    setTableDate(formattedDate);
    const selectData = [];
    for (let i = 0; i < 3; i++) {
      const Day = (Number(day) + i).toString().padStart(2, "0");
      const NextDay = (Number(nextDay) + i).toString().padStart(2, "0");
      selectData.push(`${year}/${month}/${Day}-${NextDay}`);
    }
    setSelectDates(selectData);

    fetchPlayers();
    fetchReservations();
  }, []);

  //   function handleReserve(item: {
  //     reserved: boolean;
  //     reservedBy: string;
  //     time: string;
  //   }) {
  //     console.log(item);
  //     let marked = [...markedTimes];
  //     if (markedTimes.includes(item.time)) {
  //       marked = marked.filter((el: string) => el != item.time);
  //     } else {
  //       marked.push(item.time);
  //     }

  //     const one = marked.filter((el: string) => el.split(",")[0] == "1");
  //     const two = marked.filter((el: string) => el.split(",")[0] == "2");
  //     one.sort((a, b) => {
  //       const [hoursA, minutesA] = a.split(",")[1].split(":").map(Number);
  //       const [hoursB, minutesB] = b.split(",")[1].split(":").map(Number);

  //       const totalMinutesA = hoursA * 60 + minutesA;
  //       const totalMinutesB = hoursB * 60 + minutesB;

  //       return totalMinutesA - totalMinutesB;
  //     });
  //     two.sort((a, b) => {
  //       const [hoursA, minutesA] = a.split(",")[1].split(":").map(Number);
  //       const [hoursB, minutesB] = b.split(",")[1].split(":").map(Number);

  //       const totalMinutesA = hoursA * 60 + minutesA;
  //       const totalMinutesB = hoursB * 60 + minutesB;

  //       return totalMinutesA - totalMinutesB;
  //     });
  //     marked = [...one, ...two];

  //     console.log(marked);
  //     setMarkedTimes(marked);
  //   }

  const handleTimeSelect = (e: dayjs.Dayjs | null) => {
    const hour = dayjs(e?.toDate()).hour();
    let day = `${tableDate.split("/")[1]}/${hour >=0 && hour <=3 ?tableDate.split("/")[2].split("-")[1]:tableDate.split("/")[2].split("-")[0]}/${tableDate.split("/")[0]}`
    day += ` ${dayjs(e?.toDate()).format("hh:mm A")}`

    setSelectedTime(day)
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
                    className={` ${
                      opponentsList.length != i + 1 &&
                      "border-b-[1px] border-b-white"
                    }  py-[2px] px-[6px] md:py-1 md:px-[10px] flex gap-[5px] md:gap-[10px] bg-[#161D2F] opacity-100 `}
                    onClick={() => {
                      setOpenOpponents(false),
                        item.id == -1
                          ? setSelectedOpponent(null)
                          : setSelectedOpponent(item);
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
      <div className="flex flex-col lg:gap-3 md:flex-row md:p-3 w-[300px] md:w-auto ">
        <table className="table-auto border-collapse border border-gray-400 w-[300px]">
          <thead style={{ width: "100%", textAlign: "center" }}>
            <tr>
              <th colSpan={7}>
                <p className="my-[3px] text-white font-medium">{tableDate}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {timeCalendar.map((row, rowIndex) => {
              const now = new Date().toString();

              return (
                <tr key={rowIndex}>
                  {row.map((time, colIndex) => {
                    return (
                      <td
                        key={colIndex}
                        className={` ${
                          Number(now.split(" ")[4].split(":")[0]) >
                            Number(time.time.split(",")[1].split(":")[0]) &&
                          Number(time.time.split(",")[1].split(":")[0]) > 3
                            ? " opacity-25"
                            : now.split(" ")[4].split(":")[0] ==
                                time.time.split(",")[1].split(":")[0] &&
                              now.split(" ")[4].split(":")[1] >=
                                time.time.split(",")[1].split(":")[1]
                            ? " opacity-25"
                            : ""
                        } border border-gray-400 p-[2px] md:p-1 text-center w-[10px] md:w-[20px] lg:w-[80px] h-[30px] md:h-[40px] lg:h-[80px]  ${
                          time.reserved && "bg-[#fab907] "
                        } `}
                        // onClick={()=>handleReserve(time)}
                      >
                        <div className="mb-2 text-white text-[8px] md:text-[12px] lg:text-[16px] ">
                          {time.time.split(",")[1]}
                        </div>
                        {time.reserved ? (
                          <p className="text-white font-medium hover:underline text-[8px] md:text-[12px] lg:text-[16px]">
                            Reserved
                          </p>
                        ) : (
                          //   <button
                          //   onClick={()=>{handleReserve(time)}}
                          //   >
                          <p className="text-white font-medium text-[8px] md:text-[12px] lg:text-[16px]">
                            Reserve
                          </p>
                          //   </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
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
                "& .MuiClockNumber-root": {
                  color: "white",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
                "& .MuiPickersToolbar-root": {
                  paddingTop: 0,
                },
                "& .css-jdw6pu-MuiTypography-root-MuiPickersToolbarText-root.Mui-selected":{
                  color:"#fab907"
                },
                "& .MuiClock-pin":{
                  backgroundColor:"#fab907"
                },
                "& .MuiClockPointer-thumb":{
                  border:"16px solid #fab907",
                  backgroundColor:"transparent"
                },
                "& .css-pncb2q-MuiClockPointer-root":{
                  backgroundColor:"#fab907"
                },
                "& .css-1h2qg9i-MuiClockPointer-root":{
                  backgroundColor:"#fab907"
                },
                "& .css-16l5jv0-MuiButtonBase-root-MuiIconButton-root-MuiClock-pmButton":{
                  backgroundColor:"#fab907"
                },
                "& .css-16l5jv0-MuiButtonBase-root-MuiIconButton-root-MuiClock-pmButton:hover":{
                  backgroundColor:"#956f06"
                },
              }}
              ampmInClock={true}
              onChange={handleTimeSelect}
              minutesStep={5}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div
        className={` ${
          markedTimes.length ? " justify-between " : " justify-end "
        } w-[100%] flex px-0 md:px-4 mt-[10px] md:mt-0 `}
      >
        <p
          className={`${
            markedTimes.length ? "text-white" : " hidden "
          } text-[10px] md:text-[16px] `}
        >
          {markedTimes.length &&
            `Reserve time ${markedTimes[0].split(",")[1]}-${(() => {
              const [hours, minutes] = markedTimes[markedTimes.length - 1]
                .split(",")[1]
                .split(":")
                .map(Number);
              const newMinutes = (minutes + 30) % 60; // Wrap around 60 minutes
              const newHours = (hours + Math.floor((minutes + 30) / 60)) % 24; // Add overflow to hours, wrap around 24
              return `${String(newHours).padStart(2, "0")}:${String(
                newMinutes
              ).padStart(2, "0")}`;
            })()}`}
        </p>
        <button className="px-2 py-1 bg-[#fab907] rounded-[8px] md:rounded-[12px] text-white text-[10px] md:text-[16px] ">
          RESERVE
        </button>
      </div>
    </div>
  );
}

export default Reservation;
