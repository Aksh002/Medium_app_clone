import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { tokenAtom } from "../atoms/tokenAt"; 

export const useAuthCheck = () => {
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

                if (response.status !== 200) {
                    console.log("Invalid token:", response.data.msg);
                    setToken(""); // Clear token in Recoil
                    localStorage.removeItem("jwtToken"); // Remove from localStorage
                    localStorage.removeItem("userName")
                    localStorage.removeItem("firstName")
                    localStorage.removeItem("email")
                    navigate("/");
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




