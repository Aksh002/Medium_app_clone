export const Back = ({onClick}) => {
  return (
    <button onClick={()=>onClick(false)} type="button" className=" text-center w-20 rounded-2xl h-10 relative text-black text-md font-semibold  group">
      <div className="bg-gray-800 rounded-xl h-8 w-1/4 grid place-items-center absolute left-0 top-0 group-hover:w-full z-10 duration-500">
        <svg width="15px" height="15px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
          <path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
        </svg>
      </div>
      <p className="translate-x-4 mb-2">Back</p>
    </button>
  );
}


