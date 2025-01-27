import { Link } from "react-router-dom"
import { InputBox } from "./InputBox"

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
                            <div className="text-black underline " ><button onClick={()=>fxn(true)} >Signin</button></div>
                        </div>
                        ):(
                        <div className="flex space-x-1">
                            <div className="text-white text-sm font-thin font-mono mt-1">New Here?</div>
                            <div className="text-black underline"><button onClick={()=>fxn(false)}>Signup</button></div>
                        </div>)
                        }
                </div>
            </div>
    </div>
}