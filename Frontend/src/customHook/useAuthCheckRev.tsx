import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { tokenAtom } from "../atoms/tokenAt"; 


export const useAuthCheckRev = () => {
    const token = useRecoilValue(tokenAtom);
    const setToken = useSetRecoilState(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await axios.get(
                    "https://backend.akshitgangwar02.workers.dev/api/v1/user/me",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                
                if (response.status==200){
                    localStorage.setItem("Username",response.data.user.userName)
                    localStorage.setItem("FirstName",response.data.user.firstName)
                    localStorage.setItem("FirstName",response.data.user.email)
                    navigate("/blogs")
                }
            } catch (error) {
                console.error("Error validating token", error);
                setToken("");
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        validateToken();
    }, [token, navigate, setToken]);
};

