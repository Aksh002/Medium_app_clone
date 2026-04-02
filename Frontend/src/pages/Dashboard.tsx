import axios from "axios"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { tokenAtom } from "../atoms/tokenAt"

export default function Dashboard(){
    const token=useRecoilValue(tokenAtom)
    useEffect(()=>{
        async function dataFetch(){
            const myPosts= await axios.get("https://backend.akshitgangwar02.workers.dev/api/v1/blog/myPosts",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const myDrafts= await axios.get("https://backend.akshitgangwar02.workers.dev/api/v1/blog/drafts",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const mySavedPosts= await axios.get("https://backend.akshitgangwar02.workers.dev/api/v1/blog/mySavedPosts",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        }

        dataFetch()
    },[])
    return <div>
        <div className="flex flex-col">
            <div className="flex justify-evenly ">
                <div className="bg-blue-500 h-full w-full flex justify-center">
                    My blogs
                </div>
                <div className="bg-green-500 h-full w-full flex justify-center">
                    Saved blogs
                </div>
            </div>
        </div>
    </div>
}