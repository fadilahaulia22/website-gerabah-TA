import { pool } from "../../database.js";

// Ambil data kunjungan yang ditangani/staff_id = current user
export const getVisitForStaff = async (req, res) => {
  try {
    const staffId = req.user.id;
    const result = await pool.query(`
      SELECT v.*, u.username AS pengunjung
      FROM visits v
      LEFT JOIN users u ON v.visitor_id = u.id
      WHERE v.staff_id = $1
      ORDER BY visit_date DESC, visit_time DESC
    `, [staffId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Gagal ambil kunjungan:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Ambil rekap bagi hasil bulanan untuk staff ini
export const getStaffProfitShareMonthly = async (req, res) => {
  try {
    const staffId = req.user.id;

    const result = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', vp.paid_at), 'YYYY-MM') AS bulan,
        SUM(vp.staff_share) AS total_share
      FROM visit_payment vp
      JOIN visits v ON vp.visit_id = v.id
      WHERE v.staff_id = $1
      GROUP BY 1
      ORDER BY 1 DESC
    `, [staffId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Gagal ambil bagi hasil:", err);
    res.status(500).json({ error: "Server error" });
  }
};
