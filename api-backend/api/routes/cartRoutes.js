import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controller/cartController.js";

const cartRoutes = express.Router();

cartRoutes.get("/", authenticateToken, getCart);
cartRoutes.post("/", authenticateToken, addToCart);
cartRoutes.put("/:productId", authenticateToken, updateCartItem);
cartRoutes.delete("/:productId", authenticateToken, removeCartItem);

export default cartRoutes;