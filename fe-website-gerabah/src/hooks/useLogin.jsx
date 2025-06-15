import { useEffect, useState } from "react";

const useLogin = () =>{
    // const [username, setUserName] = useState("")
    const [username, setUserName] = useState(null);

    useEffect (() => {
        // Untuk Mendapatkan token dari local storage
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if(token && user?.id) {
            setUserName({
            id: user.id,
            username: user.username,
            role: user.role,
            });
            // setUserName(getUsername(token));
        }else {
            setUserName(null);
        }
    },[]);

    return username;
}

export default useLogin;