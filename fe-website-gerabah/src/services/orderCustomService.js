const BASE_URL = "http://localhost:3000/api/custom";

/**
 * Mengirim form data (dengan image) untuk membuat custom order.
 * @param {FormData} formData - Data form berisi description, image, jumlahJenis, totalHarga.
 * @returns {Promise<Object>}
 */
export const createOrder = async (formData) =>  {
  const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/custom-orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal membuat custom order");
    }

    return await res.json();
};


export const getAllCustomOrders = async (token) => {
  const res = await fetch(`${BASE_URL}/getCustom-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil data pesanan custom");
  }
  return res.json();
};

export const updateCustomOrderStatus = async (orderId, status, token) => {
  const res = await fetch(`${BASE_URL}/custom-orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Gagal memperbarui status");
  }
  return res.json();
};

export const getJumlahCustomOrder = async (callback) => {
  try {
    const res = await fetch(`${BASE_URL}/jumlah-custom-order`);
    const data = await res.json();
    callback(data.total);
  } catch (err) {
    console.error("Gagal mengambil jumlah custom order:", err);
    callback(0);
  }
};
