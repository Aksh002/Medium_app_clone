import { atom,selector } from 'recoil'
import axios  from 'axios'
// interface signupType{

// }

export const signupAtom = atom({
    key:'signupAtom',
    default:{}
})

// export const signupSelector=selector({
//     key:'loginSelector',
//     get:async ({get})=>{
//         const loginDetail=get(signupAtom)
//         const user = await axios.post()
//     }
// })