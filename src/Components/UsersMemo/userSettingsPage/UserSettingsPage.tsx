import { IoIosArrowForward } from "react-icons/io"
import { useAppDispatch } from "../../../ReduxStore/ReduxHooks"
import { setSettingsPage } from "../../../ReduxStore/features/userSettingsBox"

function UserSettingsPage() {

  const possibleChanges = [
    {
      name:'change username',
      image:'../../../../public/images/download.png'
    },
    {
      name:'change password',
      image:'../../../../public/images/download(1).png'
    },
    {
      name:'delete account',
      image:'../../../../public/images/download(2).png'
    }
  ]

  const dispatch = useAppDispatch()

  return (
    <section className="w-full mt-[24px]" >
      {possibleChanges.map((item:{name:string,image:string},i:number)=>{
        return(
          <div key={i} className="flex items-center justify-between border-b-[1px] border-b-white w-full py-[10px] cursor-pointer " onClick={()=>{dispatch(setSettingsPage(`${item.name}`))}} >
            <div className="flex items-center" >
            <img src={item.image} alt={item.name} className="w-16 h-16 " />
            <h2 className="text-[20px] text-white" >{item.name}</h2>
            </div>
            <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} />
          </div>
        )
      })}
    </section>
  )
}

export default UserSettingsPage
