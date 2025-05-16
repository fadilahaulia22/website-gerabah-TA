import { useEffect, useState } from "react";
import useLogin from "../../hooks/useLogin";
import { FaBagShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Button from "../elements/Button";


const Navbar = ({ keranjang, setKeranjang }) => {
  const cart = useSelector((state) => state.cart.data);
  const [totalCart, setTotalCart] = useState(0);
  const username = useLogin();

  // Untuk Menghapus data didalam Local Storage dan Keluar daari halaman Product/Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Menambah Jumlah Barang Pada Keranjang
  useEffect(() => {
    const sum = cart.reduce((acc, item) => {
      return acc + item.qty;
    }, 0);
    setTotalCart(sum);
  }, [cart]);


  return (
    <div>
      {/* Navbar */}
      <nav className="w-full fixed top-0 z-[10]">
        <div className="w-full py-5 px-5 md:px-10 bg-[#FEFEFE] border-b shadow-sm border-black flex justify-between items-center font-bold  ">
          <span className="font-bold text-xl uppercase">OemahGerabah</span>
          <div className="flex gap-5 items-center">
              <div className="relative">
                  {/* Shopping Cart Icon */}
                  <FaBagShopping size={28} className="text-black" onClick={() => setKeranjang(!keranjang)} />
                  <div>
                      {/* Badge showing the number of items in the cart */}
                      <div className="absolute top-[-8px] left-[12px] h-6 w-6 flex items-center justify-center bg-red-700 border border-white rounded-full">
                      <p className="text-xs text-white">{totalCart}</p>
                      </div>
                  </div>
              </div>
              <div className="hidden md:block">
              <div className="flex gap-5 items-center">
                <div className="flex items-center gap-2">
                    <FaUser size={25} className="text-black"/>
                    <span>{username}</span>
                </div>
                <Button classname="bg-black text-white" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
              </div>
          </div>
        </div>
      </nav>
      {/* Akhir Navbar */}
    </div>
  );
};

export default Navbar;