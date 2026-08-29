/* eslint-disable @typescript-eslint/no-explicit-any */
import "./CSS/Pool.css";
// Bootstrap's CSS is imported from index.css (layered there - see the comment above
// `@import "bootstrap/dist/css/bootstrap.min.css" layer(bootstrap);`), same as App.tsx already
// does. This used to also import it directly here, unlayered - per the cascade-layers spec,
// unlayered rules always beat layered ones regardless of specificity, so this single leftover
// import was silently overriding every Tailwind class on this page with Bootstrap's plain
// element defaults (h1/h2 font-size, button border-radius:0, etc.) - exactly why the "same size"
// and "rounded corners" fixes above had no visible effect until this was removed. The JS bundle
// import (Bootstrap's carousel/dropdown/etc. behavior) is unaffected and stays.
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { useRef, useEffect, useState, useMemo} from "react";
import { useLocation } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import axios from "axios";
import { TbLetterW } from "react-icons/tb";
import { MdTableRestaurant } from "react-icons/md";
import { FaBuilding } from "react-icons/fa6";

import Cookies from "js-cookie";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { useWebSocketContext } from "./Websocket";
import ReservationOnTable from "./PoolMemo/ReservationOnTable";
import { useAppDispatch, useAppSelector } from "../ReduxStore/ReduxHooks";
import { setUploadRatingBox } from "../ReduxStore/features/uploadRatingBox";
import { PoolHall, rating } from "../type";
import { setAllReviewsBox } from "../ReduxStore/features/allReviewsBox";
import { API_BASE_URL } from "../config";



