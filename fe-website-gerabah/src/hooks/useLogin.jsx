import { useEffect, useState } from "react";
import { getUsername } from "../services/auth.service";

const useLogin = () =>{
    // const [username, setUserName] = useState("")
    const [username, setUserName] = useState(null);

    useEffect (() => {
        // Untuk Mendapatkan token dari local storage
        const token = localStorage.getItem("token");
        if(token){
            setUserName(getUsername(token));
        }else {
            // window.location.href = "/login"
            setUserName(null);
        }
    },[]);

    return username;
}

export default useLogin;