import { IoIosArrowForward } from "react-icons/io"
import { useAppDispatch, useAppSelector } from "../../../../ReduxStore/ReduxHooks"
import { setSettingsPage } from "../../../../ReduxStore/features/userSettingsBox"

function UserSettingsPage() {

  const possibleChanges = [
    {
      name:'change user',
      image:'/images/download.png'
    },
    {
      name:'change password',
      image:'/images/download(1).png'
    },
    {
      name:'forget password',
      image:'/images/download(1).png'
    },
    {
      name:'delete account',
      image:'/images/download(2).png'
    }
  ]

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.currentUser);
  return (
    <section className="w-full mt-[24px] z-50" >
      {!currentUser.password_is_null?possibleChanges.map((item:{name:string,image:string},i:number)=>{
        return(
          <div key={i} className="flex items-center justify-between border-b-[1px] border-b-white w-full py-[10px] cursor-pointer " onClick={()=>{dispatch(setSettingsPage(`${item.name}`))}} >
            <div className="flex items-center" >
            <img src={item.image} alt={item.name} className="w-16 h-16 " />
            <h2 className="text-[20px] text-white" >{item.name}</h2>
            </div>
            <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} />
          </div>
        )
        })
        :
        <div key={1} className="flex items-center justify-between border-b-[1px] border-b-white w-full py-[10px] cursor-pointer " onClick={()=>{dispatch(setSettingsPage(`forget password`))}} >
            <div className="flex items-center" >
            <img src={"/images/download(1).png"} alt={"forget password"} className="w-16 h-16 " />
            <h2 className="text-[20px] text-white" >set password</h2>
            </div>
            <IoIosArrowForward style={{color:"white",width:"24px",height:"24px"}} />
          </div>
      }
    </section>
  )
}

export default UserSettingsPage
