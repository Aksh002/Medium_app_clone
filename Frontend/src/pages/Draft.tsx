import { useNavigate } from "react-router-dom"
import { AddButton } from "../components/AddButton"
import { BlogBox1,BlogBox2, BlogBox3 } from "../components/BlogBox"
import SaveDraft from "../components/SaveDraft"
import { useEffect, useState } from "react"
import { TopBar3 } from "../components/Topbar"
import axios from "axios"
import { useAuthCheck } from "../customHook/useAuthCheck"
import { motion,AnimatePresence } from "framer-motion"

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
    const [title,setTitle]=useState("")
    const [subtitle,setSubTitle]=useState("")
    const [content,setContent]=useState("")

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
                        <TopBar3 />
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
                                <motion.div fxn={setContent} variants={itemVariants}>
                                    <BlogBox3 />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                    
                    <motion.div 
                        className="w-3/5 mx-auto flex justify-end"
                        variants={itemVariants}
                    >
                        <SaveDraft />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}