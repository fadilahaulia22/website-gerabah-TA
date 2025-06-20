import { pool } from "../../database.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
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
                id: user.id,
              });
            } else {
              res.status(401).json({ error: "Kata sandi salah" });
            }
        } else {
          res.status(404).json({ error: `User dengan nama ${req.body.username} tidak ditemukan.` });
        }
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Terjadi kesalahan saat login." });
      }
}

export const register = async (req, res) => {    
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
    
}