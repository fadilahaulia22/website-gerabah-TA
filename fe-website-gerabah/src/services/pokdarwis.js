// src/services/dashboardService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/pokdarwis";
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
};

// Ambil kunjungan yang ditangani pegawai
export const fetchStaffVisits = async () => {
  const response = await axios.get(`${API_URL}/visits`, { headers });
  return response.data;
};

// Ambil data bagi hasil pegawai bulanan
export const fetchStaffProfitShare = async () => {
  const response = await axios.get(`${API_URL}/bagihasil`, { headers });
  return response.data;
};
