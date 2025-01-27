import { AddButton } from "../components/AddButton"
import { BlogBox1,BlogBox2, BlogBox3 } from "../components/BlogBox"
import SaveDraft from "../components/SaveDraft"

import { TopBar3 } from "../components/Topbar"

export const Draft=()=>{
    return <div className="custom-bg h-screen bg-cover bg-center">
        <TopBar3></TopBar3>
        <div className="flex justify-center h-4/5 " >
            <div className="bg-customYellow text-white mt-10 w-screen lg:w-3/5 flex justify-start rounded-3xl space-x-2 pt-8 sm:pt-0">
                <div className="mt-10 "><AddButton></AddButton></div>
                <div className="flex-col w-screen px-6 sm:px-2 space-y-5 sm:space-y-4">
                    <div><BlogBox1 props='Title'></BlogBox1></div>
                    <div className="mt-4 sm:mt-0"><BlogBox2 props='SubTitle'></BlogBox2></div>
                    <BlogBox3></BlogBox3>
                </div>
            </div>
        </div>
        <div className="w-3/5 mx-auto flex justify-end">
                    <SaveDraft></SaveDraft>
                </div>
    </div>
}