import { useEffect, useRef, useState } from "react"
import Button from "../elements/Button"
import { login } from "../../services/auth.service"
import InputForm from "../elements/InputForm"

const FormLogin = () => {
    const [loginFail, setLoginFail] = useState("")

    const usernameRef = useRef(null);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    //untuk menangkap inputan yang nantinya akan disimpan ke local storage
    const handleLogin = (event) => {
    
        console.log("Submit form jalan... ✅");
    
        event.preventDefault()
        const data = {
            username: event.target.username.value,
            password: event.target.password.value,
        };
        login(data,(status,res)=>{
            if(status){
                // const { token, user } = res;
                const { token, username, role } = res;

                const user = { username, role }

                // Simpan token dan info user ke localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                // const role = user.role?.toLowerCase();

                if (role.toLowerCase() === "pemilik") {
                    window.location.href = "/dashboard-pemilik";
                } else if (role.toLowerCase() === "pokdarwis") {
                    window.location.href = "/dashboard-pokdarwis";
                } else {
                    window.location.href = "/products";
                }

            }else{
                 setLoginFail(res?.response?.data || "Login gagal.");
                 console.error(res?.response?.data);
            }
        });
    };


    return(
        <form onSubmit={handleLogin}>
            <InputForm label = "Username" type="text" placeholder="Jhon Doe" name="username" ref = {usernameRef} />
            <InputForm label = "Password" type="password" placeholder="********" name="password" />
            <Button classname="bg-black w-full" type="submit">Login</Button>
            {loginFail ? <p className="text-red-500 text-center mt-5">{loginFail}</p> : null}
        </form>
    )

}
export default FormLogin;