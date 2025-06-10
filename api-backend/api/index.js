import express from "express";
import cors from "cors";
// import argon2 from "argon2";
// import jwt from "jsonwebtoken";
// import multer from "multer";
import path from "path";
import { pool } from "../database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imageDir = path.join(__dirname, "images");
const PORT = process.env.PORT || 3000;


if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}


// // Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api", authRoutes);
app.use("/api/products/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/cart", cartRoutes); 



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



app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  await initDefaultAccounts(); 
});
