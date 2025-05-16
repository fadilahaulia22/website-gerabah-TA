import { useEffect, useState } from "react";
import { getUsername } from "../services/auth.service";

const useLogin = () =>{
    const [username, setUserName] = useState("")
    useEffect (() => {
        // Untuk Mendapatkan token dari local storage
        const token = localStorage.getItem("token");
        if(token){
            setUserName(getUsername(token));
        }else {
            window.location.href = "/login"
        }
    },[]);

    return username;
}

export default useLogin;