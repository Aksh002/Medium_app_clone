import { BlogPrev } from "../components/BlogPrev"
import { TopBar2 } from "../components/Topbar"

export const Blogs=()=>{
    return <div className="min-h-screen bg-white">
        <div>
            <TopBar2></TopBar2>
        </div>
        <div className="mt-8">
            <BlogPrev></BlogPrev>
        </div>
    </div>
}