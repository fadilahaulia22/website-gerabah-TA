import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import {
  decreesItem,
  increesItem,
  removeItem,
} from "../../redux/slice/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { removeItemDB, updateCartItemDB } from "../../services/cartService";

const Cart = ({ products, setKeranjang }) => {
  const cart = useSelector((state) => state.cart.data);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (products.length > 0 && cart.length > 0) {
      const sum = cart.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.id);
        return acc + product.price * item.qty;
      }, 0);
      setTotalPrice(sum);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const notify = () => toast.info("Maaf belum bisa 😓");

  return (
    <div className="fixed z-[999] bg-white shadow-lg h-full w-full md:w-[450px] top-0 right-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">Shopping Cart</h1>
        <button onClick={() => setKeranjang(false)}>
          <IoClose size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {totalPrice === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-500 text-xs">
                      Rp{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-7 h-7 text-sm border rounded hover:bg-gray-100"
                      onClick={async () =>{
                        const newQty = item.qty - 1;
                        if (newQty >= 1) {
                          await updateCartItemDB(item.id, newQty);
                          dispatch(decreesItem({ id: item.id }));
                        } else {
                          await removeItemDB(item.id);
                          dispatch(removeItem({ id: item.id }));
                        }
                      }}
                    >
                      −
                    </button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      className="w-7 h-7 text-sm border rounded hover:bg-gray-100"
                      // onClick={() => dispatch(increesItem({ id: item.id }))}
                      onClick={async() =>{
                        const newQty = item.qty + 1;
                        await updateCartItemDB(item.id, newQty);
                        dispatch(increesItem({ id: item.id }));
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      Rp{(product.price * item.qty).toLocaleString()}
                    </span>
                  <button
                     onClick={async () => {
                  try {
                    await removeItemDB(item.id); // hapus dari DB
                    dispatch(removeItem({ id: item.id, qty: item.qty })); // hapus dari redux
                  } catch (err) {
                    console.error("Gagal hapus dari keranjang:", err);
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                      <MdOutlineDeleteOutline size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex justify-between font-medium text-base mb-3">
          <span>Total</span>
          <span>Rp{totalPrice.toLocaleString()}</span>
        </div>
        <button
          onClick={notify}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
        >
          Checkout
        </button>
        <ToastContainer position="top-center" hideProgressBar limit={1} />
      </div>
    </div>
  );
};

export default Cart;
