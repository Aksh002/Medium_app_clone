import { BottomBar } from "../components/BottomBar"
import { Onboarding1 } from "../components/Onboarding"
import { Topbar1 } from "../components/Topbar"

export const Signup=()=>{
    return <div>
        <div className="min-h-screen bg-customColor space-y-4">
            <Topbar1 label={'Signup'}></Topbar1>
            <Onboarding1 type={'Signup'}></Onboarding1>
            <BottomBar></BottomBar>
        </div>        
    </div>
}