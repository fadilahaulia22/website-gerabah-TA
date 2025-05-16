import { useRouteError } from "react-router";
import Button from "../components/elements/Button";

const ErrorPage = () => {
    const error = useRouteError();

    return(
        <div className="h-screen flex justify-center items-center flex-col">
            <h1 className="text-5xl font-bold">Oooops!</h1>
            <p className="text-xl my-5">Sorry, an unexpected error has occurated</p>
            <p className="text-xl">{error.statusText || error.massage}</p>
            <Button>Go Back{window.location.href="/login"}</Button>
        </div>
    )
}
 export default ErrorPage;