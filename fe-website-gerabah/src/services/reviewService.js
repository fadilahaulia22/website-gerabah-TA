const BASE_URL = "http://localhost:3000/api/review";


// Ambil semua review + rata-rata rating dari satu produk
export const getReviewsByProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/product/${productId}`);
  if (!res.ok) throw new Error("Gagal mengambil review");
  return await res.json(); // { average, reviews }
};

export const getReviewsByUser = async (token) => {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Gagal mengambil review");
  return await res.json(); // Array of reviews
};

// Tambah review baru
export const addReview = async (data, token) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal menambahkan review");
  return await res.json();
};

// Update review
export const updateReview = async (id, data, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal memperbarui review");
  return await res.json();
};