import { pool } from "../../database.js";

// Ambil cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows: cartRows } = await pool.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
       FROM carts c
       JOIN cart_items ci ON ci.cart_id = c.id
       JOIN products p ON p.id = ci.product_id
       WHERE c.user_id = $1`, [userId]
    );
    res.json(cartRows);
  } catch (err) {
    console.error("Gagal ambil keranjang:", err);
    res.status(500).json({ error: "Gagal mengambil keranjang" });
  }
};

// Tambah item ke cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    // cari cart user
    const { rows: existingCart } = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    let cartId = existingCart[0]?.id;

    if (!cartId) {
      const { rows } = await pool.query("INSERT INTO carts (user_id) VALUES ($1) RETURNING id", [userId]);
      cartId = rows[0].id;
    }

    // cek jika produk sudah ada
    const { rows: existingItem } = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, product_id]
    );

    if (existingItem.length > 0) {
      // update quantity
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
        [quantity, cartId, product_id]
      );
    } else {
      // tambah baru
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [cartId, product_id, quantity]
      );
    }

    res.status(200).json({ message: "Item ditambahkan ke keranjang" });
  } catch (err) {
    console.error("Gagal tambah item:", err);
    res.status(500).json({ error: "Gagal tambah ke keranjang" });
  }
};

// Update item
export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId  } = req.params;
  const { quantity } = req.body;

  try {
    const { rows: cartRows } = await pool.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    const cartId = cartRows[0]?.id;
    if (!cartId) return res.status(404).json({ message: "Cart tidak ditemukan" });

    if(quantity > 0 ){
      await pool.query(
                "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productId]
      );
      } else {
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
      );
    }
      res.json({ message: "Jumlah item diperbarui" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update item" });
  }
};

// Hapus item
// controller/cartController.js

export const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    // Cari cart milik user
    const cartRes = await pool.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    const cartId = cartRes.rows[0]?.id;

    if (!cartId) return res.status(404).json({ error: "Keranjang tidak ditemukan" });

    // Hapus item berdasarkan cart_id & product_id
    await pool.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    res.json({ message: "Item berhasil dihapus dari keranjang" });
  } catch (err) {
    console.error("Gagal hapus item:", err);
    res.status(500).json({ error: "Gagal menghapus item dari keranjang" });
  }
};

