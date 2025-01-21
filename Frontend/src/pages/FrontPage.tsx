import { BottomBar } from "../components/BottomBar"
import { SignupButton1 } from "../components/SignupButton"
import { Topbar } from "../components/Topbar"

export const FrontPage=()=>{
    return <div className="bg-customColor h-screen">
        <Topbar></Topbar>
        <div className="pb-12 flex justify-between mb-24 lg:mb-0">
            <div className="ml-16 flex-col justify-start space-y-5 sm:space-y-9">
                <div className="text-3xl sm:text-5xl lg:text-9xl  font-serif font-semibold sm:font-thin mt-40">
                    <div>Human </div>
                    <div>Stories & Ideas</div>
                </div>
                <div className="text-base sm:text-2xl font-light" >A place to read, write, and deepen your understanding</div>
                <SignupButton1></SignupButton1>
            </div>
        </div>
        <BottomBar></BottomBar>
    </div>
}