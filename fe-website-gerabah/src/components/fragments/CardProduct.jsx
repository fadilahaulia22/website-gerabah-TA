import {Link} from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import Button from "../elements/Button";
import { addToCart } from "../../redux/slice/cartSlice";
import useLogin from "../../hooks/useLogin";
import { addToCartDB } from "../../services/cartService";


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
    const {price,name,stock,rating, totalRatings} = props;
    return (
        <div className="px-2 md:px-5 pb-2 md:pb-5">
            <a href="" className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-black font-semibold tracking-tight">Rp {price}</span>
            </a>
            <p className="text-sm font-semibold tracking-tight text-black">{name}</p>

                {/* {rating} | */}
            <span className="text-xs flex items-center gap-2">
                <FaStar size={15} color="#f59e0b" />
                        {rating ? `${Number(rating).toFixed(1)} (${totalRatings})` : "0"}
                 </span>
                 
                 {/* Stock */}
                <span className="text-xs text-gray-600">Stok: {stock}</span>
        </div>
    )
}


const Footer = ({ id }) => {
  const dispatch = useDispatch();
  const username = useLogin(); // Ambil username dari token (null jika belum login)

  const handleAddToCart = async () => {
    if (!username) {
      // Jika belum login, redirect ke halaman login
      window.location.href = "/login";
      return;
    }

    try {
      // Tambah ke database via API
      await addToCartDB(id, 1);
      // Tambah ke Redux store agar muncul di UI
      dispatch(addToCart({ id, qty: 1 }));
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Gagal menambahkan ke keranjang.");
    }
  };

  return (
    <div className="flex flex-col items-center px-2 md:px-5 pb-2 md:pb-5">
      <Button
        classname="flex items-center justify-between bg-black text-xs md:text-sm w-full"
        onClick={handleAddToCart}
      >
        <CiShoppingCart size={20} />
        Add to cart
      </Button>
    </div>
  );
};




CardProduct.Header = Header;
CardProduct.Body = Body;
CardProduct.Footer = Footer;

export default CardProduct;