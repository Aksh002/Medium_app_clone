export const InputBox=({label,set})=>{
    return <div>
        <label className="block mb-2 text-sm font-normal sm:font-medium text-white">{label}</label>
        <input onChange={(e)=>set(e.target.value)} className="font-sans max-w-[400px] sm:max-w-[1000px] p-2 sm:p-3.5 text-base border-[1.5px] border-black rounded-md shadow-[2.5px_3px_0_black] outline-none transition ease duration-200 focus:shadow-[5.5px_7px_0_black]" />
    </div>
}


export const InputBox2=()=>{
    return <div>
        
    </div>
}