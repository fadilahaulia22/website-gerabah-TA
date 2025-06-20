import { pool } from "../../database.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createProduct = async(req, res) => {
    // ADD
    const { name, description, price, stock, is_custom, category_id } = req.body;
    const filename = req.file.filename;
    const image_url = `http://localhost:3000/images/${filename}`;

    try{
      // 1. Cek apakah category_id ada di tabel categories
      const categoryCheck = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [category_id]
      );

      if (categoryCheck.rowCount === 0) {
        return res.status(400).json({ error: "Kategori tidak ditemukan" });
      }

      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock, image_url, is_custom,
        category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
              [name, description, price, stock, image_url, is_custom, category_id]
      );
      res.status(201).json(result.rows[0]);
    }catch(error){
      console.error("Error inserting product:",error );
      res.status(500).json({ error: "Internal server error" });
    }
}


export const getAllProducts = async(req, res) => {
// READ
  try {
    const result = await pool.query(`SELECT 
    p.*, 
    c.name AS category_name,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(r.rating) AS total_reviews

  FROM products p 
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_reviews r ON r.product_id = p.id
  GROUP BY p.id, c.name
  ORDER BY p.id ASC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
}

// read berdasarkan id
export const getProductById  = async (req, res) => {

  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`, 
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    const product = result.rows[0];

     const reviewResult = await pool.query(
      `SELECT r.rating, r.comment, r.created_at, u.username
       FROM product_reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    const ratings = reviewResult.rows.map(r => r.rating);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

    return res.json({
      ...product,
      reviews: reviewResult.rows,
      rating: avgRating,
      total_ratings: ratings.length
    });

    // res.json(result.rows[0]); 
  } catch (err) {
    console.error("Gagal mengambil produk:", err);
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
}

export const updateProduct = async (req, res) => {

//UPDATE    
    const id = req.params.id;
    const { name, description, price, stock, is_custom, category_id } = req.body;

    let image_url;
    if (req.file) {
      const filename = req.file.filename;
      image_url = `http://localhost:3000/images/${filename}`;
    }
    
  try{

    let query;
    let params;

    if (image_url) {
      query = `
        UPDATE products SET
          name = $1,
          description = $2,
          price = $3,
          stock = $4,
          is_custom = $5,
          category_id = $6,
          image_url = $7
        WHERE id = $8
      `;
      params = [name, description, price, stock, is_custom, category_id, image_url, id];
    } else {
      query = `
        UPDATE products SET
          name = $1,
          description = $2,
          price = $3,
          stock = $4,
          is_custom = $5,
          category_id = $6
        WHERE id = $7
      `;
      params = [name, description, price, stock, is_custom, category_id, id];
    }

    await pool.query(query, params);

  res.json({
    message: "product berhasil diupdate"
  });
}catch(err){
      res.status(500).json({ error: "Gagal update produk" });
}
}


export const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query("SELECT image_url FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan" });

    const imagePath = result.rows[0].image_url?.replace("http://localhost:3000/images/", "");
    if (imagePath) {
      fs.unlink(path.join(__dirname, "..", "images", imagePath), (err) => {
        if (err) console.error("Gagal menghapus gambar:", err);
      });
    }

    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.send("Produk berhasil dihapus");
  } catch {
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
};

