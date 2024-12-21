/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./CSS/Pool.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import axios from "axios";
import { TbLetterW } from "react-icons/tb";
import { MdTableRestaurant } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import Cookies from "js-cookie";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { useGeolocated } from "react-geolocated";
import { useWebSocketContext } from "./Websocket";

interface Rating {
  id: number;
  poolhouse: {
    address: string;
    id: number;
    title: string;
  };
  rate: number;
  rater: {
    profile_image: string;
    total_points: number;
    user: {
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      username: string;
    };
  };
  review: string;
}

interface PoolHall {
  id: number;
  title: string;
  address: string;
  tables: Table[];
  avg_rating: number;
  pics: Picture[];
  room_image:string
  table_count: number;
  slug: string;
  latitude: number;
  longitude: number;
  open_time:string;
  close_time:string;
}

interface Table {
  id: number;
  current_session: any;
  free:boolean;
  left:number;
  top:number;
}

interface Picture {
  id: number;
  image: string;
}

const Star = ({ fillPercentage }: { fillPercentage: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="2.7rem"
      height="2.7rem"
      style={{ position: "relative" }}
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="#e4e5e9"
      />
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="#ffd700"
        style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
      />
    </svg>
  );
};

const StarRating = ({ rating }: { rating: number | undefined }) => {
  const maxStars = 5;

  if (!rating) return;
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;

  const stars = Array.from({ length: maxStars }, (_, index) => {
    if (index < fullStars) {
      return <Star key={index} fillPercentage={100} />;
    } else if (index === fullStars) {
      return <Star key={index} fillPercentage={partialStar * 100} />;
    } else {
      return <Star key={index} fillPercentage={0} />;
    }
  });

  return <div className="flex space-x-1">{stars}</div>;
};

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Pool() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const { setReservationBox } = useWebSocketContext();

  const location = useLocation();
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [whiteBoxHeight, setWhiteBoxHeight] = useState<number>(0);
  const [whiteBoxWidth, setWhiteBoxWidth] = useState<number>(0);

  const [nameLength,setNameLength] = useState<number>(0)

  const avgRating = location.state.avg_rating;

  const id =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
  const poolInfo: PoolHall = location.state;
  const [imageI, setImageI] = useState<number>(0);



  let positionVertical = 1;
  let positionHorizontal = 1;

  const img = useRef<any>();
  const overlayDiv = useRef<any>();
  const imgContainer = useRef<any>();
  const mapImage = useRef<any>();
  const whiteBoxRef = useRef<any>();

  const Fetch = async () => {
    try {
      const response = await axios.get(
        `https://strikem.site/api/poolhouses/${id}/ratings/`
      );
      setRatings(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (img.current.complete) {
      handleResize();
    } else {
      img.current.onload = handleResize;
    }

    window.addEventListener("resize", handleResize);

    Fetch();

    setTimeout(() => {
      const heightPercent =
        (imgContainer?.current?.getBoundingClientRect().height * 100) /
        img?.current?.getBoundingClientRect().height /
        100;
      const widthPercent =
        (imgContainer?.current?.getBoundingClientRect().width * 100) /
        img?.current?.getBoundingClientRect().width /
        100;

      const whiteBoxHeight = Number(
        mapImage?.current?.getBoundingClientRect().height * heightPercent
      );
      const whiteBoxWidth = Number(
        mapImage?.current?.getBoundingClientRect().width * widthPercent
      );

      setWhiteBoxHeight(whiteBoxHeight);
      setWhiteBoxWidth(whiteBoxWidth);
    }, 1000);

    if(window.innerWidth >1045){
      setNameLength(0)
    }else if(window.innerWidth > 460){
      setNameLength(4)
    }else if(window.innerWidth > 382){
      setNameLength(3)
    }else if(window.innerWidth > 336){
      setNameLength(2)
    }else{
    setNameLength(1) 
    }

    window.addEventListener("resize", () => {
      const heightPercent =
        (imgContainer?.current?.getBoundingClientRect().height * 100) /
        img?.current?.getBoundingClientRect().height /
        100;
      const widthPercent =
        (imgContainer?.current?.getBoundingClientRect().width * 100) /
        img?.current?.getBoundingClientRect().width /
        100;

      const whiteBoxHeight = Number(
        mapImage?.current?.getBoundingClientRect().height * heightPercent
      );
      const whiteBoxWidth = Number(
        mapImage?.current?.getBoundingClientRect().width * widthPercent
      );

      setWhiteBoxHeight(whiteBoxHeight);
      setWhiteBoxWidth(whiteBoxWidth);
      // setNameSizeChange((i)=>!i)
       
      if(window.innerWidth >1045){
        setNameLength(0)
      }else if(window.innerWidth > 460){
        setNameLength(4)
      }else if(window.innerWidth > 382){
        setNameLength(3)
      }else if(window.innerWidth > 336){
        setNameLength(2)
      }else{
      setNameLength(1) 
      }
    });
  }, []);

  // useEffect(()=>{
    
  //                     if(window.innerWidth > 382){
  //                       setNameLength(3)
  //                     }else if(window.innerWidth > 460){
  //                       setNameLength(4)
  //                     }else if(window.innerWidth >1024){
  //                       setNameLength(5)
  //                     }
  // },[nameSizeChange])

  function handleResize() {
    const sectionNumHorizontal = img.current?.naturalWidth / 1920;
    const sectionNumVertical = img.current?.naturalHeight / 1080;
    if (overlayDiv.current) {
      overlayDiv.current.style.width = `${
        imgContainer.current.getBoundingClientRect().width *
        sectionNumHorizontal
      }px`;
    }

    const rect = img.current?.getBoundingClientRect();
    if (overlayDiv.current) {
      overlayDiv.current.style.height = `${rect.height}px`;
      imgContainer.current.style.height = `${
        img.current.getBoundingClientRect().height / sectionNumVertical
      }px`;
      navigate("", true);
    }
  }

  function navigate(direction: string, resizing: boolean) {
    const sectionNumHorizontal = img.current?.naturalWidth / 1920;
    const sectionNumVertical = img.current?.naturalHeight / 1080;
    const stepVertical = Number(
      (img.current.getBoundingClientRect().height / sectionNumVertical).toFixed(
        2
      )
    );
    const stepHorizontal = Number(
      (
        img.current.getBoundingClientRect().width / sectionNumHorizontal
      ).toFixed(2)
    );

    const overlayTop = parseInt(overlayDiv.current.style.top, 10);
    const overlayLeft = parseInt(overlayDiv.current.style.left, 10);

    if (resizing) {
      overlayDiv.current.style.top = `0px`;
      overlayDiv.current.style.left = `0px`;
      positionHorizontal = 1;
      positionVertical = 1;
    } else {
      let topSign, leftSign;
      let exact;

      topSign = Math.sign(overlayTop);
      topSign = topSign === 0 ? -1 : topSign;

      leftSign = Math.sign(overlayLeft);
      leftSign = leftSign === 0 ? -1 : leftSign;

      switch (direction) {
        case "north":
          positionVertical -= 1;
          exact = stepVertical * (positionVertical - 1) * topSign;
          overlayDiv.current.style.top = `${exact}px`;
          break;

        case "south":
          positionVertical += 1;
          exact = stepVertical * (positionVertical - 1) * topSign;
          overlayDiv.current.style.top = `${exact}px`;
          break;

        case "west":
          positionHorizontal -= 1;
          exact = stepHorizontal * (positionHorizontal - 1) * leftSign;
          overlayDiv.current.style.left = `${exact}px`;
          break;

        case "east":
          positionHorizontal += 1;
          exact = stepHorizontal * (positionHorizontal - 1) * leftSign;
          overlayDiv.current.style.left = `${exact}px`;
          break;
      }
    }
    checkNextDirection(sectionNumHorizontal, sectionNumVertical);
  }

  function checkDirection(
    buttonId: string,
    position: number,
    maxSections: number
  ) {
    if (position === 0 || position === maxSections + 1) {
      disableButton(buttonId);
    } else {
      enableButton(buttonId);
    }
  }

  function checkNextDirection(
    sectionNumHorizontal: number,
    sectionNumVertical: number
  ) {
    checkDirection("east", positionHorizontal + 1, sectionNumHorizontal);
    checkDirection("west", positionHorizontal - 1, sectionNumHorizontal);
    checkDirection("south", positionVertical + 1, sectionNumVertical);
    checkDirection("north", positionVertical - 1, sectionNumVertical);
  }

  function disableButton(direction: string) {
    const button: any = document.getElementById(direction);
    button.disabled = true;
  }

  function enableButton(direction: string) {
    const button: any = document.getElementById(direction);
    button.disabled = false;
  }

  function handlePicture(direction: string) {
    switch (direction) {
      case "left":
        setImageI((i) => i - 1);
        break;
      case "right":
        setImageI((i) => i + 1);
        break;
    }
  }

  function mapNavigation(direction: string) {
    switch (direction) {
      case "east": {
        let left = whiteBoxRef.current.style.left;
        if (left.includes("px")) {
          left = left.slice(0, -2);
        }
        whiteBoxRef.current.style.left = `${Number(left) + whiteBoxWidth}px`;
        break;
      }
      case "west": {
        let left = whiteBoxRef.current.style.left;
        if (left.includes("px")) {
          left = left.slice(0, -2);
        }
        whiteBoxRef.current.style.left = `${Number(left) - whiteBoxWidth}px`;
        break;
      }
      case "south": {
        let top = whiteBoxRef.current.style.top;
        if (top.includes("px")) {
          top = top.slice(0, -2);
        }
        whiteBoxRef.current.style.top = `${Number(top) + whiteBoxHeight}px`;
        break;
      }
      case "north": {
        let top = whiteBoxRef.current.style.top;
        if (top.includes("px")) {
          top = top.slice(0, -2);
        }
        whiteBoxRef.current.style.top = `${Number(top) - whiteBoxHeight}px`;
        break;
      }
    }
  }

  const ImageMap = () => {
    setTimeout(() => {
      whiteBoxRef.current.style.left = "0px";
      whiteBoxRef.current.style.top = "0px";
    }, 10);
    return (
      <div className=" absolute right-0 top-0 w-[20%] z-[49] border border-black ">
        <div className="relative w-[100%] h-[100%] ">
          <img
            ref={mapImage}
            className="max-w-[100%] max-h-[100%] "
            src="/images/testPool.jpg"
            alt=""
          />

          <div
            ref={whiteBoxRef}
            style={{
              position: "absolute",
              width: `${whiteBoxWidth}px`,
              height: `${whiteBoxHeight}px`,
              transition: "left 0.3s ease, top 0.3s ease",
            }}
            className={`bg-[#ffffff8b] `}
          />
        </div>
      </div>
    );
  };


  return (
    <section className="flex flex-col items-center bg-[#10141E] w-[100%] min-h-screen  pb-[120px]">
      <main className="w-[100%] px-[16px] mt-[24px] lg:p-0 lg:mt-0 ">
        <div className="container-fluid max-w-[90%] p-0  ">
          <div className="row justify-content-center  ">
            <div className="col-lg-10 col-12 p-0 rounded-[10px] relative ">
              <ImageMap />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  ref={imgContainer}
                  id="imageContainer"
                  style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                  }}
                  className="rounded-[10px]"
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "50%",
                      zIndex: "49",
                    }}
                    className="direction-div-vertical me-1"
                  >
                    <button
                      onClick={() => {
                        navigate("east", false), mapNavigation("east");
                      }}
                      id="east"
                      className="hover:opacity-30 transition-opacity duration-300 "
                      style={{ padding: "5px", borderRadius: "5px" }}
                    >
                      <img src="/images/east.png" className="img-fluid" />
                    </button>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      zIndex: "49",
                    }}
                    className="direction-div-vertical ms-1"
                  >
                    <button
                      onClick={() => {
                        navigate("west", false), mapNavigation("west");
                      }}
                      id="west"
                      className="hover:opacity-30 transition-opacity duration-300 "
                      style={{ padding: "5px", borderRadius: "5px" }}
                    >
                      <img src="/images/west.png" className="img-fluid" />
                    </button>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      zIndex: "49",
                    }}
                    className="direction-div-horizontal  mt-1"
                  >
                    <button
                      onClick={() => {
                        navigate("north", false), mapNavigation("north");
                      }}
                      id="north"
                      className="hover:opacity-30 transition-opacity duration-300 "
                      style={{ padding: "5px", borderRadius: "5px" }}
                    >
                      <img src="/images/north.png" className="img-fluid" />
                    </button>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      zIndex: "49",
                      bottom: "0",
                    }}
                    className="direction-div-horizontal mb-1"
                  >
                    <button
                      onClick={() => {
                        navigate("south", false), mapNavigation("south");
                      }}
                      id="south"
                      className="hover:opacity-30 transition-opacity duration-300 "
                      style={{ padding: "5px", borderRadius: "5px" }}
                    >
                      <img src="/images/south.png" className="img-fluid" />
                    </button>
                  </div>
                  <div
                    ref={overlayDiv}
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      zIndex: "48",
                      pointerEvents: "auto",
                    }}
                    className="div-container fade-in"
                  >
                    {poolInfo.tables.map((item,i)=>{
                      
                      return(
                        <div key={i} style={{position:"absolute",top:`${item.top}%`,left:`${item.left}%`}} className=" flex-col z-50 w-[6%] h-[14%] p-2 bg-white rounded-md md:rounded-xl cursor-pointer flex justify-center items-center ">
                        <p className="text-[#fab907] text-[8px] sm:text-[12px] lg:text-[14px]">
                          
                          {nameLength?ratings[0]?.rater?.user?.username.slice(0,nameLength):ratings[0]?.rater?.user?.username}{nameLength?".. ":" "}vs{" "}
                          {nameLength?ratings[1]?.rater?.user?.username.slice(0,nameLength):ratings[0]?.rater?.user?.username}{nameLength?".. ":" "}
                        </p>
                        <p className="text-[#fab907] text-[8px] sm:text-[12px] ">1:30:29</p>
                        <button
                          className="w-[100%] flex justify-center  bg-[#fab907] text-white text-[8px] sm:text-[12px] py-[2px] md:py-1 rounded-[5px] md:rounded-[10px] mt-1  pointer-events-auto"
                          onClick={() => {
                            localStorage.setItem("tableId",item.id.toString())
                            // setTimeout(() => {
                              setReservationBox(true);
                            // },100)
                          }}
                        >
                          RESERVE
                        </button>
                    </div>  
                      )
                    })
                    }
                    <img
                      ref={img}
                      src={poolInfo.room_image}
                      id="largeImage"
                      className="img-fluid z-10 "
                    />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[24px] lg:mt-[48px] flex flex-col justify-center md:justify-start  w-[100%] ">
          <h1 className=" text-[#fff]  text-[32px] md:text-[48px]">
            {poolInfo.title}
          </h1>
          <div className="flex items-center gap-[5px]">
            <MdTableRestaurant
              className=" w-[24px] md:w-[32px] h-[24px] md:h-[32px] "
              style={{ color: "white" }}
            />

            <h3 className=" text-[#fff]  text-[24px] md:text-[32px]">
              {poolInfo.table_count}
            </h3>
          </div>
          <div className="flex items-center gap-[5px]">
            <FaBuilding
              className=" w-[24px] md:w-[32px] h-[24px] md:h-[32px] "
              style={{ color: "white" }}
            />
            <h3 className=" text-[#fff] text-[24px] md:text-[32px]">
              {poolInfo.address}
            </h3>
          </div>
        </div>
        <div className="w-[100%] mt-[24px] lg:mt-[48px] flex flex-col gap-[14px]  ">
          <div className="relative w-full pb-[54%] rounded-[18px] overflow-hidden ">
            <img
              src={poolInfo.pics[imageI].image}
              className="absolute top-0 left-0 w-full h-full object-cover image-smooth"
              alt="billiard image"
            />
            <div
              className={` absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[48px] h-[48px] flex items-center justify-center rounded-[50%] bg-[#0000002a] ${
                imageI == poolInfo.pics.length - 1 && " hidden"
              } `}
              onClick={() => {
                handlePicture("right");
              }}
            >
              <img src="/media/right.svg" className=" w-2/3 h-2/3 " alt="" />
            </div>
            <div
              className={` absolute  top-1/2 left-[10px]  transform -translate-y-1/2 w-[48px] h-[48px] flex items-center justify-center rounded-[50%] bg-[#0000002a] ${
                imageI == 0 && " hidden"
              } `}
              onClick={() => {
                handlePicture("left");
              }}
            >
              <img src="/media/left.svg" className=" w-2/3 h-2/3  " alt="" />
            </div>
          </div>
          <div className="max-w-[100%]  flex gap-[14px] overflow-x-auto flex-nowrap pb-[14px] imageScroll ">
            {poolInfo.pics?.map((item, i: number) => {
              return (
                <div
                  key={i}
                  className="min-w-[144px] max-w-[144.1px] h-[77px] relative overflow-hidden rounded-[18px]  "
                  onClick={() => {
                    setImageI(i);
                  }}
                >
                  <div
                    className={`w-[100%] h-[100%] bg-[#0000006c] absolute top-0 left-0 ${
                      imageI !== i && "hidden"
                    }`}
                  />
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center md:justify-start  items-center gap-[20px] w-[100%] mt-[24px] lg:mt-[48px] ">
          <StarRating rating={avgRating} />
          <h1 className="text-[#fff] text-4xl md:text-5xl   ">{avgRating}</h1>
        </div>
        <h1 className=" text-[#fff] text-[32px] md:text-[48px]  mt-[24px] lg:mt-[48px] ">
          Reviews
        </h1>
        <div className=" flex flex-col md:flex-row gap-[20px] md:gap-0 justify-evenly mt-[24px] lg:mt-[48px] ">
          {ratings?.map((item: Rating, i: number) => {
            return (
              <div
                key={i}
                className="flex-col gap-5 bg-[#161D2F] p-[20px] w-[100%] md:w-[30%] rounded-[24px] border !border-[#ffffff80] "
              >
                <div className="flex items-center gap-[10px]">
                  <img
                    className=" rounded-[50%] w-[60px] h-[60px]"
                    src={item.rater?.profile_image}
                    alt=""
                  />
                  <div className="flex flex-col self-stretch justify-around ]">
                    <h1 className="text-[#fff] text-[14px] lg:text-[20px] font-semibold ">
                      {item.rater?.user.username}
                    </h1>
                    <div className="flex gap-[5px]">
                      <CiStar
                        style={{
                          color: "white",
                          width: "19px",
                          height: "19px",
                        }}
                      />
                      <h2 className="text-[#fff]">{item.rate}</h2>
                      <TbLetterW
                        style={{
                          color: "white",
                          width: "19px",
                          height: "19px",
                          marginLeft: "10px",
                        }}
                      />
                      <h2 className="text-[#fff]">
                        {item.rater?.total_points}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className=" bg-[#ffffff80] h-[1px] border-none my-[10px] " />
                <p className="text-[#fff]">{item.review}</p>
              </div>
            );
          })}
        </div>
        <div className=" flex items-center justify-center mt-[48px] rounded-[18px] overflow-hidden ">
          {!isGeolocationAvailable ? (
            <h1 className="text-[20px] text-[#fff] ">
              Your browser does not support Geolocation
            </h1>
          ) : !isGeolocationEnabled ? (
            <h1 className="text-[20px] text-[#fff] ">
              Geolocation is not enabled
            </h1>
          ) : coords ? (
            <div className="w-[100%]">
              <MapContainer
                center={[poolInfo?.latitude, poolInfo?.longitude]}
                zoom={15}
                minZoom={13}
                maxZoom={18}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[poolInfo?.latitude, poolInfo?.longitude]}
                  icon={markerIcon}
                >
                  <Tooltip direction="top" offset={[0, -20]} permanent>
                    {poolInfo.title}
                  </Tooltip>
                </Marker>
                {Cookies.get("token") && Cookies.get("token") != "logout" ? (
                  <Marker
                    position={[coords.latitude, coords.longitude]}
                    icon={markerIcon}
                  >
                    <Tooltip direction="top" offset={[0, -20]} permanent>
                      You
                    </Tooltip>
                  </Marker>
                ) : null}
              </MapContainer>
            </div>
          ) : (
            <h1 className="text-[20px] text-[#fff] ">
              Getting the location data&hellip;{" "}
            </h1>
          )}
        </div>
      </main>
    </section>
  );
}

export default Pool;
