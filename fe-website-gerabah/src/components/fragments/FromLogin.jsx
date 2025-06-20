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
                const { token, id, username, role } = res;


                // Simpan token dan info user ke localStorage
                localStorage.setItem("token", token);
                // localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("user", JSON.stringify({ id, username, role }));
                localStorage.setItem("user_id", id);

                // const role = user.role?.toLowerCase();

                if (role.toLowerCase() === "pemilik") {
                    window.location.href = "/dashboard-pemilik";
                } else if (role.toLowerCase() === "pokdarwis") {
                    window.location.href = "/dashboard-pokdarwis";
                } else {
                    window.location.href = "/products";
                }

            }else{
                //  setLoginFail(res?.response?.data || "Login gagal.");
                //  console.error(res?.response?.data);
                const errorData = res?.response?.data;
                const errorMessage =
                    typeof errorData === "string"
                        ? errorData
                        : errorData?.error || errorData?.message || "Login gagal.";

                setLoginFail(errorMessage);
                console.error("Login gagal:", errorMessage);
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