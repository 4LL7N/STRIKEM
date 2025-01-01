import  { memo } from 'react'

interface ResultBoxProps {
    yourPointsInput:React.Ref<HTMLInputElement>,
    yourPoints:number,
    opponentsPointsInput:React.Ref<HTMLInputElement>,
    opponentsPoints:number,
    setYourPoints:(yourPoints:number)=>void,
    setOpponentsPoints:(opponentsPoints:number)=>void,
    windowWidth:number,
    openResultBox:number,
    setOpenResultBox:(openResultBox:number)=>void
}


const ResultBoxMemo = memo(({yourPointsInput,yourPoints,opponentsPointsInput,opponentsPoints,setYourPoints,setOpponentsPoints,windowWidth,openResultBox,setOpenResultBox}:ResultBoxProps) => {
    
    const handleSubmit = () => {
        setOpenResultBox(-1);
    }
    
  return (
    <div
          className={` z-[100] flex flex-col gap-[3px] py-[8px] px-[16px] rounded-[52px] absolute top-[40px] left-[50%] translate-x-[-50%] w-[80%] md:w-[60%] transition-transform duration-1000 border-1 border-[#2a3759] ${
            openResultBox
              ? 
              " translate-y-[0] "
              : 
              " translate-y-[-200%] "
          } bg-[#161d2f] `}
        >
          <div className="flex justify-between items-center">
            <p className={`flex self-center text-[#fff] ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} `}>
              enter result
            </p>
            <div className={` ${windowWidth<= 365?"gap-[5px]":"gap-[10px]"} flex  items-center`}>
              <div className={` ${windowWidth<= 365?"gap-[5px]":"gap-[10px]"} flex  items-center`} >
                <p className={` ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-[#fab907]`} >You</p>
              <input
                type="text"
                className={` rounded-[20px] px-[8px] py-[4px] w-[34px] ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-[#fff] bg-transparent outline-none border-1 border-[#fab907] `}
                ref={yourPointsInput}
                value={yourPoints}
                onChange={(e) => { if (Number(e.target.value) || e.target.value == "") if(e.target.value.length <= 2) setYourPoints(Number(e.target.value)); }}
                
              />
              </div>
              <div className="flex items-center" >
            <p className={` ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-[#fab907]`}>V</p>
            <p className={` ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-red-600 `}>S</p>
              </div>
              <div  className={` ${windowWidth<= 365?"gap-[5px]":"gap-[10px]"} flex  items-center`} >
              <input
                type="text"
                className={` rounded-[20px] px-[8px] py-[4px] w-[34px] ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-[#fff] bg-transparent outline-none border-1 border-red-600 `}
                ref={opponentsPointsInput}
                value={opponentsPoints}
                onChange={(e) => { if (Number(e.target.value) || e.target.value == "") if(e.target.value.length <= 2) setOpponentsPoints(Number(e.target.value)); }}
                
              />
              <p className={` ${windowWidth<= 365?"text-[10px]":windowWidth<= 400?"text-[12px]":"text-[14px] md:text-[16px]"} text-red-600 `} >Opponent</p>
              </div>
            </div>
            <button
                className={`${windowWidth<= 500?"hidden":""} bg-[#fab907] rounded-[20px] px-[8px] py-[4px] text-[14px] text-[#fff] hover:bg-[#FFF] hover:text-[#161D2F] `}
                onClick={ handleSubmit}
              >
                Submit
              </button>
          </div>
          
          <div
            style={{ width: `${openResultBox}%` }}
            className={`h-1 rounded-[4px] bg-[#fab907] mx-2 mt-1
               ${openResultBox == 0 ? "hidden" : ""} 
            `}
          />
         
        </div>
  )
})

export default ResultBoxMemo
