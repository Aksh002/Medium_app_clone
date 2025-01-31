import { BottomBar } from "../components/BottomBar"
import { Onboarding } from "../components/Onboarding"
import { Topbar1 } from "../components/Topbar"
import { useAuthCheckRev } from "../customHook/useAuthCheckRev"

export const Signup=()=>{
    useAuthCheckRev()
    return <div>
        <div className="min-h-screen bg-customColor space-y-4">
            <Topbar1 label={'Signup'}></Topbar1>
            <Onboarding fxn={null} type={'Signup'}></Onboarding>
            <BottomBar></BottomBar>
        </div>        
    </div>
}