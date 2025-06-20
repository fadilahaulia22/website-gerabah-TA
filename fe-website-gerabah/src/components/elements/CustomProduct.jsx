// components/CustomOrderForm.jsx
import { useState } from "react";
import { createOrder } from "../../services/orderCustomService";

const CustomOrderForm = ({ isOpen, onClose }) => {

  const [customDesc, setCustomDesc] = useState("");
  const [customImage, setCustomImage] = useState(null);
  const [jumlahJenis, setJumlahJenis] = useState(1);
  const [ukuran, setUkuran] = useState("");
  const [warna, setWarna] = useState("");
  const [bahan, setBahan] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const hargaSatuan = 100000;
  const biayaTambahan = customDesc.length > 100 || bahan.toLowerCase().includes("khusus") ? 25000 : 0;
  const totalHarga = jumlahJenis * hargaSatuan + biayaTambahan;

  const resetForm = () => {
  setCustomDesc("");
  setCustomImage(null);
  setJumlahJenis(1);
  setUkuran("");
  setWarna("");
  setBahan("");
  setMetodePembayaran("");
  setMetodePengiriman("");
  setDeliveryDate("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", customDesc);
    formData.append("customImage", customImage);
    formData.append("jumlahJenis", jumlahJenis);
    formData.append("ukuran", ukuran);
    formData.append("warna", warna);
    formData.append("bahan", bahan);
    formData.append("metodePembayaran", metodePembayaran);
    formData.append("metodePengiriman", metodePengiriman);
    formData.append("deliveryDate", deliveryDate);
    formData.append("totalHarga", totalHarga);

    try {
     await createOrder(formData);

      // const data = await res.json();
      alert("Pesanan custom berhasil dikirim!");
      
      resetForm();
      onClose();

    } catch (err) {
      alert("Gagal mengirim pesanan custom.");
      console.log("error :", err);
    }
  };

    if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[999] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded shadow max-h-full w-full max-w-xl overflow-y-auto p-5">
      <h2 className="text-xl font-bold mb-4">Formulir Pesanan Custom</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={customDesc}
          onChange={(e) => setCustomDesc(e.target.value)}
          placeholder="Deskripsikan pesanan Anda"
          className="w-full border rounded p-2"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCustomImage(e.target.files[0])}
          required
        />

        <input
          type="number"
          value={jumlahJenis}
          onChange={(e) => setJumlahJenis(e.target.value)}
          min={1}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Ukuran"
          value={ukuran}
          onChange={(e) => setUkuran(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Warna"
          value={warna}
          onChange={(e) => setWarna(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Bahan"
          value={bahan}
          onChange={(e) => setBahan(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={metodePembayaran}
          onChange={(e) => setMetodePembayaran(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Pilih Metode Pembayaran</option>
          <option value="transfer">Transfer</option>
          <option value="cod">COD</option>
        </select>

        <select
          value={metodePengiriman}
          onChange={(e) => setMetodePengiriman(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Pilih Metode Pengiriman</option>
          <option value="kurir">Kurir</option>
          <option value="ambil">Ambil di tempat</option>
        </select>

        <div className="font-medium">💰 Total Harga: Rp {totalHarga.toLocaleString()}</div>

        <div className="p-3 bg-gray-100 rounded text-sm">
          <p><strong>Review:</strong></p>
          <ul className="list-disc list-inside">
            <li>{jumlahJenis} item dengan harga dasar Rp{hargaSatuan.toLocaleString()}</li>
            {biayaTambahan > 0 && <li>+ Biaya tambahan Rp{biayaTambahan.toLocaleString()}</li>}
            <li>Ukuran: {ukuran || '-'}</li>
            <li>Warna: {warna || '-'}</li>
            <li>Bahan: {bahan || '-'}</li>
            <li>Pembayaran: {metodePembayaran || '-'}</li>
            <li>Pengiriman: {metodePengiriman || '-'}</li>
          </ul>
        </div>

        <div className="flex justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            ❌ Batal
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            🛒 Kirim Pesanan
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default CustomOrderForm;
