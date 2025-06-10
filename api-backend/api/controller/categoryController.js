import { pool } from "../../database.js";

export const createCategory = async (req, res) =>{

  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Nama kategori tidak boleh kosong" });
    }

    // Cek apakah kategori sudah ada
    const check = await pool.query("SELECT * FROM categories WHERE name = $1", [name]);
    if (check.rowCount > 0) {
      return res.status(400).json({ error: "Kategori sudah ada" });
    }
    // Tambahkan ke DB
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Gagal menambahkan kategori:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export const getCategories = async(req, res) => {

//READ CATEGORY
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil kategori:", err);
    res.status(500).json({ error: "Gagal mengambil kategori dari server" });
  }
}

export const updateCategory = async(req, res) => {

//UPDATE CATEGORY
    const { name } = req.body;
    
  try{
    await pool.query(
    "UPDATE categories SET name = $1 WHERE id = $2",
      [name, req.params.id]
  );
  res.json({
    message: "categories berhasil diupdate"
  });
}catch(err){
      res.status(500).json({ error: "Gagal update categories" });
}
}

export const deleteCategory = async(req, res) => {

//DELETE CATEGORY
  try {
  await pool.query("DELETE FROM categories WHERE id= $1", [req.params.id]);
  res.send("categories berhasil dihapus");
  }catch(err){
        res.status(500).json({ error: "Gagal menghapus categories" });
  }
}