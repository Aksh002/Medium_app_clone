import { Link, useNavigate } from "react-router-dom"
import { InputBox } from "./InputBox"
import { useState } from "react";
import Submit from "./Submit";
import { useSetRecoilState,useRecoilState, useRecoilValue } from "recoil";
import { signupAtom,signupSelector } from "../atoms/signupAt";
import { tokenAtom } from "../atoms/tokenAt";
import axios from "axios";
import { loaderAtom } from "../atoms/loaderAt";
import Loader from "./Loader";
import LoadingPage from "./LoadingPage";

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
    const [token,setToken]=useRecoilState(tokenAtom)
    const [error,setError]=useState("")
    //const [signup,setSignup]=useRecoilState(signupAtom)
    //const token:string=useRecoilValue(signupSelector)
    const [loader,setLoader]=useRecoilState(loaderAtom)
    const navigate=useNavigate()
    

    const SubmitFxn=async ()=>{
        
        
        try {
            // Make the API request manually instead of using a selector
            if ( type=="Signup" && email!="" && password!="" && userName!="" && firstName!=""){
                const response = await axios.post(
                    "https://backend.akshitgangwar02.workers.dev/api/v1/user/signup",
                    {
                        email,
                        userName,
                        firstName,
                        password
                    }
                );
                if (response.data.token) {
                    setToken(response.data.token);  // Store token in state
                    localStorage.setItem("jwtToken", response.data.token);
                    navigate("/Blogs");
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setLoader(false)
                }
                else{
                    setLoader(false)
                    setError(`Signup Failed ${response.data.msg}`)
                }
            }
            else if (type=="Signin" && email!="" && password!="" ){
                const response = await axios.post(
                    "https://backend.akshitgangwar02.workers.dev/api/v1/user/signin",
                    {
                        email,
                        password,
                    }
                );
                if (response.data.token) {
                    setToken(response.data.token);  // Store token in state
                    localStorage.setItem("jwtToken", response.data.token);
                    navigate("/Blogs");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setLoader(false)
                }
                else{
                    setLoader(false)
                    setError(`Signup Failed ${response.data.msg}`)
                }
            }
            else{
                setLoader(false)
                setError("A value is missing");
            }            
        } catch (err) {
            setLoader(false)
            setError(`Signup failed:${err}`)
        }
    }

    return <div >
        <div className={`relative ${loader ? "overflow-hidden" : ""}`}>
        {fxn?(<div className="flex justify-center">
                <div className="flex-col justify-center  p-10 sm:p-16 mb-3 mt-3 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-2xl  shadow-black">
                    <div className="font-serif text-lg sm:text-3xl flex justify-center text-white mb-3 sm:mb-6 font-normal sm:font-medium  rounded-lg">{type==='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <div className="ml-2 space-y-3 sm:space-y-3">
                        <InputBox set={setEmail} label="Email"></InputBox>
                        {type==='Signin'?<div></div>:<InputBox set={setUserName} label={"User Name"}></InputBox>}
                        <InputBox set={setPassword} label="Password"></InputBox>
                        {type==='Signin'?<div></div>:<InputBox set={setFirstName} label={"What should we call u"}></InputBox>}
                        <div className="flex justify-center pt-2 pr-4"><Submit onClick={SubmitFxn}></Submit></div>
                    </div>
                    {type==='Signup'?(
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
                    <div>{error?<div>{error}</div>:<div/>}</div>
                </div>
            </div>
        )
        :
        (<div>
        <div className="flex justify-center">
                <div className="flex-col justify-center space-y-2 sm:space-y-3 p-10 sm:p-16 mb-3 mt-3 rounded-3xl  bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400 border-black shadow-xl shadow-gray-400">
                    <div className="font-serif text-lg sm:text-3xl flex justify-center text-white mb-3 sm:mb-6 font-normal sm:font-medium  rounded-lg">{type==='Signin'?<span>WELCOME!!</span>:<span>JOIN US</span>}</div>
                    <InputBox set={setEmail} label="Email"></InputBox>
                    {type==='Signin'?<div></div>:<InputBox set={setUserName} label={"User Name"}></InputBox>}
                    <InputBox set={setPassword} label="Password"></InputBox>
                    {type==='Signin'?<div></div>:<InputBox set={setFirstName} label={"What should we call u"}></InputBox>}
                    <div className="flex justify-center pt-2 pr-4"><Submit onClick={SubmitFxn}></Submit></div>
                    {type==='Signup'?(
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
    </div>)
    }
    </div>
    </div>
}

export const Onboarding1=({type})=>{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [userName,setUserName]=useState("")
    const [firstName,setFirstName]=useState("")
    const [token,setToken]=useRecoilState(tokenAtom)
    //const [signup,setSignup]=useRecoilState(signupAtom)
    //const token:string=useRecoilValue(signupSelector)

    const navigate=useNavigate()
    

    const SubmitFxn=async ()=>{
        
        
        try {
            // Make the API request manually instead of using a selector
            const response = await axios.post(
                "https://backend.akshitgangwar02.workers.dev/api/v1/user/signup",
                {
                    email,
                    userName,
                    firstName,
                    password
                }
            );

            if (response.data.token) {
                setToken(response.data.token);  // Store token in state
                localStorage.setItem("jwtToken", response.data.token);
                navigate("/Blogs");
            }
        } catch (error) {
            console.error("Signup failed:", error);
        }
    }

    return 
}