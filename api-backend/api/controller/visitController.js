import { pool } from "../../database.js";
import { sendBookingEmail } from "../utils/mailer.js";

// Tambah kunjungan
export const createVisit = async (req, res) => {
  const { visit_date, visit_time, jumlah_orang, nama, email, no_hp } = req.body;
  const visitorId = req.user?.id || null;

  try {
    if (!visit_date || !visit_time || !jumlah_orang || !nama || !email || !no_hp) {
      return res.status(400).json({ error: "Lengkapi semua data!" });
    }

    // Cek apakah jadwal sudah dibooking
    const check = await pool.query(
      `SELECT * FROM visits WHERE visit_date = $1 AND visit_time = $2`,
      [visit_date, visit_time]
    );

    if (check.rowCount > 0) {
      return res.status(409).json({ error: "Jadwal kunjungan sudah dibooking." });
    }

    const staffQuery = await pool.query(
      `SELECT id FROM users WHERE username = 'pokdarwis' LIMIT 1`
    );
    if (staffQuery.rowCount === 0) {
      return res.status(404).json({ error: "Staff 'pokdarwis' tidak ditemukan." });
    }
    const staffId = staffQuery.rows[0].id;

    const pricePerPerson = 20000; 
    const totalPrice = pricePerPerson * jumlah_orang;

    // Insert visit
    const insert = await pool.query(
      `INSERT INTO visits (visitor_id, staff_id, visit_date, visit_time, price, payment_status)
       VALUES ($1, $2, $3, $4, $5, 'sudah_bayar') RETURNING *`,
      [visitorId, staffId, visit_date, visit_time, totalPrice]
    );


    const visitId = insert.rows[0].id;
    const staffShare = totalPrice * 0.2;
    const ownerShare = totalPrice * 0.8;

    // Simpan langsung ke visit_payment
    await pool.query(
      `INSERT INTO visit_payment (visit_id, total_amount, staff_share, owner_share)
       VALUES ($1, $2, $3, $4)`,
      [visitId, totalPrice, staffShare, ownerShare]
    );

    res.status(201).json({
        message: visitorId
        ? "Kunjungan berhasil dibooking oleh user terautentikasi!"
        : "Kunjungan berhasil dibooking sebagai pengunjung tamu.",
      visit: insert.rows[0],
      });
        // TODO: kirim email 
// ✅ Kirim Email Konfirmasi
    sendBookingEmail({
      to: email,
      name: nama,
      date: visit_date,
      time: visit_time,
      jumlah: jumlah_orang,
    }).catch((e) => console.error("Gagal kirim email:", e));


  } catch (err) {
    console.error("Error saat booking kunjungan:", err);
    res.status(500).json({ error: "Gagal booking kunjungan." });
  }
};

// Ambil semua kunjungan
export const getAllVisits = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, u1.username as visitor_name, u2.username as staff_name 
      FROM visits v 
      LEFT JOIN users u1 ON v.visitor_id = u1.id
      LEFT JOIN users u2 ON v.staff_id = u2.id
      ORDER BY visit_date DESC, visit_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil data kunjungan:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update status pembayaran
export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE visits SET payment_status = $1 WHERE id = $2",
      [status, id]
    );
    res.json({ message: "Status pembayaran berhasil diupdate" });
  } catch (err) {
    console.error("Gagal update status pembayaran:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Tambah pembayaran kunjungan
export const addVisitPayment = async (req, res) => {
  const { visit_id, total_amount, staff_share, owner_share } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO visit_payment (visit_id, total_amount, staff_share, owner_share)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [visit_id, total_amount, staff_share, owner_share]
    );

    // Update status kunjungan
    await pool.query(
      `UPDATE visits SET payment_status = 'sudah_bayar' WHERE id = $1`,
      [visit_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Gagal menambahkan pembayaran:", err);
    res.status(500).json({ error: "Gagal menambahkan pembayaran kunjungan" });
  }
};

// Ambil semua pembayaran kunjungan
export const getAllVisitPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, v.visit_date, v.visit_time 
      FROM visit_payment p 
      LEFT JOIN visits v ON p.visit_id = v.id
      ORDER BY paid_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil pembayaran:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getRekapBagiHasilBulanan = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', paid_at), 'YYYY-MM') AS bulan,
        SUM(total_amount) AS total_pendapatan,
        SUM(staff_share) AS untuk_pegawai,
        SUM(owner_share) AS untuk_pemilik
      FROM visit_payment
      GROUP BY 1
      ORDER BY 1 DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil rekap bagi hasil:", err);
    res.status(500).json({ error: "Server error" });
  }
};



