import { atom,selector } from 'recoil'
import axios  from 'axios'
// interface signupType{

// }

export const signupAtom = atom({
    key:'signupAtom',
    default:{}
})

// export const signupSelector=selector({
//     key:'signupSelector',
//     get:async ({get})=>{
//         const signupDetail=get(signupAtom)
//         const response = await axios.post(`https://backend.akshitgangwar02.workers.dev/api/v1/user/signup`,signupDetail)
//         return response.data.token
//     }
// })