import axios from "axios";
import { atomFamily, selectorFamily } from "recoil";

export const blogsAtomFamily=atomFamily({
    key:"blogsAtomFamily",
    get:selectorFamily({
        key:"blogsSelectorFamily",
        get:(id)=> async()=>{
                const response=await axios.get("https://backend.akshitgangwar02.workers.dev/api/v1/blog/bulk",{
                    headers:{
                        Authorization:localStorage.getItem("jwtToken")
                    }
                })
        }}
    )
})