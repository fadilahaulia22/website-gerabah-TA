import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import Button from "../components/elements/Button";
import CardProduct from "../components/fragments/CardProduct";
import { getDetilProduct, getProducts } from "../services/product.services";
import { addToCart } from "../redux/slice/cartSlice";
import useLogin from "../hooks/useLogin";
import { addToCartDB } from "../services/cartService";

const DetilProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const username = useLogin();

  const [visibleReviews, setVisibleReviews] = useState(5);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const handleAddToCart = async () => {
    if (!product) return;

      if (!username) {
        // Jika belum login, redirect ke halaman login
        window.location.href = "/login";
        return;
      }
  
      try {
        // Tambah ke database via API
        await addToCartDB(id, 1);
        // Tambah ke Redux store agar muncul di UI
        dispatch(addToCart({ id: product.id, qty: 1 }));
      } catch (error) {
        console.error("Gagal menambahkan ke keranjang:", error);
        alert("Gagal menambahkan ke keranjang.");
      }
    };

  useEffect(() => {
    // Ambil detail produk berdasarkan id
    // getDetilProduct(id, (data) => {
      getDetilProduct(id).then((data) => {
        console.log("Data produk:", data); // Debugging
      setProduct(data);

      if (data?.category_id) {
      getProducts().then((all) => {
        console.log("Semua produk:", all);
        const filtered = all.filter(
          (item) => parseInt(item.category_id) === parseInt(data.category_id) && item.id !== data.id
        );
        console.log("Produk terkait:", filtered);
        setRelatedProducts(filtered);
      });
    } else {
      setRelatedProducts([]);
    }

      // Ambil produk lain dengan kategori yang sama
      // getProducts((all) => {
      //   console.log("Semua produk:", all);
      //   const filtered = all.filter(
      //     (item) => item.category_id === data.category_id && item.id !== data.id
      //   );
      //   console.log("Produk terkait:", filtered);
      //   setRelatedProducts(filtered);
      // });
  });
  }, [id]);


  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="font-primary px-5 lg:px-20 py-10">
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Rating & Komentar</h3>

            {product.rating ? (
              <div className="flex items-center gap-2 text-sm mb-4">
                <FaStar color="#f59e0b" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.total_ratings} ulasan)</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Belum ada rating.</p>
            )}

            {product.reviews?.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-2">
                Menampilkan {Math.min(visibleReviews, product.reviews.length)} dari {product.reviews.length} komentar
              </p>
              {product.reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={index} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <FaStar size={14} color="#f59e0b" />
                    <span className="font-medium">{review.rating}</span>
                    <span className="text-gray-500">oleh {review.username}</span>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
              {visibleReviews < product.reviews.length && (
                <button
                  onClick={() => setVisibleReviews((prev) => prev + 5)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat lebih banyak komentar...
                </button>
              )}
            </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada komentar.</p>
            )}

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
              <Button classname="bg-green-600 w-full">Checkout</Button>
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
          {relatedProducts.length > 0 ? (
            relatedProducts.map((p) => (
              <CardProduct key={p.id}>
                <CardProduct.Header image_url={p.image_url} id={p.id} />
                <CardProduct.Body name={p.name} price={p.price} stock={p.stock} />
                <CardProduct.Footer id={p.id} />
              </CardProduct>
            ))
            ) : (
                <p className="text-gray-500 col-span-full">Tidak ada produk lain di kategori ini.</p>
          )}
        </div>
      </div>
    </div>
    // </>
  );
};

export default DetilProductPage;
