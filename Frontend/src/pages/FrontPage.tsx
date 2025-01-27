import { useState } from "react"
import { BottomBar } from "../components/BottomBar"
import { SignupButton1 } from "../components/SignupButton"
import { Topbar } from "../components/Topbar"
import { Onboarding } from "../components/Onboarding"

export const FrontPage=()=>{
    const [isModelOpen , setIsModelOpen]=useState(false)
    const [newUser,setNewUser]=useState(true)

    const modelOpened=()=>setIsModelOpen(true)
    const modelClosed=()=>setIsModelOpen(false)
    const toggleUserState = (isSignin: boolean) => setNewUser(!isSignin)

    return(
    <div className={`relative ${isModelOpen ? "overflow-hidden" : ""}`}>
        <div className="bg-customColor h-screen">
            <Topbar></Topbar>
            <div className="pb-12 flex justify-between mb-24 lg:mb-0">
                <div className="ml-16 flex-col justify-start space-y-5 sm:space-y-9">
                    <div className="text-3xl sm:text-5xl lg:text-9xl  font-serif font-semibold sm:font-thin mt-40">
                        <div>Human </div>
                        <div>Stories & Ideas</div>
                    </div>
                    <div className="text-base sm:text-2xl font-light" >A place to read, write, and deepen your understanding</div>
                    <div className={`${ isModelOpen ? "blur-sm" : "" }`} transition-all duration-300><SignupButton1 fxn={setIsModelOpen}></SignupButton1></div>
                </div>
            </div>
            <BottomBar></BottomBar>
        </div>

    {/* Modal */}
    {isModelOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative  rounded-lg  w-11/12 max-w-md p-6 flex">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 font-bold text-xl text-gray-700 hover:text-white"
            onClick={modelClosed}
          >
            ✕
          </button>

          {/* Modal Content */}
            <Onboarding type={newUser ? "Signup" : "Signin"} fxn={toggleUserState} />
        </div>
      </div>
    )}
  </div>
    );
}