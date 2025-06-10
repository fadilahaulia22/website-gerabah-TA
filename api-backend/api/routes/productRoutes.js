import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controller/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";


const productRoutes = express.Router();

productRoutes.post("/", authenticateToken, upload.single("image_url"), createProduct);
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);
productRoutes.put("/:id", authenticateToken, upload.single("image_url"), updateProduct);
productRoutes.delete("/:id", authenticateToken, deleteProduct);

export default productRoutes;

