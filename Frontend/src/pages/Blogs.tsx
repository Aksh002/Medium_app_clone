import { useEffect } from "react"
import { BlogPrev } from "../components/BlogPrev"
import { TopBar2 } from "../components/Topbar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthCheck } from "../customHook/useAuthCheck"
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { blogsAtom, blogsFetchSelector, blogsIdAtom } from "../atoms/blogsAtom"
import { motion,AnimatePresence } from "framer-motion"
import { draftsAtom, viewDraftAtom } from "../atoms/draftsAtom"
import { myBlogsAtom, viewMyBlogsAtom } from "../atoms/myBlogsAtom"
import { Back } from "../components/Back"

export default function Blogs(){
    
    useAuthCheck()  // Checks for token
    //const blogsIds=useRecoilValue(blogsIdAtom)
    const fetchBlogs=useRecoilValue(blogsAtom) // Trigger fetching
    console.log(fetchBlogs)
    // Fetch blogs on component mount
    // useEffect(() => {
    //     setFetchBlogs;
    // },[]);
    
    const fetchDrafts=useRecoilValue(draftsAtom)
    const [viewDraft,setViewDraft]=useRecoilState(viewDraftAtom)
    const fetchMyBlogs=useRecoilValue(myBlogsAtom)
    const [viewMyBlogs,setViewMyBlogs]=useRecoilState(viewMyBlogsAtom)
    //const refreshMyBlogs = useRecoilRefresher_UNSTABLE(myBlogsAtom);

    // useEffect(() => {
    //     if (viewMyBlogs) {
    //       refreshMyBlogs(); // Force re-fetch blogs when viewMyBlogs changes
    //     }
    //   }, [viewMyBlogs]);
    
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
                    {(viewDraft)?<div><Back onClick={setViewDraft}></Back></div>:<div></div>}
                    {(viewMyBlogs)?<div><Back onClick={setViewMyBlogs}></Back></div>:<div></div>}
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
                {(!viewDraft && !viewMyBlogs)?<div>
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
                </div>:<div></div>}
                {viewDraft && <div>{
                    fetchDrafts.map((blog,id)=>
                    <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 1000 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
                      }}
                    >
                        <BlogPrev key={id} blog={blog}></BlogPrev>
                    </motion.div>
                )
                    }</div>}
                {viewMyBlogs && <div>{
                    fetchMyBlogs.map((blog,id)=>
                    <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 1000 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
                      }}
                    >
                        <BlogPrev key={id} blog={blog}></BlogPrev>
                    </motion.div>
                )
                    }</div>}
            </motion.div>
        </div>
    </div>
}