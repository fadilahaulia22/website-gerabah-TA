import {Link} from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import Button from "../elements/Button";
import { addToCart } from "../../redux/slice/cartSlice";

const CardProduct  = (props) => {
    const {children} = props
    return (
        <div className="flex flex-col justify-between font-primary w-[170px]  md:w-[220px] border border-gray-300 rounded-xl">
            {children}
        </div>
    )
}

const Header = (props) => {
    const { image_url, id,} = props;
    return (
        <Link to = {`/products/${id}`}>
            <img src= {image_url } alt="product" className=" bg-center h-[200px]  mx-auto bg-cover p-2" />
        </Link>
    )
}

const Body = (props) => {
    const {price,name,stock} = props;
    return (
        <div className="px-2 md:px-5 pb-2 md:pb-5">
            <a href="" className="flex items-center justify-between">
                {/* <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-tight">{category}</span> */}
                <span className="text-xs md:text-sm text-black font-semibold tracking-tight">Rp {price}</span>
            </a>
            <p className="text-sm font-semibold tracking-tight text-black">{name}</p>
            <span className="text-xs flex items-center gap-2">
                <FaStar size={15} color="#f59e0b" />
                {/* {rating} | */}
                 {stock}</span>
        </div>
    )
}


const Footer = (props) => {
    const {id} = props;
    const dispatch = useDispatch()
    return (
        <div className="flex flex-col items-center px-2 md:px-5 pb-2 md:pb-5">
        <Button classname="flex items-center justify-between bg-black text-xs md:text-sm w-full" onClick={() =>    dispatch(addToCart({id,qty:1}))}>
            <CiShoppingCart size={20} />
            Add to card
        </Button>
    </div>
    )
}

CardProduct.Header = Header;
CardProduct.Body = Body;
CardProduct.Footer = Footer;

export default CardProduct;
