import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getOrderItemsByOrderId } from "../../services/paymentService";
import NavbarHome from "../../components/layouts/NavbarHome";


const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [keranjang, setKeranjang] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderData = await getOrderById(id);
        const itemData = await getOrderItemsByOrderId(id);
        setOrder(orderData);
        setItems(itemData);
      } catch (error) {
        console.error("Gagal mengambil data detail pesanan:", error);
        alert("Gagal mengambil data pesanan.");
      }
    };

    if (id) fetchOrderData();
  }, [id]);

  if (!order) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <>
      <NavbarHome keranjang={keranjang} setKeranjang={setKeranjang} />
    <div className="pt-20 px-5 lg:px-20 py-10 bg-gray-50 min-h-screen">

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Detail Pesanan 
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-2 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              <span className="font-semibold text-green-600">
                {order.status}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">
                Status Pembayaran:
              </span>{" "}
              <span className="font-semibold text-blue-600">
                {order.payment_status}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Total Harga:</span>{" "}
              <span className="font-semibold text-gray-800">
                Rp {Number(order.total_price).toLocaleString("id-ID")}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Tipe Order:</span>{" "}
              <span className="capitalize font-semibold text-gray-700">
                {order.order_type}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Dibuat pada:</span>{" "}
              {new Date(order.created_at).toLocaleString("id-ID")}
            </p>
            {order.completed_at && (
              <p>
                <span className="font-medium text-gray-600">
                  Selesai pada:
                </span>{" "}
                {new Date(order.completed_at).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Item dalam Pesanan
        </h2>

        {items.length === 0 ? (
          <div className="text-gray-600 text-center py-10">
            Tidak ada item dalam pesanan ini.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    {item.product_name || `Produk #${item.product_id}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    x <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Pesanan:{" "}
                    <span className="font-medium text-gray-800">
                      Rp {Number(item.subtotal_price).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderDetailPage;
