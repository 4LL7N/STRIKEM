/* eslint-disable @typescript-eslint/no-explicit-any */
import "./CSS/Pool.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import Poolhubs from "../../PoolHub.json";

import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { CiStar } from "react-icons/ci";
import axios from "axios";
import { TbLetterW } from "react-icons/tb";
import { MdTableRestaurant } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";

// interface User {
//   name: string;
//   image: string;
// }

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
  table_count: number;
}

interface Table {
  id: number;
  current_session: any; // Use a specific type if you have more information about what this should be
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
      width="2.7rem" // Use viewport width for responsiveness
      height="2.7rem" // Use viewport width for responsiveness
      style={{ position: "relative" }}
    >
      {/* Full background star (gray) */}
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="#e4e5e9"
      />
      {/* Dynamic foreground star (gold) with clipping for partial fill */}
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="#ffd700"
        style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }} // clip based on fillPercentage
      />
    </svg>
  );
};

const StarRating = ({ rating }: { rating: number | undefined }) => {
  const maxStars = 5;

  // Split the rating into full stars and fractional part
  if (!rating) return;
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;

  // Create an array to represent each star
  const stars = Array.from({ length: maxStars }, (_, index) => {
    if (index < fullStars) {
      // Full stars
      return <Star key={index} fillPercentage={100} />;
    } else if (index === fullStars) {
      // Partial star
      return <Star key={index} fillPercentage={partialStar * 100} />;
    } else {
      // Empty stars
      return <Star key={index} fillPercentage={0} />;
    }
  });

  return (
    // <div className="flex justify-center w-[60%] mx-auto">
    <div className="flex space-x-1">{stars}</div>
    // </div>
  );
};

