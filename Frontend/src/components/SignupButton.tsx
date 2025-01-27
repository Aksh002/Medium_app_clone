export const SignupButton1=({fxn})=>{
    return <div>
        <button onClick={()=>fxn(true)} type="button" className="text-white bg-gradient-to-r from-gray-600 via-gray-800 to-black hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-3xl text-base sm:text-lg px-5 sm:px-10 py-1 sm:py-2 text-center me-2 mb-2 ">Get Started</button>
    </div>
}

export const SignupButton2=()=>{
    return <div>
        <button type="button" className="text-white bg-gradient-to-r from-gray-600 via-gray-800 to-black hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-normal mt-1 sm:font-medium rounded-2xl text-sm px-2 sm:px-4 py-1 sm:py-2 text-center me-2  ">Get Started</button>
    </div>
}