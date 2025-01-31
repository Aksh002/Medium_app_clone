import { BottomBar } from "../components/BottomBar"
import { Onboarding } from "../components/Onboarding"
import { Topbar1 } from "../components/Topbar"
import { useAuthCheckRev } from "../customHook/useAuthCheckRev"

export const Signin=()=>{
    useAuthCheckRev()
    return <div>
        <div className="min-h-screen bg-customColor ">
            <Topbar1 label={'Signin'}></Topbar1>
            <div className="mt-16 mb-16 sm:mb-32">
                <Onboarding fxn={null} type={'Signin'}></Onboarding>
            </div>
            <BottomBar></BottomBar>
        </div>        
    </div>
}