import { BottomBar } from "../components/BottomBar"
import { Onboarding } from "../components/Onboarding"
import { Topbar } from "../components/Topbar"

export const Signup=()=>{
    return <div>
        <div className="min-h-screen bg-customColor ">
            <Topbar></Topbar>
            <Onboarding props={'Signup'}></Onboarding>
            <BottomBar></BottomBar>
        </div>        
    </div>
}