import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const login = (data,callback)=>{
    axios.post("http://localhost:3000/api/login", data)
    .then(res => {
        console.log("Login response:", res);
        callback(true, res.data)
    })
    .catch(err => callback(false, err))
}

export const getUsername = (token)=>{
    const decode = jwtDecode(token);
    return decode.username;
}