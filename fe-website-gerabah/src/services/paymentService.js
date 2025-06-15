const BASE_URL = "http://localhost:3000";

export const createOrder = async (data) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

    if (!res.ok) throw new Error("Gagal membuat order");

  return await res.json();
};

export const getOrdersByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/orders/user/${userId}`);
  if (!res.ok) throw new Error("Gagal mengambil data pesanan");
  return await res.json();
};

export const createOrderItem = async (data) => {
  const res = await fetch(`${BASE_URL}/api/order-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

    if (!res.ok) throw new Error("Gagal membuat order item");

  return await res.json();
};

export const getOrderById = async (orderId) => {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}`);
  if (!res.ok) throw new Error("Gagal mengambil detail pesanan");
  return await res.json();
};

export const getOrderItemsByOrderId = async (orderId) => {
  const res = await fetch(`${BASE_URL}/api/order-items/order/${orderId}`);
  if (!res.ok) throw new Error("Gagal mengambil item pesanan");
  return await res.json();
};

export const createPayment = async (data) => {
  const res = await fetch(`${BASE_URL}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal membuat pembayaran");
  return await res.json();
};
