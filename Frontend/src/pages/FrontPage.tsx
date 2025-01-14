import { BottomBar } from "../components/BottomBar"
import { SignupButton1 } from "../components/SignupButton"
import { Topbar } from "../components/Topbar"

export const FrontPage=()=>{
    return <div className="bg-customColor">
        <Topbar></Topbar>
        <div className="pb-12">
            <div className="ml-16 flex-col justify-start space-y-9">
                <div className="text-9xl font-serif font-thin mt-40">
                    <div>Human </div>
                    <div>Stories & Ideas</div>
                </div>
                <div className="text-2xl font-light" >A place to read, write, and deepen your understanding</div>
                <SignupButton1></SignupButton1>
            </div>
        </div>
        <BottomBar></BottomBar>
    </div>
}