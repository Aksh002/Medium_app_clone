import { BottomBar } from "../components/BottomBar"
import { Onboarding } from "../components/Onboarding"
import { Topbar } from "../components/Topbar"

export const Signin=()=>{
    return <div>
        <div className="min-h-screen bg-customColor ">
            <Topbar></Topbar>
            <div className="mt-16 mb-16 sm:mb-32">
                <Onboarding props={'Signin'}></Onboarding>
            </div>
            <BottomBar></BottomBar>
        </div>        
    </div>
}