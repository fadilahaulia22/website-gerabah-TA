import { useState } from "react";
import Button from "../elements/Button";
import InputForm from "../elements/InputForm";
import { useNavigate } from "react-router";

const FormRegister = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newError = {};

        if (!username.trim()) newError.username = "Username wajib diisi";
        if (!email.trim()) {
            newError.email = "Email wajib diisi";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) newError.email = "Format email tidak valid";
        }

        if (!password) {
            newError.password = "Password wajib diisi";
        } else if (password.length < 6) {
            newError.password = "Password minimal 6 karakter";
        }
      
        if (!confirmPassword) {
            newError.confirmPassword = "Konfirmasi password wajib diisi";
        } else if (password !== confirmPassword) {
            newError.confirmPassword = "Konfirmasi tidak cocok dengan password";
        }

        if (!role) {
            newError.role = "Role wajib dipilih";
        }

          //setError
          setError(newError);

          // Jika ada error, hentikan submit
          if (Object.keys(newError).length > 0) return;


        const userData = {
            username,
            email,
            password,
            role,
        };

        console.log(userData)

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Redirect to login page after successful registration
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Registration failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again.");
        }
    };


    return(
        <form onSubmit={handleSubmit}>
            <InputForm label = "username" type="text" placeholder="Insert your Name here...." name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            {error.username && <p className="text-red-500 text-sm">{error.username}</p>}

            <InputForm label = "Email" type="email" placeholder="example@gmail.com" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

            <InputForm label = "Password" type="password" placeholder="********" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

            <InputForm label = "Confirm Password" type="password" placeholder="********" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            {error.confirmPassword && (
                <p className="text-red-500 text-sm">{error.confirmPassword}</p>
            )}

            {/* Role dropdown */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Role</label>
                <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                >
                <option value="">-- Pilih Role --</option>
                <option value="pengunjung">Pengunjung/Pembeli</option>
                </select>
                {error.role && <p className="text-red-500 text-sm">{error.role}</p>}
            </div>

            <Button classname="bg-black w-full" type ="submit">Register</Button>
        </form>
    )
}
 export default FormRegister;