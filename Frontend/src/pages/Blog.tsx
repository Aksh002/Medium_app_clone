import { useNavigate } from "react-router-dom"
import { Back } from "../components/Back"
import BookMark from "../components/BookMark"
import Like from "../components/Like"
import { TopBar2 } from "../components/Topbar"
import { useEffect } from "react"
import axios from "axios"
import { useAuthCheck } from "../customHook/useAuthCheck"

export const Blog=()=>{
    //const navigate=useNavigate()
    // useEffect(()=>{
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
    //             if (response.status!==200){
    //                 console.log(response.data.msg)
    //                 navigate("/")
    //             }
    //         }catch(error){
    //             console.error("Error fetching user data", error);
    //             navigate("/")
    //         }
    //     }
    //     fetchUserData()
    // },[navigate])
    useAuthCheck()
    return <div className="custom-bg h-screen w-screen">
        <TopBar2></TopBar2>
        <div><Back></Back></div>
        <div className=" md:flex justify-stretch">
            <div className="w-3/5 h-4/5 ml-20 mr-40 mb-32 mt-20  space-y-4">
                <div className="mb-10">
                    <div className="text-4xl font-sans font-bold pb-16  md:text-8xl">Title</div>
                    <div className="flex-col">
                        <div className="border-y-2 border-customGray flex justify-between  py-2">
                            <div className="flex justify-start space-x-6 ml-4">
                                <div><Like></Like></div>
                                <div>
                                    <div className="group relative">
                                        <button>
                                            <svg className="w-6 h-6 hover:scale-125 duration-200 hover:stroke-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                                            <path d="M8 9h8"></path>
                                            <path d="M8 13h6"></path>
                                            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mr-4"><BookMark></BookMark></div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="text-lg md:text-2xl font-serif font-thin text-slate-700">SubTitle</div>
                    <div className="mb-12 mt-12 ">Image</div>
                    <div className="text-base md:text-xl font-medium font-serif">Content</div>
                </div>
                <div>
                
                </div>
            </div>
            <div className=" flex-col mt-20 w-1/5 h-32 mr-12 border-y-2 border-customGray rounded-lg ml-6">
                <div className="flex justify-center">
                    <div className="mt-6"><button><div className="rounded-xl text-3xl font-semibold font-sans bg-gray-800 text-white px-2 py-2 mt-1 h-14 w-14 ">A</div></button></div>
                    <div className="flex-col justify-start mt-6 ml-5 space-y-2">
                        <div className="text-xl md:text-3xl font-semibold">Author</div>
                        <div className="text-lg font-light  font-mono text-gray-600">Author username</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}