const Star = ({ fillPercentage }: { fillPercentage: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      // Was a fixed 2.7rem (43.2px) regardless of breakpoint, while the avgRating number next to
      // it is text-4xl md:text-5xl (36px/48px) - the two visibly didn't match, and even crossed
      // over (icon bigger on mobile, smaller on desktop). Matching the same 36px/48px sizes here
      // keeps the star icons and the number the same size at every breakpoint.
      className="w-9 h-9 md:w-12 md:h-12"
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

const StarRating = ({ rating }: { rating: number | null | undefined }) => {
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

function Pool(props:{coords:any, isGeolocationAvailable:any, isGeolocationEnabled:any}) {
  
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = props;

  const { subscribe } = useWebSocketContext();

  const location = useLocation();
  const [ratings, setRatings] = useState<rating[]>([]);

  const [whiteBoxHeight, setWhiteBoxHeight] = useState<number>(0);
  const [whiteBoxWidth, setWhiteBoxWidth] = useState<number>(0);

  // Computed as the initial value directly (same thresholds the mount effect used to set this
  // with) instead of via a setNameLength() call inside that effect - this was already mount-only
  // (nothing recomputes it on resize today), so this changes nothing about when/how the value
  // updates, only that it's known from the very first render instead of one render later. Not
  // touching ImageMap or anything about the map itself - nameLength is just a plain number passed
  // down to ReservationOnTable.
  const [nameLength,setNameLength] = useState<number>(() => {
    if (window.innerWidth > 1045) return 0;
    if (window.innerWidth > 460) return 4;
    if (window.innerWidth > 382) return 3;
    if (window.innerWidth > 336) return 2;
    return 1;
  })

  // location.state is only set when navigating in-app via navigate(url, {state}) (see Home.tsx) -
  // a direct URL load or a page refresh on /Pools/:id has no state at all, and reading .avg_rating/
  // .tables off null crashed the whole app before this component could even render once. The mount
  // effect below already re-fetches poolInfo/poolTablesData fresh from the API unconditionally, so
  // these fallbacks only need to survive that first render - they're overwritten a moment later
  // either way, even in the normal (state-present) case.
  const id =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
  const [poolInfo,setPoolInfo] = useState<PoolHall>(location.state ?? ({} as PoolHall));
  const [poolTablesData, setPoolTablesData] = useState<any[]>(location.state?.tables ?? []);
  const [imageI, setImageI] = useState<number>(0);

  // Reads off poolInfo (not location.state directly) so this stays correct after the mount
  // effect's Fetch() re-populates poolInfo from the API - on a direct navigation/refresh,
  // location.state is null forever, so deriving straight from it left this permanently undefined
  // even once the real rating had loaded.
  const avgRating = poolInfo?.avg_rating;

  const userLogIn = useAppSelector((state) => state.userLogIn);
  const uploadRatingBox = useAppSelector((state) => state.uploadRatingBox);
  const dispatch = useAppDispatch()

  let positionVertical = 1;
  let positionHorizontal = 1;

  const img = useRef<HTMLImageElement|null>(null);
  const overlayDiv = useRef<HTMLDivElement|null>(null);
  const imgContainer = useRef<HTMLDivElement|null>(null);
  const mapImage = useRef<HTMLImageElement|null>(null);
  const whiteBoxRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    // Always wire onload, not just when the image isn't loaded yet - room_image starts empty on a
    // direct navigation/refresh (no router state to seed it with), so on mount here `img.current`
    // has no src at all. An <img> with no src reports complete:true immediately (with
    // naturalWidth 0), which used to take the `if` branch below and run handleResize() once, with
    // wrong (all-zero) numbers - then never re-wire onload, so when the real room_image URL
    // arrived a moment later from the Fetch() below, nothing ever recalculated the table-map
    // layout again. Checking naturalWidth > 0 alongside complete distinguishes "actually loaded a
    // real image" from "no src yet", and keeping onload wired unconditionally means a real image
    // arriving later (on this direct-nav path) still triggers the recalculation once it loads.
    if (img?.current) {
      img.current.onload = handleResize;
      if (img.current.complete && img.current.naturalWidth > 0) {
        handleResize();
      }
    }

    window.addEventListener("resize", handleResize);

    const Fetch = async () => {
      try {
        const [ratingResponse,poolResponse,tableResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/poolhouses/${id}/ratings/`),
          axios.get(`${API_BASE_URL}/api/poolhouses/${id}/`),
          axios.get(`${API_BASE_URL}/api/poolhouses/${id}/tables/`)

        ])

        setPoolInfo(poolResponse.data)
        setPoolTablesData(tableResponse.data)
        setRatings(ratingResponse.data.results);
      } catch (err) {
        console.error(err);
      }
    };
    Fetch();

    setTimeout(() => {
      if(imgContainer?.current && img?.current && mapImage?.current){
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
    }
    }, 1000);

    window.addEventListener("resize", () => {
      if(imgContainer?.current && img?.current && mapImage?.current){
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
    }});
  }, []);

  function handleResize() {
    const sectionNumHorizontal = img?.current? img.current?.naturalWidth / 1920:1;
    const sectionNumVertical = img?.current? img.current?.naturalHeight / 1080:1;
    if (overlayDiv.current && imgContainer?.current) {
      overlayDiv.current.style.width = `${
        imgContainer.current.getBoundingClientRect().width *
        sectionNumHorizontal
      }px`;
    }

    const rect = img.current?.getBoundingClientRect();
    if (overlayDiv.current && imgContainer?.current && rect && img?.current) {
      overlayDiv.current.style.height = `${rect.height}px`;
      imgContainer.current.style.height = `${
        img.current.getBoundingClientRect().height / sectionNumVertical
      }px`;
      navigate("", true);
    }
  }

  function navigate(direction: string, resizing: boolean) {
    const sectionNumHorizontal = img?.current?img.current?.naturalWidth / 1920:1;
    const sectionNumVertical = img?.current?img.current?.naturalHeight / 1080:1;
    const stepVertical = img?.current?
      Number(
        (img.current.getBoundingClientRect().height / sectionNumVertical).toFixed(
          2
        )
      )
    :
      1;

    const stepHorizontal = img?.current? 
      Number(
        (
          img.current.getBoundingClientRect().width / sectionNumHorizontal
        ).toFixed(2)
      )
    :
      1;

    const overlayTop = overlayDiv?.current? parseInt(overlayDiv.current.style.top, 10):1;
    const overlayLeft = overlayDiv?.current? parseInt(overlayDiv.current.style.left, 10):1;

    if (resizing && overlayDiv?.current) {
      overlayDiv.current.style.top = `0px`;
      overlayDiv.current.style.left = `0px`;
      positionHorizontal = 1;
      positionVertical = 1;
    } else if(overlayDiv?.current){
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
    if(!whiteBoxRef.current) return;
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
      whiteBoxRef?.current?whiteBoxRef.current.style.left = "0px":null;
      whiteBoxRef?.current?whiteBoxRef.current.style.top = "0px":null;
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

  const TableReservationList = useMemo(() => {
    return poolTablesData?.map((item,i)=>{
      
      return(
        <ReservationOnTable
          key={i}
          item={item}
          nameLength={nameLength}
        />
      )
    })
  },[poolTablesData,nameLength])

  useEffect(() => {
    // Only ever reads the incoming message and uses setPoolTablesData's functional-updater form
    // (prev => ...), never the outer poolTablesData directly - so unlike Messenger/Matchup's WS
    // handlers, this one has nothing to go stale and can safely subscribe once with plain
    // [subscribe] deps. Doesn't touch ImageMap or anything about the map itself - this only
    // changes how the table-occupancy data arrives, not what's done with it or how it's rendered.
    const unsubscribe = subscribe((data: any) => {
      if (data.protocol === "now_busy") {
        setPoolTablesData((prev) => {
          return prev.map((item) => {
            if (item.id === data.changed_table_id) {
              return {
                ...item,
                current_session: {
                  duration:data.duration,
                  finished_reservation:false,
                  other_player_details: {
                    id:data.other_player_id,
                    profile_image:data.other_player_profile,
                    user:{
                      username:data.other_player_username
                    }
                  },
                  player_reserving:{
                    id:data.player_reserving_id,
                    profile_image:data.player_reserving_profile_picture,
                    user:{
                      username:data.player_reserving_username
                    }
                  },
                  start_time:data.start_time
                },
                free:false,
              };
            }
            return item;
          });
        });
      }else if(data.protocol === "now_free"){
        setPoolTablesData((prev) => {
          return prev.map((item) => {
            if (item.id === data.changed_table_id) {
              return {
                ...item,
                current_session: null,
                free:true,
              };
            }
            return item;
          });
        });
      }
    });
    return unsubscribe;
  }, [subscribe]);


  useEffect(() => {
    if(uploadRatingBox.id == -1){
      const fetchNewRatings = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/poolhouses/${id}/ratings/`
          );
          setRatings(response.data.results);
          dispatch(setUploadRatingBox({open:false,id:0,name:""}))
        } catch (err) {
          console.error(err);
        }
      }
      fetchNewRatings()
    }
  },[uploadRatingBox])


  return (
    <section className="flex flex-col items-center bg-[#10141E] w-[100%] min-h-screen  pb-[120px]">
      <main className="w-[100%] px-[16px] mt-[24px] lg:p-0 lg:mt-0 ">
        {/* Bootstrap's .container-fluid normally centers itself via its own margin:auto - now that
        Bootstrap is correctly layered below Tailwind (see the fix removing Pool.tsx's redundant
        unlayered Bootstrap import), Tailwind's preflight reset (margin:0 on every element, in a
        higher-priority layer) correctly wins that specific conflict too, same as everything else
        Bootstrap used to unintentionally override. Nothing was providing an explicit Tailwind
        equivalent, so this needs its own mx-auto to stay centered. */}
        <div className="container-fluid max-w-[90%] p-0 mx-auto ">
          <div className="row justify-content-center  ">
            {/* overflow-hidden so rounded-[10px] actually clips ImageMap (absolute, right-0 top-0,
            no rounded corner of its own) to match - previously the corner just sat past the
            rounded boundary uncut, square, since nothing here constrained overflow. */}
            <div className="col-lg-10 col-12 p-0 rounded-[10px] overflow-hidden relative ">
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
                        navigate("east", false); mapNavigation("east");
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
                        navigate("west", false);mapNavigation("west");
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
                        navigate("north", false);mapNavigation("north");
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
                        navigate("south", false);mapNavigation("south");
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
                    {TableReservationList}
                    <img
                      ref={img}
                      // Was poolInfo.room_image (fetched from the backend, backed by Azure Blob
                      // Storage) - per your request, no longer sourced from the database/blob at
                      // all. Same file the ImageMap thumbnail above already uses, served as a
                      // static frontend asset instead of a network round-trip.
                      src="/images/testPool.jpg"
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
          <h1 className=" text-white  text-[32px] md:text-[48px]">
            {poolInfo.title}
          </h1>
          <div className="flex items-center gap-[5px]">
            <MdTableRestaurant
              className=" w-[24px] md:w-[32px] h-[24px] md:h-[32px] "
              style={{ color: "white" }}
            />

            <h3 className=" text-white  text-[24px] md:text-[32px]">
              {poolInfo.table_count}
            </h3>
          </div>
          <div className="flex items-center gap-[5px]">
            <FaBuilding
              className=" w-[24px] md:w-[32px] h-[24px] md:h-[32px] "
              style={{ color: "white" }}
            />
            <h3 className=" text-white text-[24px] md:text-[32px]">
              {poolInfo.address}
            </h3>
          </div>
        </div>
        <div className="w-[100%] mt-[24px] lg:mt-[48px] flex flex-col gap-[14px]  ">
          <div className="relative w-full pb-[54%] rounded-[18px] overflow-hidden ">
            <img
              src={poolInfo.pics?.[imageI]?.image}
              className="absolute top-0 left-0 w-full h-full object-cover image-smooth"
              alt="billiard image"
            />
            <div
              className={` absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[48px] h-[48px] flex items-center justify-center rounded-[50%] bg-[#0000002a] ${
                imageI == (poolInfo.pics?.length ?? 0) - 1 && " hidden"
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

        <div className="flex flex-col justify-center  items-center md:items-start gap-[20px] w-[100%] mt-[24px] lg:mt-[48px]  ">
          <div className="flex gap-[20px] " > 
          <StarRating rating={avgRating} />
          <h1 className="text-white text-4xl md:text-5xl   ">{avgRating}</h1>
          </div>
          {userLogIn ?<button className="px-[10px] py-[4px] rounded-[10px] text-white text-[24px] md:text-[28px] bg-[#fab907] " onClick={()=>{dispatch(setUploadRatingBox({open:true,id:poolInfo.id,name:poolInfo.title}))}} >
            Rate
          </button>
          :null}
        </div>
        <div className="flex items-center gap-[20px]  mt-[24px] lg:mt-[48px]" >
        <h1 className=" text-white text-[32px] md:text-[48px]  ">
          Reviews
        </h1>
        {/* rounded-[10px] to match the "Edit profile" button's rounding (UserStats.tsx), instead
        of the pill-shaped rounded-[20px] this and "Rate" above used before. */}
        <button className="px-[8px] py-[2px] rounded-[10px] text-white text-[20px] bg-[#fab907] h-fit " onClick={()=>{dispatch(setAllReviewsBox({open:true,id:poolInfo.id,name:poolInfo.title}))}} >See all</button>
        </div>
        <div className=" flex flex-col md:flex-row gap-[20px] md:gap-0 justify-evenly mt-[24px] lg:mt-[48px] ">
          {ratings?.map((item: rating, i: number) => {            
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
                    <h1 className="text-white text-[14px] lg:text-[20px] font-semibold ">
                      {item.rater?.user.username}
                    </h1>
                    {/* Icons were 19px, the numbers next to them text-[16px] - visibly mismatched.
                    Both icons now match the number size exactly. */}
                    <div className="flex items-center gap-[5px]">
                      <CiStar
                        style={{
                          color: "white",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <h2 className="text-white text-[16px] m-0 ">{item.rate}</h2>
                      <TbLetterW
                        style={{
                          color: "white",
                          width: "16px",
                          height: "16px",
                          marginLeft: "10px",
                        }}
                      />
                      <h2 className="text-white  text-[16px] m-0 ">
                        {item.rater?.total_points}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className=" bg-[#ffffff80] h-[1px] border-none my-[10px] " />
                <p className="text-white">{item.review}</p>
              </div>
            );
          })}
        </div>
        <div className=" flex items-center justify-center mt-[48px] rounded-[18px] overflow-hidden ">
          {!isGeolocationAvailable ? (
            <h1 className="text-[20px] text-white ">
              Your browser does not support Geolocation
            </h1>
          ) : !isGeolocationEnabled ? (
            <h1 className="text-[20px] text-white ">
              Geolocation is not enabled
            </h1>
          ) : coords && poolInfo?.latitude != null && poolInfo?.longitude != null ? (
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
            <h1 className="text-[20px] text-white ">
              Getting the location data&hellip;{" "}
            </h1>
          )}
        </div>
      </main>
    </section>
  );
}

export default Pool;
