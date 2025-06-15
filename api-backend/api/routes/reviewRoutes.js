import express from "express";
import { addProductReview } from "../controller/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/reviews", authenticateToken, addProductReview);

export default reviewRoutes;