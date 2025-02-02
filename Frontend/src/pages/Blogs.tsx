import { useEffect } from "react"
import { BlogPrev } from "../components/BlogPrev"
import { TopBar2 } from "../components/Topbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthCheck } from "../customHook/useAuthCheck"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { blogsAtom, blogsFetchSelector, blogsIdAtom } from "../atoms/blogsAtom"
import { motion,AnimatePresence } from "framer-motion"

export default function Blogs(){
    
    useAuthCheck()  // Checks for token
    //const blogsIds=useRecoilValue(blogsIdAtom)
    const fetchBlogs=useRecoilValue(blogsAtom) // Trigger fetching
    console.log(fetchBlogs)
    // Fetch blogs on component mount
    // useEffect(() => {
    //     setFetchBlogs;
    // },[]);
    
    if (!fetchBlogs.length) return <div>Loading blogs...</div>;
    return <div className="min-h-screen bg-white">
        <div>
        <AnimatePresence>
            <motion.div                         
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
                <motion.div                                             
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                >
                    <TopBar2></TopBar2>
                </motion.div>
            </motion.div>
        </AnimatePresence>
        </div>
        <div className="mt-8 flex-col space-y-8">
            <motion.div className="mt-8 flex-col space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }, // Staggered effect
                        },
                        }}
            >
                {fetchBlogs.map((blog,id)=>
                    <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 1000 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
                      }}
                    >
                        <BlogPrev key={id} blog={blog}></BlogPrev>
                    </motion.div>
                )}
            </motion.div>
        </div>
    </div>
}