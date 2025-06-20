import { useEffect, useState } from "react";
import { fetchStaffProfitShare, fetchStaffVisits } from "../services/pokdarwis";
import { useNavigate } from "react-router";
import { isPokdarwis } from "../utils/auth.utils";

const DashboardPokdarwis = () => {
  const [kunjungan, setKunjungan] = useState([]);
  const [bagiHasil, setBagiHasil] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
  if (!isPokdarwis()) {
    navigate("/");
    return;
  }
  fetchData();
}, []);

  const fetchData = async () => {
     try {
    const kunjungan = await fetchStaffVisits();
    setKunjungan(kunjungan);

    const bagiHasil = await fetchStaffProfitShare();
    setBagiHasil(bagiHasil);
  } catch (err) {
    console.error("Gagal fetch data dashboard pegawai:", err);
  }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Dashboard Pegawai</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Riwayat Kunjungan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-orange-100">
              <tr>
                <th className="border px-3 py-2">Tanggal</th>
                <th className="border px-3 py-2">Jam</th>
                <th className="border px-3 py-2">Pengunjung</th>
                <th className="border px-3 py-2">Jumlah</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {kunjungan.map((v) => (
                <tr key={v.id}>
                  <td className="border px-3 py-1">{v.visit_date}</td>
                  <td className="border px-3 py-1">{v.visit_time}</td>
                  <td className="border px-3 py-1">{v.pengunjung || "-"}</td>
                  <td className="border px-3 py-1">{v.price / 20000} orang</td>
                  <td className="border px-3 py-1">
                    <span className={`px-2 py-1 rounded text-white ${v.payment_status === "sudah_bayar" ? "bg-green-500" : "bg-yellow-500"}`}>
                      {v.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Bagi Hasil Bulanan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-3 py-2">Bulan</th>
                <th className="border px-3 py-2">Total Share (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {bagiHasil.map((b, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-1">{b.bulan}</td>
                  <td className="border px-3 py-1">Rp {parseInt(b.total_share).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPokdarwis;
