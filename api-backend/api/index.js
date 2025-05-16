import express from "express";
import cors from "cors";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { pool } from "../database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));
const PORT = process.env.PORT || 3000;
const imageDir = path.join(__dirname, "images");


if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}


// Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));


const initDefaultAccounts = async () => {
  const defaultUsers = [
    {
      username: "pemilik",
      email: "pemilik@example.com",
      password: "pemilik123", // Password sebelum hash
      role: "pemilik",
    },
    {
      username: "pokdarwis",
      email: "pokdarwis@example.com",
      password: "pokdarwis123",
      role: "pokdarwis",
    },
  ];
  for (const user of defaultUsers) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [user.username]);
    if (result.rows.length === 0) {
      const hashedPassword = await argon2.hash(user.password);
      await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
        [user.username, user.email, hashedPassword, user.role]
      );
      console.log(`Default user '${user.username}' telah dibuat.`);
    } else {
      console.log(`Default user '${user.username}' sudah ada.`);
    }
  }
};

// Public Routes (No authentication required)
app.post("/api/login", async (req, res) => {
  try{
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      req.body.username,
    ]);

    if (result.rows.length > 0) {
        const user = result.rows[0];
        if (await argon2.verify(user.password, req.body.password)) {
          const token = jwt.sign(user, process.env.SECRET_KEY);
          
          res.json({
            token,
            message: "Login berhasil.",
            username:user.username,
            role:user.role,
          });
        } else {
          res.status(401).json({ error: "Kata sandi salah" });
        }
    } else {
      res.status(404).send(`user dengan nama ${req.body.username} tidak ditemukan.`);
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat login." });
  }
});

app.post("/api/register", async (req, res) => {

  const {username, email, password, role} = req.body;

  if(!username || !email || !password || !role){
    return res.status(400).json({message: "Semua field harus diisi!"});
  }

  try{

  const hash = await argon2.hash(req.body.password);
    console.log("user name : ",req.body.username)

  if (req.body.username === "")
    throw new Error("Error ihh");
  await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.body.username, req.body.email, hash, req.body.role]
  );
  res.send("Pendaftaran berhasil");
}catch(error){
  console.log(error);
  res.status(500).send("Terjadi kesalahan saat registrasi.");
}
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).send("Token tidak valid.");
    }
  } else {
    console.error(authorization)
    res.status(401).send("Anda belum login (tidak ada otorisasi).");
  }
}


//  Konfigurasi upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images")); // Folder tujuan
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// add category
app.post("/api/products/categories", authenticateToken, async (req,res) => {
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
});

//READ CATEGORY
app.get("/api/products/categories", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil kategori:", err);
    res.status(500).json({ error: "Gagal mengambil kategori dari server" });
  }
});

//UPDATE CATEGORY
app.put("/api/products/categories/:id", authenticateToken, async (req, res) => {
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
});

//DELETE CATEGORY
app.delete("/api/products/categories/:id", authenticateToken, async (req, res) => {
  try {
  await pool.query("DELETE FROM categories WHERE id= $1", [req.params.id]);
  res.send("categories berhasil dihapus");
  }catch(err){
        res.status(500).json({ error: "Gagal menghapus categories" });
  }
});



// ADD
app.post("/api/products", authenticateToken, upload.single("image_url"), async (req, res) => {
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
  });

// READ
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
    p.*, 
    c.name AS category_name 
  FROM products p 
  LEFT JOIN categories c ON p.category_id = c.id`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
});

// read berdasarkan id
app.get("/api/products/:id", async (req, res) => {
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
    res.json(result.rows[0]); 
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
});

//UPDATE
app.put("/api/products/:id",  upload.single("image_url"), authenticateToken, async (req, res) => {
    
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
});

//DELETE
app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
  await pool.query("DELETE FROM products WHERE id= $1", [req.params.id]);
  res.send("Produk berhasil dihapus");
  }catch(err){
        res.status(500).json({ error: "Gagal menghapus produk" });
  }
});


//delet image if data dihapus
// app.delete("/api/products/:id", authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query("SELECT image_url FROM products WHERE id = $1", [req.params.id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Produk tidak ditemukan" });
//     }

//     const imagePath = result.rows[0].image_url?.replace("http://localhost:3000/images/", "");
//     if (imagePath) {
//       fs.unlink(path.join(__dirname, "images", imagePath), (err) => {
//         if (err) console.error("Gagal menghapus file gambar:", err);
//       });
//     }

//     await pool.query("DELETE FROM products WHERE id= $1", [req.params.id]);
//     res.send("Produk berhasil dihapus");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Gagal menghapus produk" });
//   }
// });

app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  await initDefaultAccounts(); 
});

