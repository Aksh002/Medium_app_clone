import { useRecoilValue } from "recoil"
import BookMark from "./BookMark"
import Like from "./Like"
import { blogsAtomFamily } from "../atoms/blogsAtom"
import { useInView } from "framer-motion"
//import { div } from "framer-motion/client"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { div } from "framer-motion/client"
import { useState,useEffect } from "react"

export const BlogPrev=({blog})=>{
    console.log(blog)
    if (!blog) {
        return (
          <div className="p-4 bg-gray-200 rounded-lg">
            <Skeleton height={30} width="80%" />
            <Skeleton height={20} width="60%" />
            <Skeleton count={3} />
          </div>
        );
      }
    return (<div >
        <div className="flex justify-center">
            <div className="w-4/5 sm:w-1/2 border-b-2 border-t-2 mt-2 border-slate-200">
                <div className="flex justify-between px-4 py-6">
                    <div>
                        <div className="flex-col">
                            <div className="flex justify-start space-x-2">
                                <button><div className="rounded-full text-sm font-semibold font-sans bg-gray-800 text-white px-2 sm:px-2.5 py-1 mt-1">A</div></button>
                                <div className="mt-3 font-extralight font-mono text-gray-400">Akshit Gangwar</div>
                            </div>
                        </div>
                        <div className="text-2xl sm:text-4xl font-bold font-serif tracking-tighter pt-5">{blog.title}</div>
                        <div className="text-base sm:text-lg font-normal text-slate-500 font-sans pt-1">{blog.subTitle}</div>
                        <div className="flex-col">
                                <div className="flex justify-start space-x-2 sm:space-x-4 mt-8">
                                    <Like></Like>
                                    <div className="group relative mt-1">
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
                    </div>
                    <div className=" flex justify-end">
                        <div>Image</div>
                        <div className="ml-8">
                            <BookMark></BookMark>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}