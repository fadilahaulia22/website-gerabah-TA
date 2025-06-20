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

    const already = await pool.query(
      `SELECT id FROM product_reviews WHERE product_id = $1 AND user_id = $2`,
      [product_id, user_id]
    );
    if (already.rows.length) {
      return res.status(400).json({ message: "Anda sudah memberi rating" });
    }
  } catch (error) {
    console.error("Gagal menyimpan review:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan review" });
  }
};

export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await pool.query(
      `SELECT r.id, r.user_id, u.username,
              r.rating, r.comment, r.created_at
       FROM product_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );
    const avg = await pool.query(
      `SELECT AVG(rating)::numeric(10,2) AS avg_rating
       FROM product_reviews
       WHERE product_id = $1`,
      [productId]
    );
    res.json({ reviews: reviews.rows, average: avg.rows[0].avg_rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil review" });
  }
};

export const updateProductReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user_id = req.user?.id;

  try {
    // Validasi kepemilikan review
    const existing = await pool.query(
      `SELECT * FROM product_reviews WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );
    if (!existing.rows.length) {
      return res.status(403).json({ message: "Tidak punya akses" });
    }
    const result = await pool.query(
      `UPDATE product_reviews
       SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [rating, comment, id]
    );
    res.json({ review: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update gagal" });
  }
};


export const getUserReviews = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT r.id, r.product_id, r.rating, r.comment, u.username
       FROM product_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error getUserReviews:", err.message);
    res.status(500).json({ message: "Gagal mengambil review pengguna." });
  }
};
