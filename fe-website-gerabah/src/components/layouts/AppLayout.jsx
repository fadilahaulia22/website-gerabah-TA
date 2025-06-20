import { Outlet } from "react-router";
import Cart from "../Fragments/Cart";
import NavbarHome from "./NavbarHome";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/product.services";

const AppLayout = () => {
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ambil semua produk untuk cart
    getProducts().then(setProducts);
  }, []);

  return (
    <>
      <NavbarHome />
      {isCartOpen && (
        <div className="fixed z-[999] top-0 right-0">
          <Cart products={products} />
        </div>
      )}
      <main className="pt-15">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
