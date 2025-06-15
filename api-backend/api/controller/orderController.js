import { pool } from "../../database.js";

export const createOrder = async (req, res) => {
  try {
    const { user_id, order_type, status, total_price, payment_status } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (user_id, order_type, status, total_price, payment_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, order_type, status, total_price, payment_status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Gagal membuat order" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Gagal mengambil order:", err);
    res.status(500).json({ message: "Gagal mengambil detail order" });
  }
};

// GET /api/orders/user/:userId
export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil order user:", err);
    res.status(500).json({ message: "Gagal mengambil pesanan user" });
  }
};

