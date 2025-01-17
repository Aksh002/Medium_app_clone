import { AddButton } from "../components/AddButton"
import { BlogBox1,BlogBox2 } from "../components/BlogBox"
import SaveDraft from "../components/SaveDraft"

import { TopBar3 } from "../components/Topbar"

export const Draft=()=>{
    return <div className="custom-bg h-screen bg-cover bg-center">
        <TopBar3></TopBar3>
        <div className="flex justify-center h-4/5" >
            <div className="bg-customYellow text-white mt-10 w-3/5 flex justify-start rounded-3xl space-x-2 px-6 py-6">
                <div className="mt-2 invisible lg:visible"><AddButton></AddButton></div>
                <div className="flex-col sm:space-y-4">
                    <div className="border-l-2 border-slate-400 h-16 font-serif font-semibold">
                        <BlogBox1 props={"Title"}></BlogBox1>
                    </div>
                    <div className="font-sans font-thin"><BlogBox2 props={"Subtitle"}></BlogBox2></div>
                    <textarea rows={12} cols={80}
                        id="tell-your-story"
                        placeholder="Tell your story..."
                        className="w-full p-4 font-sans text-lg placeholder:text-customGray text-black bg-customYellow border-t-2 border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-gray-500 placeholder-gray-600 resize-none shadow-sm"
                    ></textarea>
                    <div className="flex justify-end ml-4 font-mono">
                        <div><SaveDraft></SaveDraft></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}