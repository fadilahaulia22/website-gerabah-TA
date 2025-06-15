import { pool } from "../../database.js";

export const createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, subtotal_price } = req.body;

    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, subtotal_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, product_id, quantity, subtotal_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).json({ message: "Gagal membuat order item" });
  }
};

export const getOrderItemsByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT oi.*, p.name AS product_name,
      p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ message: "Gagal mengambil item pesanan" });
  }
};

