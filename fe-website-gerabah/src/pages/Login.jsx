import FormLogin from "../components/fragments/FromLogin";
import AuthLayouts from "../components/layouts/AuthLayouts";

const Login = () => {
    return(
        <AuthLayouts title = "Login" type = "login">
            <FormLogin/>
        </AuthLayouts>
    )
}
export default Login;