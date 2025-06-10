import { useEffect, useState } from "react";

const dummyKunjungan = [
  {
    id: 1,
    namaPengunjung: "Ahmad Fauzi",
    tanggal: "2025-05-12",
    asal: "Bandung",
    jumlahOrang: 4,
    totalBayar: 400000, // asumsi
  },
  {
    id: 2,
    namaPengunjung: "Rina Aprilia",
    tanggal: "2025-05-13",
    asal: "Jakarta",
    jumlahOrang: 2,
    totalBayar: 200000,
  },
];

const DashboardPokdarwis = () => {
  const [kunjungan, setKunjungan] = useState([]);
  const [kunjunganHariIni, setKunjunganHariIni] = useState([]);

  useEffect(() => {
    // Simulasikan fetch data dari backend
    setKunjungan(dummyKunjungan);

    const today = new Date().toISOString().split("T")[0];
    const todayBookings = dummyKunjungan.filter((k) => k.tanggal === today);
    setKunjunganHariIni(todayBookings);
  }, []);

  const hitungKomisi = (total) => {
    const komisiPokdarwis = (total * 0.3) / 2;
    return komisiPokdarwis;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pokdarwis</h1>

      {/* Notifikasi Kunjungan Hari Ini */}
      {kunjunganHariIni.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          <h2 className="font-semibold mb-2">📣 Notifikasi Hari Ini</h2>
          {kunjunganHariIni.map((k) => (
            <p key={k.id}>
              Hari ini ({k.tanggal}) ada kunjungan dari{" "}
              <span className="font-semibold">{k.namaPengunjung}</span> sebanyak{" "}
              <span className="font-semibold">{k.jumlahOrang}</span> orang. Siapkan untuk memandu acara study wisata gerabah.
            </p>
          ))}
        </div>
      )}

      {/* Daftar Kunjungan */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Daftar Kunjungan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jumlah Orang</th>
                <th className="py-3 px-4">Total Bayar</th>
                <th className="py-3 px-4">Komisi Anda (30% ÷ 2)</th>
              </tr>
            </thead>
            <tbody>
              {kunjungan.map((k) => (
                <tr key={k.id} className="border-t">
                  <td className="py-2 px-4">{k.namaPengunjung}</td>
                  <td className="py-2 px-4">{k.tanggal}</td>
                  <td className="py-2 px-4">{k.jumlahOrang}</td>
                  <td className="py-2 px-4">Rp {k.totalBayar.toLocaleString()}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">
                    Rp {hitungKomisi(k.totalBayar).toLocaleString()}
                  </td>
                </tr>
              ))}
              {kunjungan.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Belum ada kunjungan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPokdarwis;
