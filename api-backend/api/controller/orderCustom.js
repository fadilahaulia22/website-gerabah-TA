import { pool } from "../../database.js";

export const createCustomOrder = async (req, res) => {
const {
    description,
    jumlahJenis,
    totalHarga,
    ukuran,
    warna,
    bahan,
    metodePembayaran,
    metodePengiriman,
    deliveryDate,
  } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ error: "User tidak terautentikasi." });
  }

  const userId = req.user.id;
  console.log("userId :",userId);

  const jumlah = parseInt(jumlahJenis);
  const total = parseInt(totalHarga);

  const metodeBayar = jumlah > 1 ? "dp" : "full";
  const dpAmount = metodeBayar === "dp" ? total / 2 : total;

  const imagePath = req.file ? `/images/${req.file.filename}` : null;

  try {
    // 1. Simpan ke tabel orders
    const order = await pool.query(
      `INSERT INTO orders (user_id, order_type, status, total_price, payment_status)
       VALUES ($1, 'custom', 'Menunggu Konfirmasi', $2, $3) RETURNING id`,
      [userId, total, metodeBayar === "full" ? "lunas" : "belum_bayar"]
    );

    const orderId = order.rows[0].id;

    // 2. Simpan ke tabel custom_order_details
    await pool.query(
      `INSERT INTO custom_order_details (
        order_id, custom_description, jumlah_jenis, ukuran, warna, bahan,
        metode_pembayaran, metode_pengiriman, delivery_date,
        dp_amount, dp_payment_proof_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        orderId,
        description,
        jumlah,
        ukuran,
        warna,
        bahan,
        metodePembayaran,
        metodePengiriman,
        deliveryDate || null,
        dpAmount,
        imagePath,
      ]
    );

    res.status(201).json({
      success: true,
      orderId,
      metodeBayar,
      dpAmount,
      image: imagePath,
    });
  } catch (error) {
    console.error("❌ ERROR createCustomOrder:", error);
    res.status(500).json({ error: "Gagal membuat pesanan custom." });
  }
};

// update

// Controller untuk update status pesanan custom
export const updateCustomOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatus = ["Menunggu Konfirmasi", "Sedang Diproses", "Selesai", "Ditolak"];

  // ✅ Cek role
  if (req.user?.role !== "pemilik") {
    return res.status(403).json({ error: "Akses ditolak. Hanya pemilik yang dapat mengubah status." });
  }
  console.log("🔐 User role:", req.user?.role);

  // ✅ Validasi status
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Status tidak valid." });
  }

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 AND order_type = 'custom'",
      [status, id]
    );
    console.log("Update status rowCount:", result.rowCount);
    console.log(" id :",id);
    res.json({ message: "Status berhasil diperbarui." });

  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Gagal memperbarui status." });
  }
};


export const getOrderCustomRoutes = async (req , res) => {
  if (req.user.role !== "pemilik") {
    return res.status(403).json({ error: "Akses ditolak." });
  }

  try {
    const result = await pool.query(`
      SELECT o.id, o.total_price, o.status, o.payment_status, cod.*
      FROM orders o
      JOIN custom_order_details cod ON o.id = cod.order_id
      WHERE o.order_type = 'custom'
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Gagal mengambil data pesanan custom:", error);
    res.status(500).json({ error: "Gagal mengambil data pesanan custom." });
  }
};

// 
export const jumlahCustomOrder = async (req, res) => {

  try {
    const result = await pool.query("SELECT COUNT(*) FROM custom_order_details");
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data custom order" });
  }
};
