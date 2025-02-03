import { atom, selector } from "recoil";
import { useState } from "react";
import axios from "axios";
export const publishAtom=atom({
    key:"publishAtom",
    default:{
        title:"",
        subTitle:"",
        content:""
    }
})

export const publishSelector=selector({
    key:"publishSelector",
    get:({draftOnly})=>async ({get})=>{
        const publish=get(publishAtom)
        const [error,setError]=useState("")
    if (publish.title==""){
        setError("Title Is Necessary")
        return error;
    }
    else if (publish.content==""){
        setError("Content is necassary")
        return error;
    }
    else{
        try{
            const response=await axios.post("https://backend.akshitgangwar02.workers.dev/api/v1/blog/",{
                title: publish.title,
                subTitle: publish.subTitle?publish.subTitle:" ",
                content: publish.content
            })
            if (response && !draftOnly){
                const post=await axios.post(`https://backend.akshitgangwar02.workers.dev/api/v1/blog/${response.data.id}`)
                return post.status;
            }
            return (response.status)

        }catch(error){
            setError(`Couldnt save the draft:- ${error}`)
            return error
        }
    }
    }
})