import express from "express";
import { createOrder, getOrderById, getOrdersByUserId } from "../controller/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post("/", createOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.get("/user/:userId", getOrdersByUserId); 

export default orderRoutes;
