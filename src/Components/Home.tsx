/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
// import styled from "styled-components";
import './CSS/home.css'


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

interface ImageObject {
  id: number;
  image: string;
}

function Home(props: {
  
  search: string;
}) {
  const navigate = useNavigate();

  const [nearby, setNearby] = useState<PoolHall[]>([]);
    const [recommended,setRecommended] = useState<PoolHall[]>([])

  const Fetch = async () => {
    const token = Cookies.get('token')
    console.log(token)
    try {
      const response = await axios.get(
        "https://strikem.site/api/poolhouses-filter/?lat=41.713403481245244&lng=44.782889824435316",
        {
          headers: {
            Authorization:
              `JWT ${token}`,
          },
        }
      );
      const data = response.data;
      const newData: any = [];
      data?.forEach((item: PoolHall) => {
        const pool = item;
        const imageData: any = [];
        pool.pics.forEach((element) => {
          let image = {};
          image = {
            id: element.id,
            image: `/${element.image.split("/").splice(3).join("/")}`,
          };
          imageData.push(image);
        });
        pool.pics = [...imageData];
        newData.push(pool);
      });
      setNearby(newData);

      const PoolHousesResponse = await axios.get("https://strikem.site/api/poolhouses/",{
        headers:{
          'Authorization':`JWT ${token}`
        }
      });
    // console.log(PoolHousesResponse);
    
    const Recommended = [... PoolHousesResponse.data];
   
    const PoolHousesNewData: any = [];
    Recommended?.forEach((item) => {
      const pool = item;
      const imageData: any = [];
      pool.pics.forEach((element:ImageObject) => {
        let image = {};
        image = {
          id: element.id,
          image: `/${element.image.split("/").splice(3).join("/")}`,
        };
        imageData.push(image);
      });
      pool.pics = [...imageData];
      PoolHousesNewData.push(pool);
    });
    // console.log(PoolHousesNewData)
    setRecommended(PoolHousesNewData);


    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token')
    console.log(token)
    Fetch();
  }, []);

  
  let SearchArr: PoolHall[] = [];

  function search() {
    
    if(props.search){
        SearchArr = recommended?.filter((item)=> item.title.toLowerCase().includes(props.search.toLowerCase()))
    }
    
  }

  useEffect(() => {
    search();
  }, [props.search]);

  search();
  function PoolPage(data: any) {
    navigate(`/Pools/${data.id}`, { state: data });
  }

  return (
    <>
      {!props.search ? (
        <section className="flex flex-col w-[100%] bg-[#10141E] px-[16px] md:px-[0]">
          <div className="max-w-[100%]" >
            <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] ">
              Nearby
            </h1>
            <div className="imageScroll flex gap-[15px] overflow-x-scroll flex-nowrap max-w-[91%] mb-[24px] rounded-[8px] p-0 md:mb-[39px] md:gap-[40px] lg:overflow-x-scroll" >
              {nearby?.map((item: PoolHall, index: number) => {

                return (
                  <div
                    key={index}
                    className=" relative overflow-hidden rounded-[8px] min-w-[240px] h-[140px] md:min-w-[470px] md:h-[230px] md:  "
                    onClick={() => {
                        PoolPage(item);
                      }}
                  >
                    <img
                      className=" w-[470px] h-[230px] rounded-[8px]  "
                      key={index}
                      src={`${item.pics[0].image}`}
                    />
                    <div className="flex flex-col justify-between absolute top-0 w-[100%] h-[100%] p-[8px] md:px-[24px] md:pb-[24px] md:pt-[16px] ">
                      <div className="flex items-center justify-between p-[8px]">
                        <div className="flex flex-col gap-[4px]">
                          <div className="flex items-center gap-[6px]  ">
                            <p className="  text-[#FFF] text-[12px] font-light opacity-75 md:text-[15px] " >{item.address}</p>
                            <div className="w-[3px] h-[3px] bg-[#FFF] opacity-50 rounded-[50%] " />
                            {/* <img className="w-[12px] h-[12px]  opacity-75"  src={categrory(item.category)} /> */}
                            <p className="  text-[#FFF] text-[12px] font-light opacity-75 md:text-[15px] " >{item.table_count}</p>
                          </div>
                          <h2 className="text-[#FFF] text-[15px] font-medium md:text-[24px]">
                            {item.title}
                          </h2>
                        </div>
                        {/* <div className="w-[34px] h-[21px] rounded-[10.5px] bg-[#FFF] bg-opacity-20 text-[13px] text-[#FFF] font-light text-center md:w-[45px] md:h-[27px] md:text-[18px]" >{item.rating}</div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] lg:mb-[32px]">
              Recommended for you
            </h1>
            <div className="flex flex-wrap gap-x-[15px] gap-y-[16px] md:gap-y-[29.5px] md:gap-x-[24px] lg:gap-x-[60px] lg:gap-y-[32px]">
              {recommended?.map((item, index) => {
                // console.log(item)
                return (
                  <div
                    key={index}
                    className="flex flex-col w-[164px] md:w-[220px] gap-[8px] lg:w-[280px]"
                    onClick={() => {
                      PoolPage(item);
                    }}
                  >
                    <div className="relative w-[164px] h-[110px] rounded-[8px] md:w-[220px] md:h-[140px] lg:w-[280px] lg:h-[174px]">
                      <img
                        className="w-[100%] h-[100%] rounded-[8px]"
                        src={`${item.pics[0].image}`}
                      />
                      {/* <div className="absolute top-[8px] flex justify-center items-center w-[32px] h-[32px] rounded-[50%] bg-[black] bg-opacity-40 ml-[124px] md:top-[16px] md:ml-[172px] lg:ml-[232px]" onClick={() => {item.isBookmarked = !item.isBookmarked , setRecommendedBookMark(!RecommendedBookMark)}} ><img src={item.isBookmarked?"/images/icon-category-bookmark.svg":"/images/icon-bookmark-empty.svg"} /></div> */}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex flex-col items-start jus gap-[6px]">
                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]">
                          {item.address}
                        </p>
                        <div className="flex">
                          <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " />
                          <div className="flex items-center gap-[4px]">
                            {/* <img className="w-[10px] h-[10px] " src={categrory(item.category)} /> */}
                            <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px] ">
                              {item.tables.length}
                            </p>
                          </div>
                          <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 "></div>
                          <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]">
                            {item.avg_rating}
                          </p>
                        </div>
                      </div>
                      <h2 className="text-[#FFF] text-[14px] font-medium md:text-[18px]">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col min-h-[100vh] bg-[#10141E] px-[16px] md:px-[0]">
          <div>
            <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] ">
              Found {SearchArr?.length} results for ‘{props.search}’
            </h1>
            <div className="flex flex-wrap gap-x-[15px] gap-y-[16px]  md:w-[718px] md:mb-[39px]  md:gap-y-[29px] md:gap-x-[24px] lg:w-[1330px] lg:gap-x-[60px] lg:gap-y-[32px]">
              {SearchArr?.map((item, index) => {
                // console.log(item);
                return (
                    <div
                    key={index}
                    className="flex flex-col w-[164px] md:w-[220px] gap-[8px] lg:w-[280px]"
                    onClick={() => {
                      PoolPage(item);
                    }}
                  >
                    <div className="relative w-[164px] h-[110px] rounded-[8px] md:w-[220px] md:h-[140px] lg:w-[280px] lg:h-[174px]">
                      <img
                        className="w-[100%] h-[100%] rounded-[8px]"
                        src={`${item.pics[0].image}`}
                      />
                      {/* <div className="absolute top-[8px] flex justify-center items-center w-[32px] h-[32px] rounded-[50%] bg-[black] bg-opacity-40 ml-[124px] md:top-[16px] md:ml-[172px] lg:ml-[232px]" onClick={() => {item.isBookmarked = !item.isBookmarked , setRecommendedBookMark(!RecommendedBookMark)}} ><img src={item.isBookmarked?"/images/icon-category-bookmark.svg":"/images/icon-bookmark-empty.svg"} /></div> */}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex flex-col items-start jus gap-[6px]">
                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]">
                          {item.address}
                        </p>
                        <div className="flex">
                          <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " />
                          <div className="flex items-center gap-[4px]">
                            {/* <img className="w-[10px] h-[10px] " src={categrory(item.category)} /> */}
                            <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px] ">
                              {item.tables.length}
                            </p>
                          </div>
                          <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 "></div>
                          <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]">
                            {item.avg_rating}
                          </p>
                        </div>
                      </div>
                      <h2 className="text-[#FFF] text-[14px] font-medium md:text-[18px]">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Home;

// const TrendingBox = styled.div`
//   display: flex;
//   gap: 15px;
//   overflow: scroll;
//   flex-wrap: nowrap;
//   max-width: 100%;
//   margin-bottom: 24px;
//   border-radius: 8px;
//     padding: 0px;

//   @media (min-width: 768px) {
//     /* width: 718px; */
//     margin-bottom: 39px;
//     gap: 40px;
//   }

//   @media (min-width: 1024px) {
//     /* width: 1305px; */
//     overflow-x: scroll;

//     &::-webkit-scrollbar {
//       appearance: none;
//       height: 5px;
//       width: 300px;
//     }

//     &::-webkit-scrollbar-thumb {
//       height: 3px;
//       border-radius: 5px;
//       background-color: gray;
//     }
//   }
// `;
