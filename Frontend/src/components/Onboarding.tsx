import { InputBox } from "./InputBox"
export const Onboarding=({props})=>{
    return <div>
        <div className="flex justify-center">
                <div className="flex-col justify-center space-y-3 p-20 mb-4 mt-6 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-xl shadow-gray-400">
                    <div className="font-serif text-3xl flex justify-center text-white  mb-6 font-medium  rounded-lg">{props=='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <InputBox props={"Email"}></InputBox>
                    {props=='Signin'?<div></div>:<InputBox props={"User Name"}></InputBox>}
                    <InputBox props={"Password"}></InputBox>
                    {props=='Signin'?<div></div>:<InputBox props={"What should we call u"}></InputBox>}
                </div>
            </div>
    </div>
}