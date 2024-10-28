import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


interface filmdata{

    title:string
    thumbnail:{
        trending?:{
            small: string,
            large: string
        },
        regular: {
            small: string,
            medium: string,
            large: string
          }
    },
    year: number,
    category: string,
    rating: string,
    isBookmarked: boolean,
    isTrending: boolean
}

function categrory(icon:string){
    if(icon == "Movie"){
        return "/images/icon-category-movie.svg"
    }else if(icon == "TV Series"){
        return "/images/icon-category-tv.svg"
    }
}


function Page(props:{Filmdata:filmdata[],search:undefined|string}){

    const [rezolution,serRezolution] = useState(window.innerWidth)
    useEffect(() => {
        function handleResize(){
            serRezolution(window.innerWidth)
            console.log("rezolution "+rezolution)
        }
        window.addEventListener('resize', handleResize);
        

        return () => {
          window.removeEventListener('resize', handleResize);
        };

    },[])


    const params = useParams()
    const Params = params.page
    let newParams = ""
    useEffect(() => {
        newParams = ""
    },[params])

    if(Params == "series" ){
        newParams = "TV Series" 
    }else if(Params == "bookmarked" ){
        newParams = "Bookmarked"
    }else{
        newParams = "Movie"
    }

    console.log(newParams);

    const [SpecificBookMark,setSpecificBookMark] = useState(true)

    let SpecificFilms:filmdata[]|never[] = []
        // console.log(item);
        // console.log("category "+ item.category);
        // console.log("isBookmarked" + item.isBookmarked);
        
        if(newParams == "Bookmarked"){

            SpecificFilms = props.Filmdata.filter((item) => item.isBookmarked == true)
        }else{
            SpecificFilms = props.Filmdata.filter((item) => item.category == newParams)
            
        } 
    
    // console.log(props.Filmdata)
    console.log(SpecificFilms)


    const SearchArr:undefined|filmdata[] = []

    function search(){
        let find = false
        SpecificFilms.forEach((item) => 
            {
                for(let i = 0 ;i < item.title.length ; i ++  ){
                    if(item.title.slice(0 + i, props.search?.length? props.search.length + i:0) == props.search){
                        find = true
                    }
                    // console.log("for " +item.title.slice(0 + i, props.search?.length? props.search.length + i:0));
                    
                }
                if(find){
                    console.log(item)
                    SearchArr?.push(item)
                    
                    
                }
                find = false
            }
        )
    
    }

    useEffect(() => {
        
        search()
        console.log("search "+ SearchArr);
    },[props.search])
    
    search()
    console.log("search log"+SearchArr);    


    return(
        <>

        {!props.search?
        <section className="flex flex-col bg-[#10141E] px-[16px] lg:w-[1400px] ">
            <div>
                <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px] lg:mb-[32px] " >{newParams}</h1>
                <div className="flex flex-wrap gap-x-[15px] gap-y-[16px] md:w-[718px] md:mb-[39px] md:gap-y-[29px] md:gap-x-[24px] lg:w-[1330px] lg:gap-x-[60px] lg:gap-y-[32px]" >
                    {SpecificFilms.map((item,index) => {
                    
                        return(
                            <div key={index} className="flex flex-col  gap-[8px] lg:w-[280px]">
                                <div className="relative w-[164px] h-[110p] rounded-[8px] md:w-[220px] md:h-[140px] lg:w-[280px] lg:h-[174px]" >
                                    <img className="w-[100%] h-[100%] rounded-[8px]" src={rezolution < 767? item.thumbnail.regular.small:rezolution < 1023? item.thumbnail.regular.medium : item.thumbnail.regular.large} />
                                    <div className="absolute top-[8px] flex justify-center items-center w-[32px] h-[32px] rounded-[50%] bg-[black] bg-opacity-40 ml-[124px] md:top-[16px] md:ml-[172px] lg:ml-[232px]" onClick={() => {item.isBookmarked = !item.isBookmarked , setSpecificBookMark(!SpecificBookMark)}} ><img src={item.isBookmarked?"/images/icon-category-bookmark.svg":"/images/icon-bookmark-empty.svg"} /></div>
                                </div>
                            <div className="flex flex-col gap-[4px]" >
                                <div className="flex items-center gap-[6px]" >
                                    <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.year}</p>
                                    <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " />
                                    <div className="flex items-center gap-[4px]" >
                                        <img className="w-[10px] h-[10px] " src={categrory(item.category)} />
                                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.category}</p>
                                    </div>
                                    <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " ></div>
                                    <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.rating}</p>
                                </div>
                                <h2 className="text-[#FFF] text-[14px] font-medium md:text-[18px]" >{item.title}</h2>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </section>
        :
            <section className="flex flex-col min-h-[100vh] bg-[#10141E] px-[16px] ">
            <div>
                <h1 className="text-[#FFF] text-[20px] font-light tracking-[-0.312px] mb-[16px] md:text-[32px] md:mb-[25px] md:tracking-[-0.5px]" >Found {SearchArr.length} results for ‘{props.search}’</h1>
                <div className="flex flex-wrap gap-x-[15px] gap-y-[16px] md:w-[718px] md:mb-[39px] md:gap-y-[29px] md:gap-x-[24px] lg:w-[1300px] lg:gap-x-[60px] lg:gap-y-[32px]" >
                    {SearchArr.map((item,index) => {
                        console.log(item + " " + index)
                        return(
                            <div key={index} className="flex flex-col  gap-[8px] lg:w-[280px]">
                                <div className="relative w-[164px] h-[110p] rounded-[8px] md:w-[220px] md:h-[140px] lg:w-[280px] lg:h-[174px]" >
                                    <img className="w-[100%] h-[100%] rounded-[8px]" src={rezolution < 767? item.thumbnail.regular.small:rezolution < 1023? item.thumbnail.regular.medium : item.thumbnail.regular.large} />
                                    <div className="absolute top-[8px] flex justify-center items-center w-[32px] h-[32px] rounded-[50%] bg-[black] bg-opacity-40 ml-[124px] md:top-[16px] md:ml-[172px] lg:ml-[232px]" onClick={() => {item.isBookmarked = !item.isBookmarked , setSpecificBookMark(!SpecificBookMark)}} ><img src={item.isBookmarked?"/images/icon-category-bookmark.svg":"/images/icon-bookmark-empty.svg"} /></div>
                                </div>
                                <div className="flex flex-col gap-[4px]" >
                                    <div className="flex items-center gap-[6px]" >
                                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.year}</p>
                                        <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " />
                                        <div className="flex items-center gap-[4px]" >
                                            <img className="w-[10px] h-[10px] " src={categrory(item.category)} />
                                            <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.category}</p>
                                        </div>
                                        <div className="w-[2px] h-[2px] bg-[#FFF] bg-opacity-50 " ></div>
                                        <p className="  text-[#FFF] text-[11px] font-light opacity-75 md:text-[13px]" >{item.rating}</p>
                                    </div>
                                    <h2 className="text-[#FFF] text-[14px] font-medium md:text-[18px]" >{item.title}</h2>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
        }
        </>
    )
}

export default Page