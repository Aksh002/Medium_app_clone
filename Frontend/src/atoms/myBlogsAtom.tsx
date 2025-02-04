import axios from "axios";
import { atom, atomFamily, selector, selectorFamily, useRecoilValue } from "recoil";
import { tokenAtom } from "./tokenAt"

export const viewMyBlogsAtom=atom({
    key:"viewMyBlogsAtom",
    default:false
})


export const myBlogsAtom=atom({
    key:"myBlogsAtom",
    default:selector({
        key:"myBlogsSelector",
        get:async({get})=>{
            const token=get(tokenAtom)
            if (!token){
                return [];
            }
            try{
                const response=await axios.get("https://backend.akshitgangwar02.workers.dev/api/v1/blog/myPosts",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                return response.data.allPost || []
                //const allBlogs=response.data.allPost || []
                // const blogsIds=allBlogs.map((post)=>post.id)
                // return blogsIds
            }catch(error){
                console.error("Error fetching blogs:", error);
                return [];
            }
        }
    })
})