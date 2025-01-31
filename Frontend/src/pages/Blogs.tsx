import { useEffect } from "react"
import { BlogPrev } from "../components/BlogPrev"
import { TopBar2 } from "../components/Topbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthCheck } from "../customHook/useAuthCheck"

export const Blogs=()=>{
    
    useAuthCheck()  // Checks for token
    
    return <div className="min-h-screen bg-white">
        <div>
            <TopBar2></TopBar2>
        </div>
        <div className="mt-8">
            <BlogPrev></BlogPrev>
        </div>
    </div>
}