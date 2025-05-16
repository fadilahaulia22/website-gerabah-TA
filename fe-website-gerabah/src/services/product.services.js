import axios from "axios";

const API = "http://localhost:3000/api"; 

export const getProducts = (callback) => {
  axios.get(`${API}/products`)
    .then(res => callback(res.data))
    .catch(err => console.error(err));
};

export const getDetilProduct = (id, callback) => {
  axios.get(`${API}/products/${id}`)
    .then(res => callback(res.data))
    .catch(err => console.error(err));
};

export const addProduct = (formData, callback) => {
  axios.post(`${API}/products`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
    }
  })
  .then(res => callback(res.data))
  .catch(err => console.error(err));
};

export const updateProduct = (id, data, callback) => {
  axios.put(`${API}/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => callback(res.data))
  .catch(err => console.error(err));
};

export const deleteProduct = (id, callback) => {
  axios.delete(`${API}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => callback(res.data))
  .catch(err => console.error(err));
};

export const getCategories = (callback) => {
  axios.get(`${API}/products/categories`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => callback(res.data))
  .catch(err => console.error(err));
};
