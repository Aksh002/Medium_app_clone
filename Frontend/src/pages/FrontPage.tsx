import { useState,useEffect } from "react"
import { BottomBar } from "../components/BottomBar"
import { SignupButton1 } from "../components/SignupButton"
import { Topbar } from "../components/Topbar"
import { Onboarding } from "../components/Onboarding"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthCheckRev } from "../customHook/useAuthCheckRev"
import LoadingPage from "../components/LoadingPage"
import { useRecoilState } from "recoil"
import { loaderAtom } from "../atoms/loaderAt"
import { motion,AnimatePresence } from "framer-motion"


export default function FrontPage(){
    const [isModelOpen , setIsModelOpen]=useState(false)
    const [newUser,setNewUser]=useState(true)

    const modelOpened=()=>setIsModelOpen(true)
    const modelClosed=()=>setIsModelOpen(false)
    const toggleUserState = (isSignin: boolean) => setNewUser(!isSignin)
    
    const [loader,setLoader]=useRecoilState(loaderAtom)
  //const navigate = useNavigate()

  //   useEffect(()=>{
  //     const fetchUserData=async ()=>{
  //         if (!localStorage.getItem("jwtToken")){
  //             navigate("/")
  //         }
  //         try{
  //             const response = await axios.get(
  //                 "https://backend.akshitgangwar02.workers.dev/api/v1/user/me",
  //                 {
  //                     headers:{
  //                         Authorization:`Bearer ${localStorage.getItem("jwtToken")}`
  //                     }
  //                 }
  //             )
  //             if (response.status==200){
  //                 localStorage.setItem("Username",response.data.user.userName)
  //                 localStorage.setItem("FirstName",response.data.user.firstName)
  //                 localStorage.setItem("FirstName",response.data.user.email)
  //                 navigate("/blogs")
  //             }
  //         }catch(error){
  //             console.error("Error fetching user data", error);
  //             navigate("/")
  //         }
  //     }
  //     fetchUserData()
  // },[navigate])
  useAuthCheckRev()

    return(<div>
    <div className={`relative ${isModelOpen || loader ? "overflow-hidden" : ""}`}>
        <div className="bg-customColor h-screen">
            <Topbar modelOpened={modelOpened} newUser={setNewUser}></Topbar>
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
    <AnimatePresence>
                {isModelOpen && !loader && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="relative rounded-lg w-11/12 max-w-md p-6 flex"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <button
                                className="absolute top-3 right-3 font-bold text-xl text-gray-700 hover:text-white"
                                onClick={modelClosed}
                            >
                                ✕
                            </button>
                            <Onboarding type={newUser ? "Signup" : "Signin"} fxn={toggleUserState} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {loader && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="flex justify-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <LoadingPage />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
  </div>
  

            
  </div>);
}