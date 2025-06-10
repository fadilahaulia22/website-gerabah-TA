import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controller/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const categoryRoutes = express.Router();

categoryRoutes.post("/", authenticateToken, createCategory);
categoryRoutes.get("/", getCategories);
categoryRoutes.put("/:id", authenticateToken, updateCategory);
categoryRoutes.delete("/:id", authenticateToken, deleteCategory);

export default categoryRoutes;