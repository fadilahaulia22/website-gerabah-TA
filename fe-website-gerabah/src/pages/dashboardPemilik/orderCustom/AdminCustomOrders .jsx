import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCustomOrders, updateCustomOrderStatus } from "../../../services/orderCustomService";


const AdminCustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllCustomOrders(token);
      setOrders(data);
    } catch (error) {
      console.error("Gagal fetch pesanan custom", error);
      toast.error("Gagal mengambil pesanan custom");
    }
  };

  const allowedStatus = ["Menunggu Konfirmasi", "Sedang Diproses", "Selesai", "Ditolak"];

  const handleChangeStatus = async (orderId, newStatus) => {
      console.log("Mengubah status pesanan ID:", orderId, "->", newStatus);

    try {
      await updateCustomOrderStatus(orderId, newStatus, token);
      toast.success("Status berhasil diperbarui");
      fetchOrders();
    } catch (error) {
      console.error("Gagal update status", error);
      toast.error("Gagal memperbarui status");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 Pesanan Custom</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow-sm transition"
        >
          ← Kembali
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Tidak ada pesanan custom.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-6 shadow bg-white hover:shadow-lg transition"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className="mb-4 lg:mb-0 text-sm">
                  <p className="font-bold text-lg text-blue-700">
                    #Pesanan {order.id}
                  </p>
                  <p className="mt-1">Status: <span className="font-semibold">{order.status}</span></p>
                  <p>Total Harga: <strong>Rp{order.total_price.toLocaleString()}</strong></p>
                  <p>Jumlah Jenis: {order.jumlah_jenis}</p>
                  <p>Ukuran: {order.ukuran} | Warna: {order.warna} | Bahan: {order.bahan}</p>
                  <p>Metode Pembayaran: {order.metode_pembayaran}</p>
                  <p>Pengiriman: {order.metode_pengiriman}</p>
                  <p>Tanggal Kirim: {order.delivery_date?.split("T")[0] || "-"}</p>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <label htmlFor={`status-${order.id}`} className="text-sm font-medium">
                    Ubah Status:
                  </label>
                  <select
                    id={`status-${order.order_id}`}
                    value={order.status}
                    onChange={(e) => handleChangeStatus(order.order_id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                     {allowedStatus.map((status) => (
                  <option key={status} value={status}>{status}</option>
          ))}
                  </select>
                </div>
              </div>

              {order.dp_payment_proof_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Contoh custom:</p>
                  <img
                    src={`http://localhost:3000${order.dp_payment_proof_url}`}
                    alt="contoh img"
                    className="w-40 rounded border"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomOrders;
