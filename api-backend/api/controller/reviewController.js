import { pool } from "../../database.js";


export const addProductReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!product_id || !rating) {
    return res.status(400).json({ message: "Product ID dan rating wajib diisi" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, user_id, rating, comment]
    );

    res.status(201).json({
      message: "Review berhasil ditambahkan",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Gagal menyimpan review:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan review" });
  }
};

