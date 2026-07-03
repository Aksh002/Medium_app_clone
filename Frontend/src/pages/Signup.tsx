import { BottomBar } from "../components/BottomBar"
import { Onboarding } from "../components/Onboarding"
import { Topbar1 } from "../components/Topbar"
import { useAuthCheckRev } from "../customHook/useAuthCheckRev"

export default function Signup(){
    useAuthCheckRev()
    return <div>
        <div className="min-h-screen bg-customColor space-y-4">
            <Topbar1 label={'Signup'}></Topbar1>
            <div className="flex justify-center px-5 py-12">
                <Onboarding type={'Signup'}></Onboarding>
            </div>
            <BottomBar></BottomBar>
        </div>        
    </div>
}
