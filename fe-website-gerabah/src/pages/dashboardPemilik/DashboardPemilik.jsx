import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { getProducts } from "../../services/product.services";

const DashboardPemilik = () => {
  const navigate = useNavigate();

  const [statistik, setStatistik] = useState({
    penjualan: 0,
    produk: 0,
    kunjungan: 0,
    stokHabis: 0,
    customOrders: 0,
    pembelianPengrajin: 0,
  });
  const [penjualanHarian, setPenjualanHarian] = useState([]);
  const [kunjunganMingguan, setKunjunganMingguan] = useState([]);

  useEffect(() => {
    document.title = "Dashboard Pemilik";

    getProducts((dataProduct) => {
      setStatistik(prev => ({
        ...prev,
      penjualan: 156,
      produk: dataProduct.length,
      kunjungan: 45,
      stokHabis: dataProduct.filter(p => p.stock === 0).length,
      customOrders: 12,
      pembelianPengrajin: 8,
    }));
    });

    setPenjualanHarian([
      { tanggal: "10/05", total: 5 },
      { tanggal: "11/05", total: 8 },
      { tanggal: "12/05", total: 10 },
      { tanggal: "13/05", total: 12 },
      { tanggal: "14/05", total: 15 },
    ]);
    setKunjunganMingguan([
      { hari: "Senin", jumlah: 5 },
      { hari: "Selasa", jumlah: 6 },
      { hari: "Rabu", jumlah: 8 },
      { hari: "Kamis", jumlah: 10 },
      { hari: "Jumat", jumlah: 16 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 md:px-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Pemilik</h1>

        {/* Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {[
            { label: "Penjualan", value: statistik.penjualan, color: "bg-green-100", text: "text-green-800" },
            { label: "Produk", value: statistik.produk, color: "bg-blue-100", text: "text-blue-800" },
            { label: "Kunjungan", value: statistik.kunjungan, color: "bg-yellow-100", text: "text-yellow-800" },
            { label: "Stok Habis", value: statistik.stokHabis, color: "bg-red-100", text: "text-red-800" },
            { label: "Custom Order", value: statistik.customOrders, color: "bg-purple-100", text: "text-purple-800" },
            { label: "Pembelian", value: statistik.pembelianPengrajin, color: "bg-orange-100", text: "text-orange-800" },
          ].map((item, i) => (
            <div key={i} className={`${item.color} p-4 rounded-xl shadow-sm`}>
              <h2 className={`text-sm font-medium ${item.text}`}>{item.label}</h2>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-lg font-semibold mb-4">Grafik Penjualan Harian</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={penjualanHarian}>
                <XAxis dataKey="tanggal" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-lg font-semibold mb-4">Kunjungan Mingguan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={kunjunganMingguan}>
                <XAxis dataKey="hari" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="jumlah" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aksi Cepat */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Aksi Cepat</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Kelola Produk", route: "/product-management" },
              { label: "Laporan Penjualan", route: "/sales-report" },
              { label: "Kelola Kunjungan", route: "/visits" },
              { label: "Pembelian Pengrajin", route: "/supplier-purchases" },
              { label: "Pesanan Custom", route: "/custom-orders" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.route)}
                className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPemilik;
