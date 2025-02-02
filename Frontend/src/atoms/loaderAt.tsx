import { atom, selector } from "recoil";


export const loaderAtom=atom({
    key:"loaderAtom",
    default:false
})

// export const loaderSelector=selector({
//     key:"loaderSelector",
//     get:({get})=>{
//         const loaderState
//     }
// })