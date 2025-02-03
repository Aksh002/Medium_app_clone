import { useNavigate } from "react-router-dom"
import { AddButton } from "../components/AddButton"
import { BlogBox1,BlogBox2, BlogBox3 } from "../components/BlogBox"
import SaveDraft from "../components/SaveDraft"
import { useEffect, useRef, useState } from "react"
import { TopBar3 } from "../components/Topbar"
import axios from "axios"
import { useAuthCheck } from "../customHook/useAuthCheck"
import { motion,AnimatePresence } from "framer-motion"
import { useRecoilValue } from "recoil"
import { tokenAtom } from "../atoms/tokenAt"


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

export default function Draft(){
    const isFirstRender = useRef(true);
    
    useEffect(()=>{
        if (isFirstRender.current){
            localStorage.removeItem("currentBlogId")
            isFirstRender.current=false
        }

        return ()=>{
            localStorage.removeItem("currentBlogId")
        }
    },[])

    useAuthCheck()
    const [title,setTitle]=useState("")
    const [subTitle,setSubTitle]=useState("")
    const [content,setContent]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate()
    const token=useRecoilValue(tokenAtom)

    const draft=async(existingId:string | null)=>{
        console.log("draft fxn triggered")
        if (title==""){
            setError("Title Is Necessary")
            console.log("Publish function triggered in !title!");
        }
        if (existingId){
            try{
                console.log("draft function triggered in else part but put statement!");
                const response=await axios.put(`https://backend.akshitgangwar02.workers.dev/api/v1/blog/${existingId}`,{
                    title: title,
                    subTitle: subTitle?subTitle:" ",
                    content:content
                },{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                return existingId
            }catch(error){
                console.log(error)
                setError(`Couldnt save the draft:- ${error}`)
            }
        }
        else{
            try{
                console.log("Draft function triggered in else part!");
                const response=await axios.post("https://backend.akshitgangwar02.workers.dev/api/v1/blog",{
                    title: title,
                    subTitle: subTitle?subTitle:" ",
                    content:content
                },{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                localStorage.setItem("currentBlogId",response.data.blogId)
                return response.data.blogId
            }catch(error){
                console.log(error)
                setError(`Couldnt save the draft:- ${error}`)
            }
        }
    }
    const publish=async (blogId:string)=>{
        //const token=localStorage.getItem("jwtToken")
        console.log("Publish function triggered!");
        if (title==""){
            setError("Title Is Necessary")
            console.log("Publish function triggered in !title!");
        }
        else if (content==""){
            setError("Content is necassary")
            console.log("Publish function triggered in !content!");
        }
        else{
            try{
                console.log("try")
                    const post=await axios.post(`https://backend.akshitgangwar02.workers.dev/api/v1/blog/${blogId}`,{},{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    console.log("After post")
                    if (post.status==200){
                        navigate("/blogs")
                    }
            }catch(error){
                setError(`Couldnt post the draft:- ${error}`)
                console.log(error)
            }
        }
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                <div className="custom-bg h-screen bg-cover bg-center">
                    <motion.div variants={itemVariants}>
                        <TopBar3 draft={draft} publish={publish} />
                    </motion.div>
                    
                    <div className="flex justify-center h-4/5">
                        <motion.div 
                            className="bg-customYellow text-white mt-10 w-screen lg:w-3/5 flex justify-start rounded-3xl space-x-2 pt-8 sm:pt-0"
                            variants={itemVariants}
                        >
                            <motion.div className="mt-10" variants={itemVariants}>
                                <AddButton />
                            </motion.div>
                            
                            <div className="flex-col w-screen px-6 sm:px-2 space-y-5 sm:space-y-4">
                                <motion.div variants={itemVariants}>
                                    <BlogBox1 fxn={setTitle} props='Title' />
                                </motion.div>
                                <motion.div variants={itemVariants} className="mt-4 sm:mt-0">
                                    <BlogBox2 fxn={setSubTitle} props='SubTitle' />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <BlogBox3 fxn={setContent}/>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                    
                    <motion.div 
                        className="w-3/5 mx-auto flex justify-end"
                        variants={itemVariants}
                    >
                        <SaveDraft draft={draft} />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}