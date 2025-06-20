import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getOrderItemsByOrderId, getOrdersByUserId } from "../../services/paymentService";
import { addReview, getReviewsByUser, updateReview } from "../../services/reviewService";

const OrdersPage = () => {
  const [ordersWithItems, setOrdersWithItems] = useState([]);
  // const [keranjang, setKeranjang] = useState(false);
  const [showRating, setShowRating] = useState(null); 
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]); 
  const [editReviewId, setEditReviewId] = useState(null);


  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  console.log("user id : ",userId)
  useEffect(() => {
    const fetchOrders = async () => {
       try {
        const orders = await getOrdersByUserId(userId);
        const ordersWithDetails = await Promise.all(
          orders.map(async (order) => {
            const items = await getOrderItemsByOrderId(order.id);
            return {
              ...order,
              items, // array of order_items
            };
          })
        );
        setOrdersWithItems(ordersWithDetails);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil pesanan.");
      }
    };


    const fetchReviews = async () => {
      try {
        const data = await getReviewsByUser(token);
        setReviews(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchOrders();
    fetchReviews();
  }, [userId, token]);


   const fetchUserReviews = async () => {
    try {
      const data = await getReviewsByUser(token);
      setReviews(data);
    } catch (err) {
      console.error("Gagal refresh review:", err.message);
    }
  };

  if (!userId) {
    return <div className="text-center py-20 text-red-500 font-bold">Anda belum login.</div>;
  }

  const handleSubmitRating = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    const payload = {
      product_id: productId,
      rating: selectedRating,
      comment,
    };

    if (editReviewId) {
      await updateReview(editReviewId, payload, token);
      alert("Review diperbarui!");
    } else {
      await addReview(payload, token);
      alert("Review berhasil ditambahkan!");
    }

    // Reset
      setShowRating(null);
      setSelectedRating(0);
      setComment("");
      setEditReviewId(null);
    
      fetchUserReviews(); // refresh review
  } catch (err) {
    alert("Gagal mengirim review.");
    console.log("error :", err);
  }
};

  const handleBuyAgain = (productId) => {
    // Bisa langsung arahkan ke detail produk
    navigate(`/products/${productId}`);
  };

  return (
    <div className="px-5 lg:px-20 py-10">
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan Anda</h1>

      {ordersWithItems.length === 0 ? (
        <div className="text-gray-600">Belum ada pesanan.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {ordersWithItems.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-5 border hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    order.status === "diproses"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.items.map((item) => {
                const existing = reviews.find(r => r.product_id === item.product_id);
                return (
                <div key={item.id} className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-4">
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
                    x{" "}
                     <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Pesanan:{" "}
                    <span className="font-medium text-gray-800">
                      Rp {Number(item.subtotal_price).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                          onClick={() => {
                            setShowRating(item.product_id);
                            if (existing) {
                              setSelectedRating(existing.rating);
                              setComment(existing.comment);
                              setEditReviewId(existing.id);
                            } else {
                              setSelectedRating(0);
                              setComment("");
                              setEditReviewId(null);
                            }
                          }}
                          className={`text-sm px-3 py-1 rounded ${
                            existing ? "bg-orange-200 hover:bg-orange-300" : "bg-yellow-200 hover:bg-yellow-300"
                          }`}
                        >
                          {existing ? "Edit Review" : "Nilai"}
                        </button>

                    <button
                      onClick={() => handleBuyAgain(item.product_id)}
                      className="text-sm px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
                    >
                      Beli Lagi
                    </button>
                </div>

                  {showRating === item.product_id && (
                    <div className="mt-3 border-t pt-3">
                      <div className="flex gap-2 items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setSelectedRating(star)}
                            className={`cursor-pointer text-xl ${
                              star <= selectedRating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <textarea
                        placeholder="Tulis ulasan Anda..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border rounded p-2 text-sm"
                      ></textarea>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setShowRating(null)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSubmitRating(item.product_id)}
                          className="text-sm px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
        

              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
