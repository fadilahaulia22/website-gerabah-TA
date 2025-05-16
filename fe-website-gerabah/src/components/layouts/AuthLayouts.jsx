import { Link } from "react-router-dom";

const AuthLayouts = (props) => {

    const {children, title, type} = props;

    return(
        <div className="flex items-center justify-center gap-3 min-h-screen">
            <div className="w-full max-w-xs"> 
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="font-medium text-slate-500 mb-8">
                    Welcome, Please Enter Your Details</p>         
                    {children}
                    <Navigation type={type}/>
            </div>
        </div>
    )
}

const Navigation = ({type}) => {
    if(type === 'login'){
        return(
            <p className="text-sm text-center w-full my-3">
                Don't have an accout?
                <Link to="/register" className="font-bold">Register</Link>
            </p>
        )
    }else{
        return(
            <p className="text-sm text-center w-full my-3">
                Already have an account?
                <Link to="/" className="font-bold">Login</Link>
            </p>
        )
    }
}
export default AuthLayouts;