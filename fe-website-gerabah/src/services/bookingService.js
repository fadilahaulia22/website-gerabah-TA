import axios from "axios";

const API = "http://localhost:3000/api";

export const createVisit = (data, callback, onError) => {
  axios
    .post(`${API}/visits`, data, {
      headers: {
        Authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "", // ✅ Kirim kosong jika tidak login
      },
    })
    .then((res) => callback(res.data))
    .catch((err) => {
      console.error("Booking error:", err);
      if (onError) onError(err);
    });
};
