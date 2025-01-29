/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { rating, RatingBoxState } from "../../type";
// import { Rating } from "@mui/material";
import { CiStar } from "react-icons/ci";
import "../CSS/messenger.css"
import { useAppDispatch } from "../../ReduxStore/ReduxHooks";
import { setAllReviewsBox } from "../../ReduxStore/features/allReviewsBox";
const AllReviews = memo(({allReviewsBox}:{allReviewsBox:RatingBoxState}) => {


    const dispatch = useAppDispatch()

    const [ratings, setRatings] = useState<rating[]>([])
    const [nextRatings, setNextRatings] = useState<null|string>(null)
    const [filter,setFilter] = useState<number>(0)
    

    const ratingsScroll = useRef<any>()

    const fetchReviews = async () => {
        const ratingsUrl = `https://strikem.site/api/poolhouses/${allReviewsBox.id}/filter-ratings/${filter?`?filter=${filter}`:""}`              
        try{
            const response = await axios(ratingsUrl)
            setRatings(response.data.results)
            setNextRatings(response.data.next)
        }catch(err){
            console.error(err)
        }
    }

    const addReviews = async (url:string) => {
        try{
            const response = await axios(url)
            setRatings((prv)=>[...prv,...response.data.results])
        }catch(err){
            console.error(err)
        }
    }

    const chooseRating = (rating:number) => {
        if(filter === rating){
            setFilter(0)
        }else{
            setFilter(rating)
        }        
    }

    const filterButtons = useMemo(()=>{
        return (
            [1,2,3,4,5].map((index) =>{                 
                return(
                <div key={index} className={` cursor-pointer border-[1px]  rounded-[50%] w-[26px] aspect-square  text-center ${filter == index?" text-[#fab907] border-[#fab907] ":" text-white border-white "} `} onClick={()=>chooseRating(index)} >{index}</div>
            )})
        )
    },[filter])

    const newRatings = (e:Event) => {
        const element = e.target as HTMLDivElement
        if(element.scrollHeight - element.scrollTop - 2 < element.clientHeight){            
            if(nextRatings){
                addReviews(nextRatings)
            }
        }
    }

    useEffect(() => {
        fetchReviews()
        if(ratingsScroll.current){
            ratingsScroll.current.addEventListener("scroll",newRatings)
        }
        return () => {
            if(ratingsScroll.current){
                ratingsScroll.current.removeEventListener("scroll",newRatings)
            }
        }
    },[allReviewsBox,filter])

  return (
    <div
      className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90  z-[1000] transform transition-all duration-300 ${allReviewsBox.open ? "" : "hidden"}`}
    >
    <main className="flex flex-col bg-[#161D2F] p-[24px] pb-[32] rounded-[10px] md:rounded-[20px] w-[100%] md:w-[536px] h-[500px] ">
        <div className="flex justify-end  ">
                    <IoMdClose
                      style={{
                        color: "white",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        dispatch(setAllReviewsBox({ open: false, id: -1, name: "" }));
                      }}
                    />
        </div>
        <h1 className="text-white text-[18px] md:text-[24px] ">
            All the reviews of {allReviewsBox.name}
        </h1>
        <div className=" w-full flex gap-[10px] items-center mt-[12px]" >
            {filterButtons}
        </div>
        <section ref={ratingsScroll} className="w-[100%] flex flex-col gap-[10px] overflow-y-auto chatScroll mt-[12px] " >
            {ratings.map((rating,index) => {
                return (
                    <div key={index} className="flex flex-col gap-[10px] p-[10px] border-[1px] border-[#fff] rounded-[20px]">
                        <div className="flex items-center gap-[10px]">
                            <img src={rating.rater.profile_image} alt="Profile" className="w-[50px] h-[50px] rounded-[50%]" />
                            <div className="flex flex-col gap-[5px]">
                            <div className="flex items-center gap-[20px]" >
                                <h1 className="text-[#fff] text-[18px]">{rating.rater.user.username}</h1>
                                {/* <Rating name="read-only" value={rating.rate} readOnly /> */}
                                <div className="flex items-center gap-[4px]" >
                                    <CiStar
                                                            style={{
                                                              color: "white",
                                                              width: "19px",
                                                              height: "19px",
                                                            }}
                                                          />
                                                          <h2 className="text-[#fff] text-[16px] m-0">{rating.rate}</h2>
                                </div>
                                </div>
                                <p className="text-[#fff] text-[14px]">{rating.review}</p>
                                
                            </div>
                        </div>
                    </div>
                )
            })}
        </section>
    </main>
    </div>
  );
});

export default AllReviews;
