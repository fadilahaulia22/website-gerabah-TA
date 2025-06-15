// src/pages/CheckoutPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder, createOrderItem, createPayment } from "../../services/paymentService";
import { getDetilProduct } from "../../services/product.services";
import NavbarHome from "../../components/layouts/NavbarHome";
import useLogin from "../../hooks/useLogin";

const CheckoutPage = () => {
  
  const { id } = useParams(); // id produk
  const location = useLocation();

  const navigate = useNavigate();
  const [keranjang, setKeranjang] = useState(false);
  const [product, setProduct] = useState(null);
  const [estimasiSampai, setEstimasiSampai] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useLogin();
  const userId = user?.id;

    // Jika datang dari /checkout (pakai state)
  const items = location.state?.items || [];
  const total = location.state?.total || 0;


  useEffect(() => {
    console.log("user id:", userId);
  }, [userId]);

  useEffect(() => {
    if (id) {
      //  Mode checkout 1 produk (detail)
    getDetilProduct(id, (data) => {
      setProduct(data);
      const estimasi = new Date();
      estimasi.setDate(estimasi.getDate() + 3); // estimasi 3 hari pengiriman
      setEstimasiSampai(estimasi.toLocaleDateString("id-ID"));
    });
  }else if(items.length > 0){
    // Mode checkout banyak produk
      const estimasi = new Date();
      estimasi.setDate(estimasi.getDate() + 3);
      setEstimasiSampai(estimasi.toLocaleDateString("id-ID"));
  }
  }, [id, items]);

  const handleBayar = async () => {
    
    if (!userId) {
      alert("User belum login.");
      return;
    }

    setLoading(true);
    try {
      if (id && product) {
      // 1. Simulasi membuat order
      const order = await createOrder({
        user_id: parseInt(userId),
        order_type: product.is_custom ? "custom" : "biasa",
        status: "diproses",
        total_price: product.price,
        payment_status: "lunas",
      });

      // 2. Tambah order_item
      await createOrderItem({
        order_id: order.id,
        product_id: product.id,
        quantity:1,
        subtotal_price: product.price,
      });

      // 3. Simulasi pembayaran
      await createPayment({
        order_id: order.id,
        payment_type: "full",
        amount: product.price,
        payment_proof_url: "https://i.pinimg.com/736x/c3/56/48/c35648c28d8ad718c2c14a296da0f0cf.jpg", // dummy URL
      });

      } else if (items.length > 0) {
        // Mode checkout banyak produk
        const order = await createOrder({
          user_id: parseInt(userId),
          order_type: "biasa",
          status: "diproses",
          total_price: total,
          payment_status: "lunas",
        });

        for (const item of items) {
          await createOrderItem({
            order_id: order.id,
            product_id: item.id,
            quantity: item.qty,
            subtotal_price: item.price * item.qty,
          });
        }

        await createPayment({
          order_id: order.id,
          payment_type: "full",
          amount: total,
          payment_proof_url: "https://dummyimage.com/bukti.jpg",
        });
      } else {
        alert("Tidak ada produk untuk dibayar.");
        return;
      }


      alert("Pembayaran berhasil!");
      navigate("/orders");
    } catch (error) {
      console.error("Gagal memproses pembayaran", error);
      alert("Pembayaran gagal.");
    } finally {
      setLoading(false);
    }
  };

  // Render
  if (!product && items.length === 0) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <>
      <NavbarHome keranjang={keranjang} setKeranjang={setKeranjang}/>
    <div className="pt-20 px-5 lg:px-20 py-10">

      <h1 className="text-2xl font-bold mb-5">Checkout Produk</h1>

      <div className="bg-white shadow p-5 rounded-lg space-y-3">
        {product ? (
          <>
            <p><strong>Produk:</strong> {product.name}</p>
            <p><strong>Harga:</strong> Rp {product.price}</p>
          </>
        ) : (
          items.map((item, index) => (
            <div key={index}>
              <p><strong>{item.name}</strong> x {item.qty}</p>
              <p className="text-sm text-gray-600">Rp{(item.price * item.qty).toLocaleString()}</p>
              <hr />
            </div>
          ))
        )}

        <p><strong>Estimasi Sampai:</strong> {estimasiSampai}</p>

        <div className="flex justify-between mt-2 font-semibold">
          <span>Total:</span>
          <span>Rp{(product ? product.price : total).toLocaleString()}</span>
        </div>

        <button
          onClick={handleBayar}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
