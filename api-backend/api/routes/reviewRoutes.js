import express from "express";
import { addProductReview, getReviewsByProduct, getUserReviews, updateProductReview } from "../controller/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/", authenticateToken, addProductReview);
reviewRoutes.get("/product/:productId",getReviewsByProduct);
reviewRoutes.put("/:id",authenticateToken, updateProductReview);
reviewRoutes.get("/user",authenticateToken, getUserReviews);

export default reviewRoutes;