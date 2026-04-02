import axios from "axios"
import { useNavigate } from "react-router-dom"

export const usePublish=async ({post,title,subTitle,content})=>{
    const [error,setError]=useState("")
    if (title==""){
        setError("Title Is Necessary")
    }
    else if (content==""){
        setError("Content is necassary")
    }
    else{
        try{
            const response=await axios.post("https://backend.akshitgangwar02.workers.dev/api/v1/blog/",{
                title: title,
                subTitle: subTitle?subTitle:" ",
                content:content
            })
            if (response){
                const post=await axios.post(`https://backend.akshitgangwar02.workers.dev/api/v1/blog/${response.data.id}`)
                
            }

        }catch(error){
            setError(`Couldnt save the draft:- ${error}`)
        }
    }
}