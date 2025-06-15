import { pool } from "../../database.js";

export const createPayment = async (req, res) => {
    const client = await pool.connect();

  try {
    const { order_id, payment_type, amount, payment_proof_url } = req.body;

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO payments (order_id, payment_type, amount, payment_proof_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, payment_type, amount, payment_proof_url]
    );

    // 2. Ambil semua item dalam pesanan
    const itemsResult = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [order_id]
    );

    // 3. Kurangi stok masing-masing produk
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE products
          SET stock = GREATEST(stock - $1, 0)
          WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Gagal membuat pembayaran" });
  }
};


