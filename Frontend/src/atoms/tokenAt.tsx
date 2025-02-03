import { atom, selector } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const tokenAtom=atom({
    key:'tokenAtom',
    default:localStorage.getItem("jwtToken")
})

