import { Outlet } from "react-router"

function AuthLayout(){
    
    return(
        <>
            <div className="flex flex-col items-center  w-[100vw] h-[100vh] bg-[#10141E] px-[24px] pt-[48px] pb-[170px]  md:px-[184px] md:pt-[80px] md:pb-[473px] lg:px-[540px] lg:pt-[78.4] lg:pb-[250px]"  >
                <img className="mb-[58.4px] md:mb-[72.4px] lg:mb-[83px] ml-[-30px] w-[64px] " src="/public/images/logo1.png" />
                <Outlet/>
            </div>
            
        </>
    )
}

export default AuthLayout