import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import Button from "../components/elements/Button";
import CardProduct from "../components/fragments/CardProduct";
import { getDetilProduct, getProducts } from "../services/product.services";
import { addToCart } from "../redux/slice/cartSlice";
import Cart from "../components/Fragments/Cart";
import NavbarHome from "../components/layouts/NavbarHome";
import useLogin from "../hooks/useLogin";
import { addToCartDB } from "../services/cartService";

const DetilProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const username = useLogin();

  const [keranjang, setKeranjang] = useState(false);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
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

  useEffect(() => {
    // Ambil detail produk berdasarkan id
    getDetilProduct(id, (data) => {
      setProduct(data);

      // Ambil produk lain dengan kategori yang sama
      getProducts((all) => {
        const filtered = all.filter(
          (item) => item.category_id === data.category_id && item.id !== data.id
        );
        setRelatedProducts(filtered);
        setAllProducts(all);
      });
    });
  }, [id]);

  const handleRating = (rate) => {
    setRating(rate);
    // Kirim rating ke backend kalau kamu sudah support itu
    // postRating(product.id, rate)
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <>
    <NavbarHome keranjang={keranjang} setKeranjang={setKeranjang}/>

    {/* keranjang */}
    {keranjang && (
        <div className="fixed z-[999] top-0 right-0">
            <Cart products={allProducts} setKeranjang={setKeranjang}/>
        </div>
    )}


    <div className="font-primary mt-[100px] px-5 lg:px-20 py-10">
         <Link
            to="/products"
            className="inline-block -mt-4 mb-6 text-blue-600 hover:underline hover:text-blue-800 font-semibold"
            >
            ← Kembali ke Beranda
        </Link>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full lg:w-[40%] h-auto object-cover rounded-lg"
        />
        <div className="w-full lg:w-[60%]">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-3 text-lg font-semibold">Rp {product.price}</p>
          <p className="mt-1 text-sm">Stok: {product.stock}</p>
          <div className="mt-4">
            <span className="font-semibold">Beri Rating:</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={25}
                  className="cursor-pointer"
                  color={star <= rating ? "#f59e0b" : "#d1d5db"}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Button
              classname="items-center justify-between bg-black text-xs md:text-sm w-full md:w-[40%]"
              onClick={handleAddToCart}
            >
              {/* <CiShoppingCart size={20} /> */}
              Add to cart
            </Button>
            <Link to={`/checkout/${product.id}`} className="w-full md:w-[40%]">
              <Button classname="bg-green-600 w-full">Beli Sekarang</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Produk Lainnya */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-5">
          Produk Lainnya di Kategori yang Sama
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {relatedProducts.map((p) => (
            <CardProduct key={p.id}>
              <CardProduct.Header image_url={p.image_url} id={p.id} />
              <CardProduct.Body name={p.name} price={p.price} stock={p.stock} />
              <CardProduct.Footer id={p.id} />
            </CardProduct>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default DetilProductPage;
