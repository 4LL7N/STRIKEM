/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/home.css";
import { MdTableRestaurant } from "react-icons/md";
import { CiStar } from "react-icons/ci";

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

function Home(props: { search: string }) {
  const navigate = useNavigate();
  const [nearby, setNearby] = useState<PoolHall[]>([]);
  const [recommended, setRecommended] = useState<PoolHall[]>([]);

  useEffect(() => {
    // window.location.reload()
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://strikem.site/api/poolhouses-filter/?lat=41.713403481245244&lng=44.782889824435316"
        // {
        //   headers: { Authorization: `JWT ${token}` },
        // }
      );

      setNearby(response.data);

      const PoolHousesResponse = await axios.get(
        "https://strikem.site/api/poolhouses/",
        {
          // headers: { Authorization: `JWT ${token}` },
        }
      );

      setRecommended(PoolHousesResponse.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSearchResults = useMemo(() => {
    if (props.search) {
      return recommended.filter((item) =>
        item.title.toLowerCase().includes(props.search.toLowerCase())
      );
    }
    return [];
  }, [recommended, props.search]);

  function PoolPage(data: any) {
    navigate(`/Pools/${data.id}`, { state: data });
  }

  return (
    <>
      {!props.search ? (
        <section className="flex flex-col w-[100%] bg-[#10141E] px-[16px] pb-[16px] md:pb-[0] md:px-[0]">
          <div className="max-w-[100%] ">
            <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] ">
              Nearby
            </h1>
            <div className="imageScroll flex gap-[15px] overflow-x-scroll flex-nowrap max-w-[100%] mb-[24px] rounded-[8px] p-0 md:mb-[39px] md:gap-[40px] lg:overflow-x-scroll">
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
                            <p className="  text-[#FFF] text-[12px] font-light opacity-75 md:text-[15px] ">
                              {item.address}
                            </p>
                            <div className="w-[3px] h-[3px] bg-[#FFF] opacity-50 rounded-[50%] " />
                            <p className="  text-[#FFF] text-[12px] font-light opacity-75 md:text-[15px] ">
                              {item.table_count}
                            </p>
                          </div>
                          <h2 className="text-[#FFF] text-[15px] font-medium md:text-[24px]">
                            {item.title}
                          </h2>
                        </div>
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
            <div
              className="
    grid gap-4
    grid-cols-[repeat(auto-fit,_minmax(164px,_1fr))]
    md:grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]
    lg:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]"
            >
              {recommended?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2  rounded-lg"
                  onClick={() => PoolPage(item)}
                >
                  {/* Image Section */}
                  <div className="relative w-full h-[110px] md:h-[140px] lg:h-[174px] rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={item.pics[0].image}
                      alt={item.title}
                    />
                  </div>

                  {/* Details Section */}
                  <div className="flex flex-col gap-1 p-2">
                    <p className="text-white text-xs font-light opacity-75 md:text-sm truncate  ">
                      {item.address}
                    </p>
                    <div className="flex items-center gap-1 text-white text-xs font-light opacity-75 md:text-sm">
                      <span className="flex gap-[4px] md:gap-[6px]">
                        <MdTableRestaurant
                          className=" w-[16px] md:w-[20px] h-[16px] md:h-[20px] "
                          style={{ color: "white" }}
                        />
                        <p>{item.table_count}</p>
                      </span>
                      <span className="w-0.5 h-0.5 bg-white bg-opacity-50 rounded-full mx-1"></span>
                      <span className="flex gap-[4px] md:gap-[6px]">
                        <CiStar
                        className=" w-[16px] md:w-[20px] h-[16px] md:h-[20px] "
                          style={{
                            color: "white",
                          }}
                        />
                        <p>{item.avg_rating.toFixed(1)}</p>
                      </span>
                    </div>
                    <h2 className="text-white text-sm font-medium md:text-lg">
                      {item.title}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col min-h-[100vh] bg-[#10141E] px-[16px] md:px-[0]">
          <div>
            <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] ">
              Found {filteredSearchResults.length} results for ‘{props.search}’
            </h1>
            <div className="flex flex-wrap gap-x-[15px] gap-y-[16px]  md:w-[718px] md:mb-[39px]  md:gap-y-[29px] md:gap-x-[24px] lg:w-[1330px] lg:gap-x-[60px] lg:gap-y-[32px]">
              {filteredSearchResults?.map((item, index) => {
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
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex flex-col items-start jus gap-[6px]">
                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]">
                          {item.address}
                        </p>
                        <div className="flex">
                          <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " />
                          <div className="flex items-center gap-[4px]">
                            <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px] ">
                              {item.table_count}
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
