import { Link } from "react-router-dom"
import { InputBox } from "./InputBox"
export const Onboarding=({props}:{type:'Signup'|'Signin'})=>{
    return <div>
        <div className="flex justify-center">
                <div className="flex-col justify-center space-y-1 sm:space-y-3 p-10 sm:p-16 mb-3 mt-3 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-xl shadow-gray-400">
                    <div className="font-serif text-lg sm:text-3xl flex justify-center text-white mb-6 font-normal sm:font-medium  rounded-lg">{props=='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <InputBox props={"Email"}></InputBox>
                    {props=='Signin'?<div></div>:<InputBox props={"User Name"}></InputBox>}
                    <InputBox props={"Password"}></InputBox>
                    {props=='Signin'?<div></div>:<InputBox props={"What should we call u"}></InputBox>}
                    {props=='Signup'?<div className="flex space-x-1">
                            <div className="text-white text-sm font-thin font-mono mt-1">Alresdy have an account?</div>
                            <Link className="text-blue-700 underline " to={'/signin'}>Signin</Link>
                        </div>:<div className="flex space-x-1">
                            <div className="text-white text-sm font-thin font-mono mt-1">New Here?</div>
                            <Link className="text-blue-700 underline" to={'/signup'}>Signup</Link>
                        </div>}
                </div>
            </div>
    </div>
}