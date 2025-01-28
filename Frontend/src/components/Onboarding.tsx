import { Link } from "react-router-dom"
import { InputBox } from "./InputBox"
import { useState } from "react";
import Submit from "./Submit";
import { useSetRecoilState,useRecoilState } from "recoil";
import { signupAtom } from "../atoms/loginAt";

// interface Props{
//     label:string;
//     placeholder:string;
//     onchange:(e:ChangeEvent<HTMLInputElement>)=>void;
// }
interface Props {
    type: string;
    fxn: (isSignin: boolean) => void;
}
export const Onboarding=({type,fxn}:Props)=>{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [userName,setUserName]=useState("")
    const [firstName,setFirstName]=useState("")

    //const [signup,setSignup]=useRecoilState(signupAtom)

    return <div>
        <div className="flex justify-center">
                <div className="flex-col justify-center  p-10 sm:p-16 mb-3 mt-3 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-xl shadow-gray-400">
                    <div className="font-serif text-lg sm:text-3xl flex justify-center text-white mb-3 sm:mb-6 font-normal sm:font-medium  rounded-lg">{type=='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <div className="ml-2 space-y-3 sm:space-y-3">
                        <InputBox set={setEmail} label="Email"></InputBox>
                        {type=='Signin'?<div></div>:<InputBox set={setUserName} label={"User Name"}></InputBox>}
                        <InputBox set={setPassword} label="Password"></InputBox>
                        {type=='Signin'?<div></div>:<InputBox set={setFirstName} label={"What should we call u"}></InputBox>}
                        <div className="flex justify-center pt-2 pr-4"><Submit></Submit></div>
                    </div>
                    {type=='Signup'?(
                        <div className="flex space-x-1 mt-2">
                            <div className="text-white text-sm font-thin font-mono mt-1">Alresdy have an account?</div>
                            <div className="text-black underline " ><button onClick={()=>fxn(true)} >Signin</button></div>
                        </div>
                        ):(
                        <div className="flex space-x-1 mt-2">
                            <div className="text-white text-sm font-thin font-mono mt-1">New Here?</div>
                            <div className="text-black underline"><button onClick={()=>fxn(false)}>Signup</button></div>
                        </div>)
                    }
                </div>
            </div>
    </div>
}

export const Onboarding1=({type})=>{
    return <div>
        <div className="flex justify-center">
                <div className="flex-col justify-center space-y-2 sm:space-y-3 p-10 sm:p-16 mb-3 mt-3 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-xl shadow-gray-400">
                    <div className="font-serif text-lg sm:text-3xl flex justify-center text-white mb-3 sm:mb-6 font-normal sm:font-medium  rounded-lg">{type=='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <InputBox label="Email"></InputBox>
                    {type=='Signin'?<div></div>:<InputBox label={"User Name"}></InputBox>}
                    <InputBox label="Password"></InputBox>
                    {type=='Signin'?<div></div>:<InputBox label={"What should we call u"}></InputBox>}
                    {type=='Signup'?(
                        <div className="flex space-x-1">
                            <div className="text-white text-sm font-thin font-mono mt-1">Alresdy have an account?</div>
                            <div className="text-black underline " ><Link to={'/signin'}>Signin</Link></div>
                        </div>
                        ):(
                        <div className="flex space-x-1">
                            <div className="text-white text-sm font-thin font-mono mt-1">New Here?</div>
                            <div className="text-black underline"><Link to={'/signup'}>Signup</Link></div>
                        </div>)
                        }
                </div>
            </div>
    </div>
}