function Pool() {
  const location = useLocation();
  const Navigate = useNavigate();
  // const poolHub = Poolhubs.find((item) => item.id == Number(Pool))
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [whiteBoxHeight,setWhiteBoxHeight] = useState<number>(0)
  const [whiteBoxWidth,setWhiteBoxWidth] = useState<number>(0)

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
  const whiteBoxRef = useRef<any>()

  const Fetch = async () => {
    try {
      const response = await axios.get(
        `https://strikem.site/api/poolhouses/${id}/ratings/`,
        {
          headers: {
            Authorization:
              "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNTU2Njc1LCJpYXQiOjE3MzA0NzAyNzUsImp0aSI6ImU1YTdmNTMzZmMyNDQ0YTBhODc4NTgxNjczMWM2MjM0IiwidXNlcl9pZCI6MTl9.DCojpLiIrCpR5eEtsz2I0eCY-YWJz2Gp8lQhVdtq29I",
          },
        }
      );
      setRatings(response.data);
      // console.log(response.data);

      // setPoolHubData(response.data)
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



    setTimeout(()=>{
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

    setWhiteBoxHeight(whiteBoxHeight)
    setWhiteBoxWidth(whiteBoxWidth)

    

      
    },100)
    

  }, []);

  function handleResize() {
    const sectionNumHorizontal = img.current?.naturalWidth / 1920;
    const sectionNumVertical = img.current?.naturalHeight / 1080;

    overlayDiv.current.style.width = `${
      imgContainer.current.getBoundingClientRect().width * sectionNumHorizontal
    }px`;

    const rect = img.current.getBoundingClientRect();

    overlayDiv.current.style.height = `${rect.height}px`;
    imgContainer.current.style.height = `${
      img.current.getBoundingClientRect().height / sectionNumVertical
    }px`;

    navigate("", true);
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
  useEffect(()=>{
    whiteBoxRef.current.style.left
  })

  function mapNavigation(direction:string) {

    switch (direction){
      case 'east':{
        let left = whiteBoxRef.current.style.left
        if(left.includes('px')){
          left = left.slice(0, -2)
        }
        whiteBoxRef.current.style.left = `${Number(left) + whiteBoxWidth}px`;
        break
      }
      case 'west':{
        let left = whiteBoxRef.current.style.left
        if(left.includes('px')){
          left = left.slice(0, -2)
        }
        whiteBoxRef.current.style.left = `${Number(left) - whiteBoxWidth}px`;
        break
      }
      case 'south':{
        let top = whiteBoxRef.current.style.top
        if(top.includes('px')){
          top = top.slice(0, -2)
        }
        whiteBoxRef.current.style.top = `${Number(top) + whiteBoxHeight}px`;
        break
      }
      case 'north':{
        let top = whiteBoxRef.current.style.top
        if(top.includes('px')){
          top = top.slice(0, -2)
        }
        whiteBoxRef.current.style.top = `${Number(top) - whiteBoxHeight}px`;
        break
      }
    }
    
  }

  const ImageMap = () => {
    setTimeout(()=>{
    whiteBoxRef.current.style.left = '0px'
      whiteBoxRef.current.style.top = '0px'
    },1)
    return (
      <div className=" absolute right-0 top-0 w-[20%] z-1 border border-black ">
        <div className="relative w-[100%] h-[100%] ">
          <img
            ref={mapImage}
            className="max-w-[100%] max-h-[100%] "
            src="/images/test2.jpg"
            alt=""
          />

          <div
            ref={whiteBoxRef}
            style={{
              position:'absolute',
              width: `${whiteBoxWidth}px`,
              height: `${whiteBoxHeight}px`,
              transition: 'left 0.3s ease, top 0.3s ease',
            }}
            className={`bg-[#ffffff8b] `}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center bg-[#10141E] w-screen min-h-screen  pb-[120px] md:px-[25px]">
      <header className="w-[100%]  bg-[#161D2F] p-[16px] md:px-[20px] md:mx-[25px] flex items-center justify-between md:rounded-[10px] mb-[24px] md:my-[24px] lg:my-[48px] ">
        <Link
          to="/home"
          className='w-[25px] h-[25px] bg-[length:25px_25px] bg-[url("/public/images/logo1.png")] md:w-[32px] md:h-[32px] md:bg-[length:32px_32px] '
        />
        <img
          className="w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[40px] lg:h-[40px]"
          src="/images/image-avatar.png"
          onClick={() => {
            Navigate("/user");
          }}
        />
      </header>
      <main className="w-[100%] px-[10px]">
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
                      zIndex: "40",
                    }}
                    className="direction-div-vertical me-1"
                  >
                    <button
                      onClick={() => {navigate("east", false),mapNavigation("east")}}
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
                      zIndex: "40",
                    }}
                    className="direction-div-vertical ms-1"
                  >
                    <button
                      onClick={() =>{navigate("west", false),mapNavigation("west")}}
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
                      zIndex: "40",
                    }}
                    className="direction-div-horizontal  mt-1"
                  >
                    <button
                      onClick={() => 
                        {navigate("north", false),mapNavigation("north")}
                      }
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
                      zIndex: "40",
                      bottom: "0",
                    }}
                    className="direction-div-horizontal mb-1"
                  >
                    <button
                      onClick={() => {navigate("south", false),mapNavigation("south")}}
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
                      zIndex: "0",
                    }}
                    className="div-container fade-in"
                  >
                    <div className=" absolute top-[11.9%] left-[8.7%] z-40 w-[6.95%] h-[31.3%] hover:bg-[#000000a4] cursor-pointer flex justify-center items-center ">
                      <div className="flex flex-col items-center">
                        <p className="text-[#fff] text-[100%]">
                          {ratings[0]?.rater?.user?.username} vs{" "}
                          {ratings[1]?.rater?.user?.username}{" "}
                        </p>
                        <p className="text-[#fff] text-[100%]">1:30:29</p>
                      </div>
                    </div>

                    <img
                      ref={img}
                      src="/images/test2.jpg"
                      id="largeImage"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[24px] lg:mt-[48px] flex flex-col justify-center md:justify-start md:ml-[2.5%] w-[100%] ">
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
        <div className="w-[95%] mt-[24px] lg:mt-[48px] flex flex-col gap-[14px] md:ml-[2.5%] ">
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

        <div className="flex justify-center md:justify-start md:ml-[2.5%] items-center gap-[20px] w-[100%] mt-[24px] lg:mt-[48px] ">
          <StarRating rating={avgRating} />
          <h1 className="text-[#fff] text-4xl md:text-5xl   ">{avgRating}</h1>
        </div>
        <h1 className=" text-[#fff] text-[32px] md:text-[48px] md:ml-[2.5%] mt-[24px] lg:mt-[48px] ">
          Reviews
        </h1>
        <div className="w-[100%] flex flex-col md:flex-row gap-[20px] md:gap-0 justify-evenly mt-[24px] lg:mt-[48px] ">
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
      </main>
    </section>
  );
}

export default Pool;
