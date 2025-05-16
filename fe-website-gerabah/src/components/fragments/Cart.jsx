import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { decreesItem, increesItem, removeItem } from "../../redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = ({products, setKeranjang}) => {

    const cart = useSelector((state) => state.cart.data);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    // Untuk Membuat Total Price dan disimpan didalam Locale Storage
    useEffect (() => {
        if(products.length > 0 && cart.length > 0){
            const sum = cart.reduce((acc, item) => {
                const product = products.find((product) => product.id === item.id);
                return acc + product.price * item.qty;
            }, 0)
            setTotalPrice(sum)
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart])

    // Notifikasi Checkout
    const notify = () => toast.info("Maaf belum bisa😓");

  return (
    <div className="w-[100%] h-full  mx-auto flex flex-col justify-between">
        <div className="overflow-y-scroll">
        <div className="flex items-center justify-between">
            <IoClose  size={20} onClick={() => setKeranjang(false)}/>
            <h1 className="font-bold">Shopping Cart</h1>
        </div>
        {totalPrice === 0 ? <p className=" text-center text-lg">Your cart is empty</p> : null}
        {cart.map((item) => {
                    const product = products.find((product) => product.id === item.id);
                    return (
                        <div key={item.id} className=" border border-black mb-2">
                        <div className="flex items-center justify-between p-3" key={item.id}>
                            <div className="flex items-center">
                                <img className="h-20 w-20" src={product.image } alt={product.title} />
                                <span className="text-xs">{product.title.substring(0, 20)}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="flex items-center gap-2">
                                    <button className="border border-black p-3 " onClick={() => dispatch(decreesItem({id: item.id}))}>-
                                    </button>
                                    <span className="border border-black p-3">{item.qty}</span>
                                    <button className="border border-black p-3" onClick={() => dispatch(increesItem({id: item.id}))}>+</button>
                                </div>
                                <button onClick={() => dispatch(removeItem({ id: item.id, qty: item.qty}))}>
                                    <MdOutlineDeleteOutline />
                                </button>
                                <span>Rp{(product.price * item.qty)}</span>
                            </div>
                        </div>
                        </div>
                    );
                })}
            
        </div>
                <div>
                    <div className="flex items-center justify-between">
                        <span>Total Price</span>
                        <span>Rp{totalPrice}</span>
                    </div>
                    <button onClick={notify} className="bg-black w-full text-white py-5">
                        <ToastContainer
                        position="top-center"
                        hideProgressBar
                        limit={1}
                         />
                        CheckOut</button>
                </div>
        </div>
  )
}

export default Cart