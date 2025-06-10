import axios from "axios";

const API = "http://localhost:3000/api/cart";

export const fetchCart = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

export const addToCartDB = async (product_id, quantity = 1) => {
  return await axios.post(API, { product_id, quantity }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateCartItemDB = async (productId, quantity) => {
  return await axios.put(`${API}/${productId}`, 
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
};


export const removeItemDB = async (productId) => {
  return await axios.delete(`${API}/${productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
