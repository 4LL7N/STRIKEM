/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import './CSS/messenger.css'

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username:string;
  }

interface Profile {
    games_played: number;
    games_won: number;
    id: number;
    inviting_to_play: boolean;
    opponents_met: number;
    profile_image: string;
    total_points: number;
    user:User
  }

function Messenger() {

    const [messages,setMessages] = useState<Profile[]>() 
    const messengerRef = useRef<any>()

    const Fetch = async () =>{
        try{
        const response = await axios('https://strikem.site/api/players/')
            setMessages(response.data)
    }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        Fetch()
        console.log(messengerRef.current?.getBoundingClientRect().top)
        console.log(window.innerHeight-messengerRef.current?.getBoundingClientRect().top)
        setTimeout(()=>{
            messengerRef.current.style.height = `${window.innerHeight-messengerRef.current?.getBoundingClientRect().top-32}px`
        },500)
    },[])

    return (
    <section  ref={messengerRef} className='flex-grow flex    border-[1px] border-[#243257d5]  rounded-[20px] overflow-hidden ' >
    <div className=' w-[35%] border-r border-r-[#243257d5]  h-[100%] overflow-y-auto chatScroll ' >
        {messages?.map((item:Profile,i:number)=>{
            console.log(i == messages.length-1 )
            return(
                <div key={i} className={`flex h-[20%] p-[20px] gap-[20px] hover:bg-[#161d2f8e] `} >
                    <img src={item.profile_image} className=' h-[100%] aspect-square rounded-[50%] ' alt="" />
                    <div className='flex flex-col gap-[10px] justify-center items-start' >
                        <div className='flex items-end ' >
                            <h1 className='text-[20px] text-[#fff]  mr-[2px] ' >{item.user.username}</h1>
                            <h2 className='text-[14px] text-[#ffffff57] '>({item.user.first_name} {item.user.last_name})</h2>
                        </div>
                        <p  className='text-[14px] text-[#fff] ' >you:...</p>
                    </div>
                </div>
            )
        })}
        {messages?.map((item:Profile,i:number)=>{
            console.log(i == messages.length-1 )
            return(
                <div key={i} className={`flex h-[20%] p-[20px] gap-[20px] hover:bg-[#161d2f8e] `} >
                    <img src={item.profile_image} className=' h-[100%] aspect-square rounded-[50%] ' alt="" />
                    <div className='flex flex-col gap-[10px] justify-center items-start' >
                        <div className='flex items-end ' >
                            <h1 className='text-[20px] text-[#fff] mr-[2px]' >{item.user.username}</h1>
                            <h2 className='text-[14px] text-[#ffffff57] '>({item.user.first_name} {item.user.last_name})</h2>
                        </div>
                        <p  className='text-[14px] text-[#fff] ' >you:...</p>
                    </div>
                </div>
            )
        })}
    </div>
    <main className=' w-[65%]   h-[100%]'>

    </main>
    </section>
  )
}

export default Messenger