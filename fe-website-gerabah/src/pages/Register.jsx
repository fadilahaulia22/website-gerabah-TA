import FormRegister from "../components/fragments/FromRegister"
import AuthLayouts from "../components/layouts/AuthLayouts"

const Register = () => {
    return(
        <AuthLayouts title = "Register" type = "register">
            <FormRegister/>
        </AuthLayouts>
    )
}
export default Register