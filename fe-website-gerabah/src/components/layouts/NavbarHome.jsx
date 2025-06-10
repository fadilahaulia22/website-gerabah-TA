import useLogin from "../../hooks/useLogin";
import Button from "../elements/Button";
import { FaBagShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router";
import { fetchCart } from "../../services/cartService";
import { resetCart, setCart } from "../../redux/slice/cartSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const NavbarHome = ({ keranjang, setKeranjang }) => {
  const cart = useSelector((state) => state.cart.data);
  const [totalCart, setTotalCart] = useState(0);

  const username = useLogin();
  const dispatch = useDispatch();

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.qty, 0);
    setTotalCart(sum);
  }, [cart]);


  useEffect(() => {
  if (username) {
    fetchCart()
      .then((items) => dispatch(setCart(items)))
      .catch(() => dispatch(resetCart()));
  } else {
    dispatch(resetCart());
  }
  }, [username, dispatch]);


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("cart");
  //   dispatch({type: "cart/clearCart"});
  //   window.location.href = "/";
  // };

  const handleLogout = () => {
  dispatch(resetCart());
  localStorage.removeItem("token");
  window.location.href = "/";
  };

  if (username === undefined){
    return (
    <div className="text-center p-4">
      <span className="text-gray-500">Loading...</span>
    </div>
  );
}


  return (
    <nav className="w-full fixed top-0 z-50 bg-orange-200 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-800 tracking-wide">
          OemahGerabah
        </Link>

        {/* Menu links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/galeri" className="hover:text-orange-500 transition">Lihat Galeri</Link>
          <Link to="/products" className="hover:text-orange-500 transition">Produk</Link>
          <Link to="/booking-kunjungan" className="hover:text-orange-500 transition">Edukasi</Link>
        </div>

        {/* Right section */}
        <div className="flex gap-4 items-center">
          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => setKeranjang(!keranjang)}>
            <FaBagShopping size={24} className="text-gray-800" />
            {totalCart > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCart}
              </span>
            )}
          </div>

          {/* Auth */}
          {username ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <FaUser size={20} />
                <span className="text-sm font-medium"> Hallo{username}</span>
              </div>
              <Button classname="bg-red-600 text-white text-sm px-3 py-1" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <Button classname="bg-orange-500 text-white text-sm px-3 py-1">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button classname="bg-gray-800 text-white text-sm px-3 py-1">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;